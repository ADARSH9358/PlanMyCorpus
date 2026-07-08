export type SipInputs = {
  recurringInvestment: number;
  lumpsumInvestment: number;
  investmentFrequency: "weekly" | "monthly" | "yearly";
  annualReturnRate: number;
  years: number;
};

export type SipProjectionPoint = {
  year: number;
  invested: number;
  corpus: number;
  returns: number;
};

export type SipSummary = {
  investedAmount: number;
  estimatedReturns: number;
  estimatedCorpus: number;
  absoluteReturnPct: number;
};

const roundToTwo = (value: number): number => Math.round(value * 100) / 100;

const FREQUENCY_PERIODS_PER_YEAR: Record<SipInputs["investmentFrequency"], number> = {
  weekly: 52,
  monthly: 12,
  yearly: 1,
};

type SimulationSnapshot = {
  period: number;
  invested: number;
  corpus: number;
};

function simulateSip(input: SipInputs): SimulationSnapshot[] {
  const periodsPerYear = FREQUENCY_PERIODS_PER_YEAR[input.investmentFrequency];
  const totalPeriods = input.years * periodsPerYear;
  const ratePerPeriod = Math.pow(1 + input.annualReturnRate / 100, 1 / periodsPerYear) - 1;

  let corpus = input.lumpsumInvestment;
  let invested = input.lumpsumInvestment;
  const snapshots: SimulationSnapshot[] = [];

  for (let period = 1; period <= totalPeriods; period += 1) {
    corpus = (corpus + input.recurringInvestment) * (1 + ratePerPeriod);
    invested += input.recurringInvestment;
    snapshots.push({ period, corpus, invested });
  }

  return snapshots;
}

function getYearEndSnapshot(
  snapshots: SimulationSnapshot[],
  year: number,
  periodsPerYear: number,
) {
  const periodIndex = year * periodsPerYear - 1;
  return snapshots[periodIndex];
}

export function buildSipProjection(input: SipInputs): SipProjectionPoint[] {
  const periodsPerYear = FREQUENCY_PERIODS_PER_YEAR[input.investmentFrequency];
  const snapshots = simulateSip(input);

  return Array.from({ length: input.years }, (_, index) => {
    const year = index + 1;
    const yearEnd = getYearEndSnapshot(snapshots, year, periodsPerYear);
    const corpus = yearEnd?.corpus ?? input.lumpsumInvestment;
    const invested = yearEnd?.invested ?? input.lumpsumInvestment;

    return {
      year,
      invested: roundToTwo(invested),
      corpus: roundToTwo(corpus),
      returns: roundToTwo(corpus - invested),
    };
  });
}

export function calculateSipSummary(input: SipInputs): SipSummary {
  const snapshots = simulateSip(input);
  const lastSnapshot = snapshots[snapshots.length - 1];

  const estimatedCorpus = roundToTwo(lastSnapshot?.corpus ?? input.lumpsumInvestment);
  const investedAmount = roundToTwo(lastSnapshot?.invested ?? input.lumpsumInvestment);
  const estimatedReturns = roundToTwo(estimatedCorpus - investedAmount);
  const absoluteReturnPct =
    investedAmount === 0 ? 0 : roundToTwo((estimatedReturns / investedAmount) * 100);

  return {
    investedAmount,
    estimatedReturns,
    estimatedCorpus,
    absoluteReturnPct,
  };
}
