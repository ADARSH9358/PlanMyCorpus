"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  computeOtherCalculator,
  OTHER_CALCULATORS,
  type CalculatorField,
  type OtherCalculatorConfig,
  type OtherCalculatorId,
} from "@/lib/other-calculators";

const clamp = (value: number, min: number, max: number): number => {
  if (Number.isNaN(value)) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
};

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatCompactAmount = (value: number): string => {
  const abs = Math.abs(value);

  if (abs >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)} Billion`;
  }
  if (abs >= 10_000_000) {
    return `${(value / 10_000_000).toFixed(2)} Crore`;
  }
  if (abs >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)} Million`;
  }
  if (abs >= 100_000) {
    return `${(value / 100_000).toFixed(2)} Lakh`;
  }

  return formatCurrency(value);
};

const formatTooltipValue = (value: unknown): string => {
  const numericValue =
    typeof value === "number" ? value : Number.parseFloat(String(value));

  if (!Number.isFinite(numericValue)) {
    return "-";
  }

  return formatCompactAmount(numericValue);
};

type SliderFieldProps = {
  field: CalculatorField;
  value: number;
  onChange: (value: number) => void;
};

function SliderField({ field, value, onChange }: SliderFieldProps) {
  const [textValue, setTextValue] = useState(String(value));
  const [isEditingText, setIsEditingText] = useState(false);

  return (
    <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="text-sm font-medium text-slate-800">{field.label}</label>
        <input
          type="text"
          inputMode="decimal"
          value={isEditingText ? textValue : String(value)}
          onFocus={() => {
            setTextValue(String(value));
            setIsEditingText(true);
          }}
          onBlur={() => {
            setIsEditingText(false);

            if (textValue.trim() === "") {
              setTextValue(String(value));
            }
          }}
          onChange={(event) => {
            const next = event.target.value;

            if (!/^\d*\.?\d*$/.test(next)) {
              return;
            }

            setTextValue(next);

            if (next.trim() === "") {
              return;
            }

            const numericValue = Number(next);
            onChange(clamp(numericValue, field.min, field.max));
          }}
          className="w-40 rounded-md border border-slate-300 px-2 py-1 text-right text-sm text-slate-900 outline-none focus:border-slate-500"
        />
      </div>
      <input
        type="range"
        min={field.min}
        max={field.max}
        step={field.step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-slate-900"
      />
      <p className="text-xs text-slate-600">{field.helper}</p>
      <p className="text-xs font-medium text-slate-500">
        Current: {formatCompactAmount(value)}
      </p>
    </div>
  );
}

function getDefaultValues(config: OtherCalculatorConfig): Record<string, number> {
  return config.fields.reduce<Record<string, number>>((accumulator, field) => {
    accumulator[field.key] = field.defaultValue;
    return accumulator;
  }, {});
}

type OtherCalculatorProps = {
  calculatorId: OtherCalculatorId;
};

export default function OtherCalculator({ calculatorId }: OtherCalculatorProps) {
  const config = OTHER_CALCULATORS.find((item) => item.id === calculatorId);

  const [input, setInput] = useState<Record<string, number>>(() => {
    if (!config) {
      return {};
    }

    return getDefaultValues(config);
  });

  const result = useMemo(() => {
    if (!config) {
      return null;
    }

    return computeOtherCalculator(config.id, input);
  }, [config, input]);

  if (!config || !result) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-sm md:p-8">
      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Calculator Inputs</h2>

          {config.fields.map((field) => (
            <SliderField
              key={field.key}
              field={field}
              value={input[field.key] ?? field.defaultValue}
              onChange={(value) =>
                setInput((prev) => ({
                  ...prev,
                  [field.key]: clamp(value, field.min, field.max),
                }))
              }
            />
          ))}
        </div>

        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                {config.summaryLabels.seriesA}
              </p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {formatCurrency(result.summary.seriesA)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {formatCompactAmount(result.summary.seriesA)}
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                {config.summaryLabels.seriesB}
              </p>
              <p className="mt-2 text-xl font-semibold text-emerald-700">
                {formatCurrency(result.summary.seriesB)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {formatCompactAmount(result.summary.seriesB)}
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                {config.summaryLabels.total}
              </p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {formatCurrency(result.summary.total)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {formatCompactAmount(result.summary.total)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {config.summaryLabels.ratio}: {formatCompactAmount(result.summary.ratio)}
              </p>
            </article>
          </div>

          {result.highlights && result.highlights.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {result.highlights.map((item) => (
                <article
                  key={item.label}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {formatCompactAmount(item.value)}
                  </p>
                </article>
              ))}
            </div>
          ) : null}

          <div className="rounded-2xl border border-slate-200 p-4">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Yearly trend</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <LineChart data={result.projection} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fill: "#334155", fontSize: 12 }} />
                  <YAxis
                    tick={{ fill: "#334155", fontSize: 12 }}
                    tickFormatter={(value: number) => formatCompactAmount(value)}
                  />
                  <Tooltip
                    formatter={(value, name) => [formatTooltipValue(value), String(name ?? "")]} 
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#0f172a"
                    strokeWidth={2.5}
                    dot={false}
                    name={config.chartLabels.total}
                  />
                  <Line
                    type="monotone"
                    dataKey="seriesA"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={false}
                    name={config.chartLabels.seriesA}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              {config.chartLabels.seriesA} vs {config.chartLabels.seriesB}
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <BarChart data={result.projection} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fill: "#334155", fontSize: 12 }} />
                  <YAxis
                    tick={{ fill: "#334155", fontSize: 12 }}
                    tickFormatter={(value: number) => formatCompactAmount(value)}
                  />
                  <Tooltip
                    formatter={(value, name) => [formatTooltipValue(value), String(name ?? "")]} 
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="seriesA" fill="#334155" name={config.chartLabels.seriesA} />
                  <Bar dataKey="seriesB" fill="#22c55e" name={config.chartLabels.seriesB} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
