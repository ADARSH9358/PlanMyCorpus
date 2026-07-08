export type OtherCalculatorId =
  | "step-up-sip"
  | "fd"
  | "emi"
  | "swp"
  | "stp"
  | "retirement"
  | "nps";

export type CalculatorField = {
  key: string;
  label: string;
  helper: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  suffix?: string;
};

export type ProjectionPoint = {
  year: number;
  seriesA: number;
  seriesB: number;
  total: number;
};

export type CalculatorResult = {
  summary: {
    seriesA: number;
    seriesB: number;
    total: number;
    ratio: number;
  };
  projection: ProjectionPoint[];
  highlights?: Array<{ label: string; value: number }>;
};

export type OtherCalculatorConfig = {
  id: OtherCalculatorId;
  slug: string;
  title: string;
  shortDescription: string;
  intro: string;
  formulaText: string;
  fields: CalculatorField[];
  summaryLabels: {
    seriesA: string;
    seriesB: string;
    total: string;
    ratio: string;
  };
  chartLabels: {
    seriesA: string;
    seriesB: string;
    total: string;
  };
  faqs: Array<{ question: string; answer: string }>;
};

const roundToTwo = (value: number): number => Math.round(value * 100) / 100;

const yearlyProjectionFromMonthly = (
  years: number,
  simulator: (month: number) => { seriesA: number; seriesB: number; total: number },
): ProjectionPoint[] => {
  return Array.from({ length: years }, (_, index) => {
    const year = index + 1;
    const snapshot = simulator(year * 12);
    return {
      year,
      seriesA: roundToTwo(snapshot.seriesA),
      seriesB: roundToTwo(snapshot.seriesB),
      total: roundToTwo(snapshot.total),
    };
  });
};

function computeStepUpSip(input: Record<string, number>): CalculatorResult {
  const years = Math.round(input.years);
  const monthlyRate = input.annualReturnRate / 12 / 100;
  const stepUp = input.annualStepUpPct / 100;

  let corpus = input.lumpsum;
  let invested = input.lumpsum;
  let monthlySip = input.monthlyInvestment;
  const projection: ProjectionPoint[] = [];

  for (let year = 1; year <= years; year += 1) {
    for (let month = 1; month <= 12; month += 1) {
      corpus = (corpus + monthlySip) * (1 + monthlyRate);
      invested += monthlySip;
    }

    projection.push({
      year,
      seriesA: roundToTwo(invested),
      seriesB: roundToTwo(corpus - invested),
      total: roundToTwo(corpus),
    });

    monthlySip *= 1 + stepUp;
  }

  const last = projection[projection.length - 1];
  const ratio = last && last.seriesA > 0 ? (last.seriesB / last.seriesA) * 100 : 0;

  return {
    summary: {
      seriesA: last?.seriesA ?? 0,
      seriesB: last?.seriesB ?? 0,
      total: last?.total ?? 0,
      ratio: roundToTwo(ratio),
    },
    projection,
  };
}

function computeFd(input: Record<string, number>): CalculatorResult {
  const years = Math.round(input.years);
  const monthlyRate = input.annualRate / 12 / 100;
  const monthlyDeposit = input.monthlyTopUp;

  const projection = yearlyProjectionFromMonthly(years, (months) => {
    let corpus = input.principal;
    let invested = input.principal;

    for (let month = 1; month <= months; month += 1) {
      corpus = (corpus + monthlyDeposit) * (1 + monthlyRate);
      invested += monthlyDeposit;
    }

    return {
      seriesA: invested,
      seriesB: corpus - invested,
      total: corpus,
    };
  });

  const last = projection[projection.length - 1];
  const ratio = last && last.seriesA > 0 ? (last.seriesB / last.seriesA) * 100 : 0;

  return {
    summary: {
      seriesA: last?.seriesA ?? 0,
      seriesB: last?.seriesB ?? 0,
      total: last?.total ?? 0,
      ratio: roundToTwo(ratio),
    },
    projection,
  };
}

function computeEmi(input: Record<string, number>): CalculatorResult {
  const years = Math.round(input.years);
  const monthlyRate = input.annualRate / 12 / 100;
  const totalMonths = years * 12;

  const emi =
    monthlyRate === 0
      ? input.loanAmount / totalMonths
      : (input.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);

  let balance = input.loanAmount;
  let principalPaid = 0;
  let interestPaid = 0;
  const projection: ProjectionPoint[] = [];

  for (let month = 1; month <= totalMonths; month += 1) {
    const interest = balance * monthlyRate;
    let principal = emi - interest;

    if (principal > balance) {
      principal = balance;
    }

    balance -= principal;
    principalPaid += principal;
    interestPaid += interest;

    if (month % 12 === 0 || month === totalMonths) {
      projection.push({
        year: Math.ceil(month / 12),
        seriesA: roundToTwo(principalPaid),
        seriesB: roundToTwo(interestPaid),
        total: roundToTwo(principalPaid + interestPaid),
      });
    }
  }

  const last = projection[projection.length - 1];

  return {
    summary: {
      seriesA: last?.seriesA ?? 0,
      seriesB: last?.seriesB ?? 0,
      total: last?.total ?? 0,
      ratio: roundToTwo((input.loanAmount > 0 ? (interestPaid / input.loanAmount) * 100 : 0)),
    },
    projection,
    highlights: [{ label: "Monthly EMI", value: roundToTwo(emi) }],
  };
}

function computeSwp(input: Record<string, number>): CalculatorResult {
  const years = Math.round(input.years);
  const monthlyRate = input.annualReturnRate / 12 / 100;

  let corpus = input.initialCorpus;
  let totalWithdrawn = 0;
  const projection: ProjectionPoint[] = [];

  for (let year = 1; year <= years; year += 1) {
    for (let month = 1; month <= 12; month += 1) {
      corpus *= 1 + monthlyRate;
      const withdrawal = Math.min(corpus, input.monthlyWithdrawal);
      corpus -= withdrawal;
      totalWithdrawn += withdrawal;
    }

    const totalValue = corpus + totalWithdrawn;
    const gains = Math.max(totalValue - input.initialCorpus, 0);

    projection.push({
      year,
      seriesA: roundToTwo(totalWithdrawn),
      seriesB: roundToTwo(corpus),
      total: roundToTwo(totalValue),
    });

    if (corpus <= 0) {
      break;
    }

    if (gains < 0) {
      break;
    }
  }

  const last = projection[projection.length - 1];

  return {
    summary: {
      seriesA: last?.seriesA ?? 0,
      seriesB: last?.seriesB ?? 0,
      total: last?.total ?? 0,
      ratio: roundToTwo((input.initialCorpus > 0 ? ((last?.seriesA ?? 0) / input.initialCorpus) * 100 : 0)),
    },
    projection,
  };
}

function computeStp(input: Record<string, number>): CalculatorResult {
  const years = Math.round(input.years);
  const sourceMonthlyRate = input.sourceReturnRate / 12 / 100;
  const targetMonthlyRate = input.targetReturnRate / 12 / 100;

  let source = input.sourceCorpus;
  let target = 0;
  let transferred = 0;
  const projection: ProjectionPoint[] = [];

  for (let year = 1; year <= years; year += 1) {
    for (let month = 1; month <= 12; month += 1) {
      source *= 1 + sourceMonthlyRate;
      target *= 1 + targetMonthlyRate;

      const transfer = Math.min(source, input.monthlyTransfer);
      source -= transfer;
      target += transfer;
      transferred += transfer;
    }

    projection.push({
      year,
      seriesA: roundToTwo(transferred),
      seriesB: roundToTwo(target),
      total: roundToTwo(source + target),
    });

    if (source <= 0) {
      break;
    }
  }

  const last = projection[projection.length - 1];
  const ratio = last && input.sourceCorpus > 0 ? (last.total / input.sourceCorpus - 1) * 100 : 0;

  return {
    summary: {
      seriesA: last?.seriesA ?? 0,
      seriesB: last?.seriesB ?? 0,
      total: last?.total ?? 0,
      ratio: roundToTwo(ratio),
    },
    projection,
  };
}

function computeRetirement(input: Record<string, number>): CalculatorResult {
  const years = Math.max(1, Math.round(input.retirementAge - input.currentAge));
  const monthlyRate = input.annualReturnRate / 12 / 100;

  let corpus = input.currentSavings;
  let invested = input.currentSavings;
  const projection: ProjectionPoint[] = [];

  for (let year = 1; year <= years; year += 1) {
    for (let month = 1; month <= 12; month += 1) {
      corpus = (corpus + input.monthlyInvestment) * (1 + monthlyRate);
      invested += input.monthlyInvestment;
    }

    projection.push({
      year,
      seriesA: roundToTwo(invested),
      seriesB: roundToTwo(corpus - invested),
      total: roundToTwo(corpus),
    });
  }

  const inflationAdjusted =
    projection.length > 0
      ? projection[projection.length - 1].total /
        Math.pow(1 + input.inflationRate / 100, years)
      : 0;

  const last = projection[projection.length - 1];

  return {
    summary: {
      seriesA: last?.seriesA ?? 0,
      seriesB: last?.seriesB ?? 0,
      total: last?.total ?? 0,
      ratio: roundToTwo(inflationAdjusted),
    },
    projection,
    highlights: [
      { label: "Years to retirement", value: years },
      { label: "Inflation-adjusted corpus", value: roundToTwo(inflationAdjusted) },
    ],
  };
}

function computeNps(input: Record<string, number>): CalculatorResult {
  const years = Math.round(input.years);
  const monthlyRate = input.annualReturnRate / 12 / 100;

  let corpus = input.currentCorpus;
  let invested = input.currentCorpus;
  const projection: ProjectionPoint[] = [];

  for (let year = 1; year <= years; year += 1) {
    for (let month = 1; month <= 12; month += 1) {
      corpus = (corpus + input.monthlyContribution) * (1 + monthlyRate);
      invested += input.monthlyContribution;
    }

    projection.push({
      year,
      seriesA: roundToTwo(invested),
      seriesB: roundToTwo(corpus - invested),
      total: roundToTwo(corpus),
    });
  }

  const maturity = projection[projection.length - 1]?.total ?? 0;
  const annuityCorpus = maturity * (input.annuityPercent / 100);
  const lumpsum = maturity - annuityCorpus;
  const monthlyPension = (annuityCorpus * (input.annuityReturnRate / 100)) / 12;

  return {
    summary: {
      seriesA: roundToTwo(lumpsum),
      seriesB: roundToTwo(annuityCorpus),
      total: roundToTwo(maturity),
      ratio: roundToTwo(monthlyPension),
    },
    projection,
    highlights: [{ label: "Estimated monthly pension", value: roundToTwo(monthlyPension) }],
  };
}

const computeById: Record<OtherCalculatorId, (input: Record<string, number>) => CalculatorResult> = {
  "step-up-sip": computeStepUpSip,
  fd: computeFd,
  emi: computeEmi,
  swp: computeSwp,
  stp: computeStp,
  retirement: computeRetirement,
  nps: computeNps,
};

export const OTHER_CALCULATORS: OtherCalculatorConfig[] = [
  {
    id: "step-up-sip",
    slug: "step-up-sip-calculator",
    title: "Step Up SIP Calculator",
    shortDescription:
      "Use PlanMyCorpus Step Up SIP Calculator to estimate future wealth when your SIP increases every year with compounding.",
    intro:
      "Plan a growing SIP strategy where your contribution steps up annually while returns compound over time.",
    formulaText:
      "The calculation simulates month-by-month contributions and applies annual SIP step-up at year end.",
    fields: [
      {
        key: "monthlyInvestment",
        label: "Starting monthly SIP",
        helper: "Initial monthly contribution",
        min: 500,
        max: 1000000,
        step: 500,
        defaultValue: 10000,
      },
      {
        key: "annualStepUpPct",
        label: "Annual step-up (%)",
        helper: "How much SIP increases each year",
        min: 0,
        max: 50,
        step: 0.5,
        defaultValue: 10,
      },
      {
        key: "lumpsum",
        label: "One-time lump sum",
        helper: "Optional initial investment",
        min: 0,
        max: 50000000,
        step: 1000,
        defaultValue: 0,
      },
      {
        key: "annualReturnRate",
        label: "Expected annual return (%)",
        helper: "Expected yearly portfolio growth",
        min: 0,
        max: 50,
        step: 0.1,
        defaultValue: 12,
      },
      {
        key: "years",
        label: "Investment years",
        helper: "Investment duration",
        min: 1,
        max: 70,
        step: 1,
        defaultValue: 20,
      },
    ],
    summaryLabels: {
      seriesA: "Total Invested",
      seriesB: "Total Gains",
      total: "Future Value",
      ratio: "Return on invested (%)",
    },
    chartLabels: {
      seriesA: "Invested",
      seriesB: "Gains",
      total: "Corpus",
    },
    faqs: [
      {
        question: "What is step-up SIP?",
        answer:
          "Step-up SIP increases your SIP contribution each year, which can significantly improve long-term corpus.",
      },
      {
        question: "Should I choose step-up SIP over fixed SIP?",
        answer:
          "If your income is expected to grow, step-up SIP can align better with cash flow and build a larger corpus.",
      },
    ],
  },
  {
    id: "fd",
    slug: "fd-calculator",
    title: "FD Calculator",
    shortDescription:
      "Use PlanMyCorpus FD Calculator to estimate maturity value for lump sum deposits with optional monthly top-ups.",
    intro:
      "Use this FD calculator to project how your fixed deposit can grow with compounding and optional monthly top-up.",
    formulaText:
      "This simulation applies monthly compounding and adds optional top-ups every month.",
    fields: [
      {
        key: "principal",
        label: "Initial deposit",
        helper: "Amount placed in fixed deposit",
        min: 1000,
        max: 50000000,
        step: 1000,
        defaultValue: 500000,
      },
      {
        key: "monthlyTopUp",
        label: "Monthly top-up",
        helper: "Optional monthly addition",
        min: 0,
        max: 200000,
        step: 500,
        defaultValue: 0,
      },
      {
        key: "annualRate",
        label: "FD interest rate (%)",
        helper: "Expected annual FD rate",
        min: 1,
        max: 20,
        step: 0.1,
        defaultValue: 7,
      },
      {
        key: "years",
        label: "Duration (years)",
        helper: "Total FD period",
        min: 1,
        max: 30,
        step: 1,
        defaultValue: 10,
      },
    ],
    summaryLabels: {
      seriesA: "Total Invested",
      seriesB: "Interest Earned",
      total: "Maturity Value",
      ratio: "Interest on invested (%)",
    },
    chartLabels: {
      seriesA: "Invested",
      seriesB: "Interest",
      total: "Maturity",
    },
    faqs: [
      {
        question: "Is FD return guaranteed?",
        answer:
          "Bank FD rates are generally fixed for the term selected, but always verify current rates and terms with your bank.",
      },
      {
        question: "Can I include monthly contribution in FD?",
        answer:
          "This tool allows optional monthly top-up for planning flexibility similar to recurring additions.",
      },
    ],
  },
  {
    id: "emi",
    slug: "emi-calculator",
    title: "EMI Calculator",
    shortDescription:
      "Use PlanMyCorpus EMI Calculator to estimate monthly EMI, principal breakup, total interest, and complete loan payout.",
    intro:
      "Estimate your loan repayment with a clear breakup of principal and interest across years.",
    formulaText:
      "Uses standard EMI formula with monthly reducing balance and amortization simulation.",
    fields: [
      {
        key: "loanAmount",
        label: "Loan amount",
        helper: "Total principal borrowed",
        min: 10000,
        max: 100000000,
        step: 10000,
        defaultValue: 3000000,
      },
      {
        key: "annualRate",
        label: "Interest rate (%)",
        helper: "Annual reducing balance interest",
        min: 0,
        max: 40,
        step: 0.1,
        defaultValue: 9,
      },
      {
        key: "years",
        label: "Loan tenure (years)",
        helper: "Repayment duration",
        min: 1,
        max: 40,
        step: 1,
        defaultValue: 20,
      },
    ],
    summaryLabels: {
      seriesA: "Principal Repaid",
      seriesB: "Total Interest",
      total: "Total Payment",
      ratio: "Interest to principal (%)",
    },
    chartLabels: {
      seriesA: "Principal",
      seriesB: "Interest",
      total: "Total Paid",
    },
    faqs: [
      {
        question: "How is EMI calculated?",
        answer:
          "EMI is calculated using loan amount, monthly interest rate, and total number of months in tenure.",
      },
      {
        question: "How can I reduce total interest?",
        answer:
          "Lower tenure or lower interest rate can reduce total interest burden substantially.",
      },
    ],
  },
  {
    id: "swp",
    slug: "swp-calculator",
    title: "SWP Calculator",
    shortDescription:
      "Use PlanMyCorpus SWP Calculator to estimate monthly withdrawals, remaining corpus, and withdrawal sustainability.",
    intro:
      "Plan regular withdrawals from your corpus while tracking remaining balance and sustainability.",
    formulaText:
      "The simulation applies monthly growth and then monthly withdrawal from the corpus.",
    fields: [
      {
        key: "initialCorpus",
        label: "Initial corpus",
        helper: "Starting investment value",
        min: 50000,
        max: 100000000,
        step: 10000,
        defaultValue: 5000000,
      },
      {
        key: "monthlyWithdrawal",
        label: "Monthly withdrawal",
        helper: "Amount withdrawn every month",
        min: 1000,
        max: 2000000,
        step: 500,
        defaultValue: 30000,
      },
      {
        key: "annualReturnRate",
        label: "Expected annual return (%)",
        helper: "Expected annual growth of remaining corpus",
        min: 0,
        max: 30,
        step: 0.1,
        defaultValue: 10,
      },
      {
        key: "years",
        label: "Withdrawal years",
        helper: "How long withdrawals continue",
        min: 1,
        max: 50,
        step: 1,
        defaultValue: 20,
      },
    ],
    summaryLabels: {
      seriesA: "Total Withdrawn",
      seriesB: "Remaining Corpus",
      total: "Total Value Used",
      ratio: "Withdrawn vs initial (%)",
    },
    chartLabels: {
      seriesA: "Withdrawn",
      seriesB: "Balance",
      total: "Withdrawn + Balance",
    },
    faqs: [
      {
        question: "What is SWP?",
        answer:
          "SWP lets you withdraw fixed amounts periodically while the remaining corpus stays invested.",
      },
      {
        question: "Can my corpus run out in SWP?",
        answer:
          "Yes, if withdrawals are too high versus growth rate, corpus may deplete earlier.",
      },
    ],
  },
  {
    id: "stp",
    slug: "stp-calculator",
    title: "STP Calculator",
    shortDescription:
      "Use PlanMyCorpus STP Calculator to model source-to-target fund transfers and track portfolio growth clearly.",
    intro:
      "Estimate how a Systematic Transfer Plan moves money from a source corpus to a target growth fund.",
    formulaText:
      "Each month source and target funds grow at respective rates, and transfer amount shifts to target.",
    fields: [
      {
        key: "sourceCorpus",
        label: "Source corpus",
        helper: "Initial amount in source fund",
        min: 100000,
        max: 100000000,
        step: 10000,
        defaultValue: 2000000,
      },
      {
        key: "monthlyTransfer",
        label: "Monthly transfer",
        helper: "Amount moved from source to target each month",
        min: 1000,
        max: 1000000,
        step: 500,
        defaultValue: 50000,
      },
      {
        key: "sourceReturnRate",
        label: "Source return (%)",
        helper: "Expected annual source fund return",
        min: 0,
        max: 20,
        step: 0.1,
        defaultValue: 6,
      },
      {
        key: "targetReturnRate",
        label: "Target return (%)",
        helper: "Expected annual target fund return",
        min: 0,
        max: 30,
        step: 0.1,
        defaultValue: 12,
      },
      {
        key: "years",
        label: "Duration (years)",
        helper: "Transfer duration",
        min: 1,
        max: 40,
        step: 1,
        defaultValue: 10,
      },
    ],
    summaryLabels: {
      seriesA: "Total Transferred",
      seriesB: "Target Corpus",
      total: "Net Portfolio Value",
      ratio: "Net growth on source (%)",
    },
    chartLabels: {
      seriesA: "Transferred",
      seriesB: "Target",
      total: "Total Value",
    },
    faqs: [
      {
        question: "What is STP used for?",
        answer:
          "STP is commonly used to move money from debt or liquid funds to equity funds in a phased manner.",
      },
      {
        question: "Is STP better than lump sum?",
        answer:
          "STP can reduce timing risk by spreading transfers over time, depending on market conditions.",
      },
    ],
  },
  {
    id: "retirement",
    slug: "retirement-calculator",
    title: "Retirement Calculator",
    shortDescription:
      "Use PlanMyCorpus Retirement Calculator to estimate future retirement corpus with savings, returns, and inflation assumptions.",
    intro:
      "Check whether your current savings pace can build enough retirement corpus by target retirement age.",
    formulaText:
      "Projects monthly contributions with compounding till retirement age and shows inflation-adjusted corpus estimate.",
    fields: [
      {
        key: "currentAge",
        label: "Current age",
        helper: "Your present age",
        min: 18,
        max: 65,
        step: 1,
        defaultValue: 30,
      },
      {
        key: "retirementAge",
        label: "Retirement age",
        helper: "Age at which you plan to retire",
        min: 30,
        max: 80,
        step: 1,
        defaultValue: 60,
      },
      {
        key: "currentSavings",
        label: "Current retirement savings",
        helper: "Current value of retirement corpus",
        min: 0,
        max: 200000000,
        step: 10000,
        defaultValue: 500000,
      },
      {
        key: "monthlyInvestment",
        label: "Monthly retirement investment",
        helper: "Monthly amount invested for retirement",
        min: 500,
        max: 1000000,
        step: 500,
        defaultValue: 15000,
      },
      {
        key: "annualReturnRate",
        label: "Expected annual return (%)",
        helper: "Expected annual portfolio growth",
        min: 0,
        max: 30,
        step: 0.1,
        defaultValue: 11,
      },
      {
        key: "inflationRate",
        label: "Inflation rate (%)",
        helper: "Used for real-value adjustment",
        min: 0,
        max: 15,
        step: 0.1,
        defaultValue: 6,
      },
    ],
    summaryLabels: {
      seriesA: "Total Invested",
      seriesB: "Estimated Gains",
      total: "Retirement Corpus",
      ratio: "Inflation-adjusted corpus",
    },
    chartLabels: {
      seriesA: "Invested",
      seriesB: "Gains",
      total: "Corpus",
    },
    faqs: [
      {
        question: "How much corpus is enough for retirement?",
        answer:
          "It depends on lifestyle, inflation, and post-retirement return assumptions. Use this as a scenario tool.",
      },
      {
        question: "Why inflation-adjusted corpus is important?",
        answer:
          "Inflation reduces future purchasing power, so real-value estimates are essential for planning.",
      },
    ],
  },
  {
    id: "nps",
    slug: "nps-calculator",
    title: "NPS Calculator",
    shortDescription:
      "Use PlanMyCorpus NPS Calculator to estimate maturity corpus, annuity allocation, lump sum withdrawal, and pension.",
    intro:
      "Project your NPS corpus with monthly contributions and estimate pension using annuity assumptions.",
    formulaText:
      "Projects contribution growth till maturity, then splits corpus into annuity and lump sum based on chosen percentage.",
    fields: [
      {
        key: "currentCorpus",
        label: "Current NPS corpus",
        helper: "Existing NPS value",
        min: 0,
        max: 100000000,
        step: 10000,
        defaultValue: 0,
      },
      {
        key: "monthlyContribution",
        label: "Monthly contribution",
        helper: "Monthly investment into NPS",
        min: 500,
        max: 500000,
        step: 500,
        defaultValue: 10000,
      },
      {
        key: "annualReturnRate",
        label: "Expected annual return (%)",
        helper: "Expected annual NPS growth",
        min: 0,
        max: 30,
        step: 0.1,
        defaultValue: 10,
      },
      {
        key: "years",
        label: "Years to maturity",
        helper: "Remaining years of contribution",
        min: 1,
        max: 50,
        step: 1,
        defaultValue: 25,
      },
      {
        key: "annuityPercent",
        label: "Annuity allocation (%)",
        helper: "Percent used to buy annuity at maturity",
        min: 40,
        max: 100,
        step: 1,
        defaultValue: 40,
      },
      {
        key: "annuityReturnRate",
        label: "Annuity return (%)",
        helper: "Expected annual annuity yield",
        min: 2,
        max: 12,
        step: 0.1,
        defaultValue: 6,
      },
    ],
    summaryLabels: {
      seriesA: "Estimated Lump Sum",
      seriesB: "Annuity Corpus",
      total: "Maturity Corpus",
      ratio: "Estimated monthly pension",
    },
    chartLabels: {
      seriesA: "Invested",
      seriesB: "Gains",
      total: "Corpus",
    },
    faqs: [
      {
        question: "How does NPS payout work?",
        answer:
          "At maturity, a part can be withdrawn as lump sum and the rest is used to buy annuity for pension.",
      },
      {
        question: "Is monthly pension fixed?",
        answer:
          "Pension depends on annuity corpus and annuity rates available at retirement.",
      },
    ],
  },
];

export const OTHER_CALCULATOR_BY_SLUG: Record<string, OtherCalculatorConfig> =
  Object.fromEntries(OTHER_CALCULATORS.map((item) => [item.slug, item])) as Record<
    string,
    OtherCalculatorConfig
  >;

export function computeOtherCalculator(
  id: OtherCalculatorId,
  input: Record<string, number>,
): CalculatorResult {
  return computeById[id](input);
}
