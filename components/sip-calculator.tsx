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
import { buildSipProjection, calculateSipSummary, type SipInputs } from "@/lib/sip";

const DEFAULT_VALUES: SipInputs = {
  recurringInvestment: 10000,
  lumpsumInvestment: 0,
  investmentFrequency: "monthly",
  annualReturnRate: 12,
  years: 15,
};

const frequencyLabel: Record<SipInputs["investmentFrequency"], string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

const clamp = (value: number, min: number, max: number): number => {
  if (Number.isNaN(value)) return min;
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
  label: string;
  helper: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
};

function SliderField({
  label,
  helper,
  min,
  max,
  step,
  value,
  onChange,
}: SliderFieldProps) {
  const [textValue, setTextValue] = useState(String(value));
  const [isEditingText, setIsEditingText] = useState(false);

  return (
    <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="text-sm font-medium text-slate-800">{label}</label>
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

            onChange(Number(next));
          }}
          className="w-36 rounded-md border border-slate-300 px-2 py-1 text-right text-sm text-slate-900 outline-none focus:border-slate-500"
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-slate-900"
      />
      <p className="text-xs text-slate-600">{helper}</p>
      <p className="text-xs font-medium text-slate-500">Current: {formatCompactAmount(value)}</p>
    </div>
  );
}

export default function SipCalculator() {
  const [input, setInput] = useState<SipInputs>(DEFAULT_VALUES);

  const summary = useMemo(() => calculateSipSummary(input), [input]);
  const projection = useMemo(() => buildSipProjection(input), [input]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-sm md:p-8">
      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">SIP Inputs</h2>

          <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
            <label htmlFor="frequency" className="text-sm font-medium text-slate-800">
              Investment frequency
            </label>
            <select
              id="frequency"
              value={input.investmentFrequency}
              onChange={(event) =>
                setInput((prev) => ({
                  ...prev,
                  investmentFrequency: event.target.value as SipInputs["investmentFrequency"],
                }))
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <p className="text-xs text-slate-600">
              Choose how often the recurring contribution is made.
            </p>
          </div>

          <SliderField
            label={`${frequencyLabel[input.investmentFrequency]} investment`}
            helper={`How much you invest each ${input.investmentFrequency.replace("ly", "") || input.investmentFrequency}`}
            min={0}
            max={1000000}
            step={500}
            value={input.recurringInvestment}
            onChange={(value) =>
              setInput((prev) => ({
                ...prev,
                recurringInvestment: clamp(value, 0, 1000000),
              }))
            }
          />

          <SliderField
            label="One-time lumpsum"
            helper="Initial amount invested at the beginning"
            min={0}
            max={50000000}
            step={1000}
            value={input.lumpsumInvestment}
            onChange={(value) =>
              setInput((prev) => ({
                ...prev,
                lumpsumInvestment: clamp(value, 0, 50000000),
              }))
            }
          />

          <SliderField
            label="Expected annual return (%)"
            helper="Expected yearly growth before inflation"
            min={0}
            max={50}
            step={0.1}
            value={input.annualReturnRate}
            onChange={(value) =>
              setInput((prev) => ({
                ...prev,
                annualReturnRate: clamp(value, 0, 50),
              }))
            }
          />

          <SliderField
            label="Investment period (years)"
            helper="How long you plan to continue SIP"
            min={1}
            max={70}
            step={1}
            value={input.years}
            onChange={(value) =>
              setInput((prev) => ({ ...prev, years: clamp(value, 1, 70) }))
            }
          />
        </div>

        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                Invested Amount
              </p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {formatCurrency(summary.investedAmount)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {formatCompactAmount(summary.investedAmount)}
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                Estimated Returns
              </p>
              <p className="mt-2 text-xl font-semibold text-emerald-700">
                {formatCurrency(summary.estimatedReturns)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {formatCompactAmount(summary.estimatedReturns)}
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                Future Value
              </p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {formatCurrency(summary.estimatedCorpus)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {formatCompactAmount(summary.estimatedCorpus)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Absolute return: {summary.absoluteReturnPct.toFixed(2)}%
              </p>
            </article>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Corpus growth by year
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <LineChart data={projection} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
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
                    dataKey="corpus"
                    stroke="#0f172a"
                    strokeWidth={2.5}
                    dot={false}
                    name="Estimated corpus"
                  />
                  <Line
                    type="monotone"
                    dataKey="invested"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={false}
                    name="Invested amount"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Invested vs returns
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <BarChart data={projection} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
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
                  <Bar dataKey="invested" stackId="a" fill="#334155" name="Invested" />
                  <Bar dataKey="returns" stackId="a" fill="#22c55e" name="Returns" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
