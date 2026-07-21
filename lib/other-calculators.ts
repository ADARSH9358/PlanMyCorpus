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

export type FormulaBlock =
  | { type: "text"; content: string }
  | { type: "formula"; lines: string[] };

export type OtherCalculatorConfig = {
  id: OtherCalculatorId;
  slug: string;
  title: string;
  shortDescription: string;
  intro: string;
  formulaBlocks: FormulaBlock[];
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
      "Most of us get salary hikes every year, so why should your SIP stay fixed? A step-up SIP lets you increase your monthly contribution by a set percentage annually — say 10% — which keeps pace with your growing income and can dramatically boost your final corpus without feeling like a financial stretch.",
    formulaBlocks: [
      {
        type: "text",
        content:
          "There is no single closed-form expression for a step-up SIP combined with an optional lump sum, so the calculator simulates every month individually. Here is exactly what happens each period:",
      },
      {
        type: "formula",
        lines: [
          "Each month:",
          "  Corpus = (Corpus + Monthly SIP) × (1 + r)",
          "",
          "At the end of every 12 months:",
          "  SIP = SIP × (1 + Step-up Rate / 100)",
          "",
          "where  r = Annual Return Rate / 12 / 100",
        ],
      },
      {
        type: "text",
        content:
          "Any optional lump sum is placed into the corpus at month zero and compounds alongside your SIP from the very first period. The step-up is applied once per year — the first 12 months use your original SIP, and each subsequent year the amount increases by the chosen percentage.",
      },
    ],
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
        question: "What exactly is a step-up SIP and how is it different from a regular SIP?",
        answer:
          "In a regular SIP you invest the same fixed amount every month for the entire duration. A step-up SIP keeps the same monthly amount within a year but bumps it up by a chosen percentage — say 10% — at the start of each new year. So if you start with ₹10,000 a month, next year it becomes ₹11,000, the year after ₹12,100, and so on. Over a long horizon that annual increase compounds on top of your market returns and can make a surprisingly large difference to the final corpus.",
      },
      {
        question: "How is the step-up SIP corpus calculated?",
        answer:
          "The calculator simulates every single month. Each month it adds your current SIP to the corpus and then applies one month of growth: new_corpus = (corpus + monthlySIP) × (1 + annualReturn/12/100). At the 12-month mark it increases your monthly SIP by the step-up percentage and repeats for the next year. Any lump sum you enter is placed in the corpus at month zero and compounds throughout.",
      },
      {
        question: "What step-up percentage should I start with?",
        answer:
          "A 10% annual step-up is a practical starting point because it roughly tracks average salary growth in India. If you are in a high-growth career phase, try 15%. The key is to choose a number you can actually sustain — an ambitious step-up that you abandon after two years does less good than a modest one you stick with.",
      },
      {
        question: "Does step-up SIP make sense if my salary increase is irregular?",
        answer:
          "Absolutely. Even if your hikes aren't perfectly regular, you can use the step-up as a planning assumption. Most people find that they can afford a 10% increase on average even in years when formal salary growth is modest, because expenses don't always scale with income. You can also adjust the step-up mid-plan through your fund house's SIP modification facility.",
      },
      {
        question: "How much more corpus does a step-up SIP build compared to a fixed SIP?",
        answer:
          "The difference grows dramatically with time. As a rough example: a ₹10,000 monthly SIP at 12% for 20 years builds around ₹99 lakh. Add a 10% annual step-up to the same setup and the corpus jumps to roughly ₹2 crore — more than double — because each year's higher SIP has multiple years of compounding ahead of it.",
      },
      {
        question: "What is the lump sum field for in the step-up SIP calculator?",
        answer:
          "It represents a one-time amount you invest at the very start — perhaps a bonus, an inheritance, or proceeds from selling an asset. This lump sum is added to the corpus at month zero and earns compound returns across the full investment period, working alongside your growing SIP contributions.",
      },
      {
        question: "Is step-up SIP available in all mutual funds?",
        answer:
          "Most fund houses and investment platforms support step-up or top-up SIP mandates. You can set a fixed rupee increase or a percentage increase annually. A few older platforms may require you to manually increase the mandate each year. Check with your AMC or broker before setting expectations.",
      },
      {
        question: "Are the returns shown here guaranteed?",
        answer:
          "No. The calculator uses an expected annual return that you provide. Actual mutual fund returns are market-linked and fluctuate. This tool gives you a projection based on a steady assumed rate — think of it as a planning compass, not a promise.",
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
      "A fixed deposit is one of the simplest ways to earn guaranteed, predictable returns on your savings. Whether you're parking a lump sum for safety or adding small amounts every month on top of an existing deposit, this calculator helps you see the exact maturity value before you lock in your money.",
    formulaBlocks: [
      {
        type: "text",
        content:
          "For a plain lump sum FD the maths is straightforward compound interest. When you add a monthly top-up, the calculator blends both in a single month-by-month pass:",
      },
      {
        type: "formula",
        lines: [
          "Standard lump sum (no top-up):",
          "  A = P × (1 + r / 12)^(12 × t)",
          "",
          "With monthly top-up (month-by-month simulation):",
          "  Corpus = (Corpus + Top-up) × (1 + r / 12)",
          "",
          "where  P = Principal deposit",
          "       r = Annual interest rate / 100",
          "       t = Duration in years",
        ],
      },
      {
        type: "text",
        content:
          "Setting the monthly top-up to zero collapses the formula to pure compound interest on the lump sum. Note that many Indian banks compound FD interest quarterly — this calculator uses monthly compounding, which gives a slightly higher projected maturity value. The difference is typically small (a few basis points) and serves as a reasonable planning approximation.",
      },
    ],
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
        question: "How does the FD maturity value get calculated?",
        answer:
          "The calculator uses monthly compounding. Each month your deposit earns interest at 1/12th of the annual rate, and that interest is added to the principal for the next month's calculation. The formula at its core is A = P × (1 + r/12)^(12×t), where P is the principal, r is the annual rate as a decimal, and t is the number of years. When you add a monthly top-up, the calculator runs month by month and adds your top-up before applying monthly growth — effectively treating it as a recurring deposit stacked on top of the lump sum.",
      },
      {
        question: "Most banks compound FD interest quarterly. Why does this calculator use monthly compounding?",
        answer:
          "You're right that many Indian bank FDs compound quarterly, while some compound monthly. This calculator defaults to monthly compounding because it tends to be slightly more optimistic, and it also allows the monthly top-up feature to work cleanly. For quarterly compounding you'd need to use your bank's specific schedule. For most practical planning purposes the difference between quarterly and monthly compounding on an FD is small — typically a few basis points — so the projections here are a good enough approximation.",
      },
      {
        question: "Is the FD interest rate fixed for the entire term?",
        answer:
          "Yes, that's the main feature of an FD — the rate you agree to at booking is locked in until maturity, regardless of where interest rates move in the market. This calculator assumes a constant rate throughout the term, which reflects real FD behaviour. If you renew the FD, the new rate at renewal applies.",
      },
      {
        question: "What is the monthly top-up feature?",
        answer:
          "It simulates adding a fixed amount to your deposit every month, similar to a recurring deposit (RD) but calculated alongside an initial lump sum. This is useful if you want to model parking a lump sum and then topping it up regularly — though in practice most banks treat these as separate products. You can set this to zero if you only want to calculate a standard FD.",
      },
      {
        question: "How is the interest earned different from returns in a mutual fund?",
        answer:
          "FD interest is guaranteed and pre-agreed — you know exactly how much you'll receive regardless of market conditions. Mutual fund returns are market-linked and can be higher or lower than expected. FDs also have TDS implications: interest above ₹40,000 per year per bank (₹50,000 for senior citizens) is subject to 10% TDS if your PAN is on record. Factor that into your actual take-home return.",
      },
      {
        question: "Should I break an existing FD early?",
        answer:
          "Premature withdrawal usually attracts a penalty — typically 0.5% to 1% reduction in interest rate. Before breaking an FD, compare the penalty-adjusted return with what you'd earn by keeping it. Use this calculator to model both scenarios: the FD at reduced rate for remaining months versus alternatives.",
      },
      {
        question: "What FD interest rate should I enter?",
        answer:
          "Use the current rate your bank offers for your chosen tenure. Rates vary by bank, tenure, and whether you're a regular or senior citizen depositor. As of recent years, most major Indian banks offer between 6.5% and 8.5% on tenures of 1 to 5 years. Check your bank's website for the latest rates before using this calculator.",
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
      "Taking a loan is a big commitment, and the numbers can feel opaque when banks quote only the monthly EMI. This calculator breaks it down completely — your exact EMI, how much of each payment goes to principal versus interest, and the total you'll repay over the entire tenure. Knowing these figures before you sign can genuinely change your negotiating position.",
    formulaBlocks: [
      {
        type: "text",
        content:
          "Every bank and NBFC in India uses the reducing balance method to compute EMI. The formula is:",
      },
      {
        type: "formula",
        lines: [
          "         P × r × (1 + r)ⁿ",
          "EMI  =  ──────────────────",
          "           (1 + r)ⁿ − 1",
          "",
          "where  P = Loan principal",
          "       r = Monthly interest rate = Annual Rate / 12 / 100",
          "       n = Total months = Years × 12",
        ],
      },
      {
        type: "text",
        content:
          "After computing the EMI, the calculator builds a complete amortisation schedule month by month. Each month: interest = outstanding balance × r, principal repaid = EMI − interest, and the balance reduces by the principal portion. In the early months the interest slice dominates; as the balance falls over time, a larger share of each EMI clears principal. This is why prepaying in the first few years of a long loan saves far more interest than prepaying toward the end.",
      },
    ],
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
        question: "What is the formula used to calculate EMI?",
        answer:
          "Banks use the reducing balance method. The formula is: EMI = P × r × (1+r)^n ÷ [(1+r)^n − 1]. Here P is the loan amount (principal), r is the monthly interest rate (annual rate divided by 12 and then by 100), and n is the total number of months. For example, on a ₹30 lakh home loan at 9% annual interest for 20 years: r = 0.09/12 = 0.0075, n = 240, and the EMI works out to roughly ₹26,992. The key point is that interest is charged on the outstanding balance each month, not on the original principal — so as you repay principal, interest charges reduce over time.",
      },
      {
        question: "Why does so much of the early EMI go toward interest?",
        answer:
          "In the early months the outstanding balance is high, so the interest portion is large and only a small slice of your EMI clears principal. As months pass, the balance drops, interest charges fall, and more of your fixed EMI goes toward principal. This is called amortisation. It's why prepaying in the first few years of a long loan saves disproportionately more interest than prepaying in the last few years.",
      },
      {
        question: "How can I reduce the total interest I pay on a loan?",
        answer:
          "Three main levers: lower the interest rate (by negotiating or refinancing), reduce the tenure, or make occasional prepayments. Even a single extra EMI per year can shave months off the loan. This calculator lets you compare scenarios — try reducing tenure by 2–3 years and see how total interest changes. Often the monthly EMI increase is modest but the lifetime interest saving is substantial.",
      },
      {
        question: "What is the difference between flat rate and reducing balance interest?",
        answer:
          "Flat rate interest charges a fixed percentage on the original loan amount every year throughout the tenure. Reducing balance (which banks use for home and car loans) charges interest only on the outstanding principal, so the effective interest burden decreases over time. A flat rate of 7% is not the same as a 7% reducing balance rate — the effective cost on flat rate is roughly 1.8× higher. Always check which method your lender is using.",
      },
      {
        question: "Does the calculator factor in processing fees or GST?",
        answer:
          "No — this calculator shows the pure EMI based on principal, rate, and tenure. Real loans carry one-time processing fees (usually 0.5%–2% of loan amount), GST on fees, and sometimes foreclosure charges. Add those separately to get total cost of borrowing.",
      },
      {
        question: "What is a good EMI-to-income ratio?",
        answer:
          "Most financial advisors suggest keeping total EMIs (including all running loans) below 40–50% of your monthly take-home pay. If a new loan pushes your total EMI past that threshold, you may want to reduce the loan amount, extend tenure, or wait until an existing loan closes.",
      },
      {
        question: "Can I use this for a car loan or personal loan, not just a home loan?",
        answer:
          "Yes, the formula is identical across all retail loan types. Just enter the correct loan amount, your lender's annual interest rate, and the tenure. Car loans in India typically range from 8–12% and span 3–7 years. Personal loans tend to carry higher rates of 11–24%. The EMI formula and the resulting amortisation schedule are the same regardless.",
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
      "Once you've built a corpus — whether through years of SIP investing, an inheritance, or a retirement payout — the next challenge is making it last. A Systematic Withdrawal Plan lets you take out a fixed amount every month while the rest stays invested and keeps growing. This calculator helps you figure out whether your withdrawal plan is sustainable or whether you'll outlive your money.",
    formulaBlocks: [
      {
        type: "text",
        content:
          "Growth is applied to the full corpus first, then the withdrawal is deducted — because fund houses typically credit returns before processing redemptions:",
      },
      {
        type: "formula",
        lines: [
          "Each month:",
          "  Corpus = Corpus × (1 + r) − Monthly Withdrawal",
          "",
          "where  r = Annual Return Rate / 12 / 100",
        ],
      },
      {
        type: "text",
        content:
          "If the corpus drops to zero before the chosen number of years, the simulation stops and the chart shows the exact depletion point. Sustainability depends on whether monthly growth earned exceeds the monthly withdrawal. At 12% annual return, a ₹1 crore corpus earns roughly ₹1 lakh in month one — any withdrawal above that amount starts eating into principal.",
      },
    ],
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
        question: "What is a Systematic Withdrawal Plan and how does it work?",
        answer:
          "An SWP is an instruction you give to a mutual fund to automatically redeem a fixed rupee amount from your investment every month (or quarter). The redeemed units are sold at that day's NAV and the proceeds are credited to your bank account. Meanwhile the remaining units stay invested and continue to earn returns. It's essentially the mirror image of a SIP — instead of putting money in regularly, you're taking money out regularly.",
      },
      {
        question: "How does the calculator decide when the corpus runs out?",
        answer:
          "Each month the calculator applies growth to the existing corpus and then subtracts your withdrawal. If the corpus drops to zero before the end of the selected years, the simulation stops at that point. You'll see the chart flatline — that's the depletion date. To avoid this, either reduce the monthly withdrawal, increase the assumed return, or start with a larger corpus.",
      },
      {
        question: "What is a safe withdrawal rate?",
        answer:
          "A widely cited rule of thumb is 4% per year of your corpus, which translates to about 0.33% per month. On a ₹1 crore corpus that's roughly ₹33,000 per month. At 4% many studies suggest the corpus can last 30+ years even with conservative returns. The exact safe rate depends on your assumed portfolio return, your expected lifespan, and whether you want to leave the corpus intact at the end or deplete it entirely.",
      },
      {
        question: "Can my corpus actually grow even while I'm withdrawing?",
        answer:
          "Yes, if the monthly return earned on the corpus is higher than the monthly withdrawal, the corpus net of withdrawals still grows. For example, a ₹1 crore corpus earning 12% annual return grows by about ₹1 lakh in the first month. If you withdraw ₹60,000, the corpus is still ₹40,000 larger after the first month. This is why starting with a sufficiently large corpus and keeping withdrawals reasonable lets wealth last indefinitely.",
      },
      {
        question: "How is SWP different from simply keeping money in a savings account?",
        answer:
          "A savings account earns a fixed 2.5–4% interest and you can withdraw freely, but the growth is minimal. An SWP in an equity or balanced mutual fund has the potential for much higher growth, which helps the remaining corpus continue to compound. The tradeoff is that fund returns are not guaranteed — a bad market year can reduce your corpus value simultaneously with withdrawals, which can accelerate depletion.",
      },
      {
        question: "Are SWP withdrawals taxable?",
        answer:
          "Yes. Each withdrawal redeems mutual fund units, triggering capital gains tax. For equity funds held over 12 months, gains above ₹1 lakh per year are taxed at 10% (long-term capital gains). For debt funds or those held under 12 months, gains are taxed at your income tax slab rate. An SWP can be tax-efficient compared to dividends, since you only pay tax on the gains component of each redemption, not the full withdrawal amount.",
      },
      {
        question: "What return rate should I assume for SWP planning?",
        answer:
          "Use conservative assumptions, especially for retirement planning. If your portfolio is equity-heavy, 10–11% is a reasonable long-term average, but in any given year it could be −20% or +40%. For withdrawal planning, many advisors suggest assuming 8–9% to build in a buffer. If you're withdrawing from a debt fund, 6–7% is more realistic.",
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
      "If you have a lump sum sitting in a liquid or debt fund but want it in equity over time, an STP is the cleaner alternative to manually transferring money each month. It automates the switch, keeps your parked money earning returns in the source fund while gradually deploying it to the target, and reduces the risk of putting everything in at the wrong moment.",
    formulaBlocks: [
      {
        type: "text",
        content:
          "Both funds are simulated in parallel every month so their compounding is tracked independently:",
      },
      {
        type: "formula",
        lines: [
          "Each month:",
          "  Source = Source × (1 + rₛ) − Monthly Transfer",
          "  Target = Target × (1 + rₜ) + Monthly Transfer",
          "",
          "where  rₛ = Source fund annual rate / 12 / 100",
          "       rₜ = Target fund annual rate / 12 / 100",
          "",
          "Net portfolio value = Source + Target",
        ],
      },
      {
        type: "text",
        content:
          "Growth is applied before the transfer each month, so money still sitting in the source fund keeps earning returns right up until it is moved. Transferred money starts compounding in the target fund from the very month it arrives. The simulation stops early if the source fund balance reaches zero before the chosen duration ends.",
      },
    ],
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
        question: "What is a Systematic Transfer Plan and why would I use one?",
        answer:
          "An STP is an automated instruction to move a fixed amount from one mutual fund (the source, typically debt or liquid) to another (the target, typically equity) every month. People use it primarily when they receive a large lump sum — a bonus, maturity payout, or asset sale proceeds — and don't want to invest it all in equity at once due to market timing risk. Instead, they park the full amount in a stable debt fund and let it trickle into equity over 6–24 months.",
      },
      {
        question: "How is STP calculated in this tool?",
        answer:
          "The calculator runs both funds simultaneously every month. The source fund earns its return first, then the transfer amount is subtracted. The target fund earns its return first, then the transfer amount is added. So even money still sitting in the source fund keeps compounding at the source rate until it's transferred — it doesn't just sit idle. The net portfolio value at any point is source + target.",
      },
      {
        question: "Is STP better than investing the full lump sum in equity upfront?",
        answer:
          "It depends on market timing. If equity markets rise sharply after you start the STP, lump sum investing would have been better. If markets fall after investment, the STP would have protected you since most of your money was in the safer source fund. Research suggests that over long periods lump sum investing outperforms STP because markets trend upward over time — but the STP offers psychological comfort and some downside protection during volatile stretches.",
      },
      {
        question: "What should I put in as the source return rate?",
        answer:
          "Liquid funds typically return 6–7% annually, and short-duration debt funds might return 7–8%. Use a conservative estimate — you're choosing this fund for stability, not returns. The source fund's purpose is to preserve capital while it waits to be transferred.",
      },
      {
        question: "What should I use as the target return rate?",
        answer:
          "For equity mutual funds a 10–14% annual return is a common planning assumption for long-term projections, though actual returns will vary year to year. For balanced or hybrid funds you might use 9–11%. Remember that higher expected return assumptions make the STP look more attractive — use a figure you can genuinely defend over the investment horizon.",
      },
      {
        question: "What happens when the source fund runs out before the STP duration ends?",
        answer:
          "The calculator stops the simulation when the source fund balance hits zero. If you set a monthly transfer that's too high relative to the source corpus size and duration, the source will empty early. For example, a ₹20 lakh source corpus with ₹2 lakh monthly transfers runs out in about 10–11 months. The tool will reflect this and show the chart truncating.",
      },
      {
        question: "Are STP transactions taxable?",
        answer:
          "Yes. Each transfer is treated as a redemption from the source fund and a fresh investment in the target fund. For debt funds held over 3 years, gains are taxed as long-term capital gains (20% with indexation). For holdings under 3 years, gains are added to income and taxed at your slab rate. Factor tax impact into your planning, especially for large corpus STPs.",
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
      "Retirement planning gets uncomfortable to think about, but running the numbers is the single most useful thing you can do for your future self. This calculator tells you how large a corpus your current savings pace will build by retirement — and crucially, what that corpus is actually worth in today's money after inflation has chipped away at it for decades.",
    formulaBlocks: [
      {
        type: "text",
        content:
          "The corpus builds through monthly compounding, exactly like a SIP. The extra step here is adjusting the final number for inflation so you can see what it is worth in today's rupees:",
      },
      {
        type: "formula",
        lines: [
          "Corpus accumulation (each month):",
          "  Corpus = (Corpus + Monthly Investment) × (1 + r)",
          "  [runs for (Retirement Age − Current Age) × 12 months]",
          "",
          "Inflation-adjusted value at retirement:",
          "  Real Value = Nominal Corpus ÷ (1 + Inflation Rate / 100)^Years",
          "",
          "where  r = Annual Return Rate / 12 / 100",
        ],
      },
      {
        type: "text",
        content:
          "Starting with your current savings as the initial corpus ensures the projection accounts for what you have already accumulated. The inflation-adjusted figure is the one that matters most — ₹5 crore thirty years from now at 6% annual inflation has the same purchasing power as roughly ₹87 lakh today.",
      },
    ],
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
        question: "How does the retirement corpus calculator work?",
        answer:
          "You enter your current age, target retirement age, existing savings, monthly investment, expected return, and inflation. The calculator compounds your savings month by month at the chosen return rate, adding your monthly contribution each period. At retirement age it shows your nominal corpus (the headline number) and also divides it by cumulative inflation to show what it's worth in today's purchasing power — the inflation-adjusted figure is the one that actually matters for planning.",
      },
      {
        question: "What is the inflation-adjusted corpus and why does it matter?",
        answer:
          "Suppose you project a retirement corpus of ₹5 crore in 30 years. That sounds large, but at 6% annual inflation, ₹5 crore in 30 years has the same purchasing power as roughly ₹87 lakh today. The inflation-adjusted figure — ₹87 lakh in this example — tells you what your wealth will actually feel like. Retirement planning based on nominal numbers without adjusting for inflation often leads to a nasty surprise.",
      },
      {
        question: "How much corpus do I actually need to retire?",
        answer:
          "A common approach is the 25× rule: multiply your expected annual expenses in retirement by 25. This assumes a 4% safe withdrawal rate, meaning you draw 4% of the corpus per year and it theoretically lasts forever if returns stay around 7–8% real. For ₹60,000 monthly expenses, you need ₹1.8 crore in today's money — but scaled for inflation to your retirement date. This calculator helps you see whether your current savings trajectory gets you there.",
      },
      {
        question: "What annual return rate should I assume?",
        answer:
          "For a diversified equity portfolio invested over 20–30 years, 10–12% is a reasonable historical Indian market average. If you're in balanced or hybrid funds, 9–10% is more conservative. Don't use 15% or higher unless your investment horizon is short and you're specifically targeting high-risk strategies — over-optimistic return assumptions are how retirement plans fail.",
      },
      {
        question: "What inflation rate should I use?",
        answer:
          "India's long-run CPI inflation averages around 5–7%. A 6% default is standard for retirement planning purposes. However, healthcare inflation in India tends to run higher — 10–12% — so if you're also planning for medical expenses in retirement, you may want to model those separately with a higher rate.",
      },
      {
        question: "I'm 45 and haven't started saving for retirement yet — is it too late?",
        answer:
          "It's never too late, but the math is less forgiving. With 15–20 years to retirement instead of 30–35, you'll need to invest a much larger monthly amount to build the same corpus. Use this calculator to run your specific numbers. You may also want to extend your working years slightly or adjust your retirement lifestyle expectations. The key is to start now — every year of delay costs more than most people realise.",
      },
      {
        question: "Should I include EPF and PPF in 'current savings'?",
        answer:
          "Yes, absolutely. Your EPF corpus, PPF balance, and any other retirement-earmarked savings should go into the 'current savings' field. EPF grows at roughly 8–8.5% per year (compounded annually), which you might want to model separately if your EPF balance is large, since the return rate differs from your equity portfolio.",
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
      "NPS is one of India's most tax-efficient retirement vehicles — you get deductions under both 80C and 80CCD(1B), and the corpus builds up over your working life. The challenge is estimating the final split: how much you'll withdraw tax-free as a lump sum and how much will go into an annuity for monthly pension. This calculator projects both.",
    formulaBlocks: [
      {
        type: "text",
        content:
          "Accumulation works like a regular SIP with monthly compounding. The distinctive part is the maturity split between lump sum and annuity:",
      },
      {
        type: "formula",
        lines: [
          "Accumulation (each month):",
          "  Corpus = (Corpus + Monthly Contribution) × (1 + r)",
          "",
          "At maturity:",
          "  Annuity Corpus  = Maturity × (Annuity % / 100)",
          "  Lump Sum        = Maturity − Annuity Corpus",
          "  Monthly Pension = Annuity Corpus × (Annuity Rate / 100) ÷ 12",
          "",
          "where  r = Annual Return Rate / 12 / 100",
        ],
      },
      {
        type: "text",
        content:
          "The minimum annuity allocation by PFRDA regulation is 40% — at least 40% of the maturity corpus must be used to purchase an annuity. The remaining 60% can be withdrawn as a tax-free lump sum. The estimated monthly pension depends on the annuity corpus size and the rate your annuity service provider offers at retirement, which has generally ranged from 5.5% to 7% in India.",
      },
    ],
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
        question: "How does NPS work at maturity?",
        answer:
          "When you reach 60, NPS allows you to withdraw up to 60% of the corpus as a tax-free lump sum. The remaining 40% (or more, if you choose) must be used to buy an annuity from an IRDAI-approved annuity service provider. The annuity then pays you a monthly pension for the rest of your life. This calculator helps you estimate both the lump sum and the expected monthly pension based on the annuity corpus and an assumed annuity return rate.",
      },
      {
        question: "How is the monthly pension estimated?",
        answer:
          "The estimated monthly pension uses the formula: pension = annuityCorpus × (annuityReturnRate / 100) ÷ 12. For example, if your annuity corpus is ₹40 lakh and the annuity rate is 6%, your annual pension is ₹2.4 lakh, or ₹20,000 per month. The actual pension depends on the annuity plan you choose (life annuity, joint life, with return of purchase price, etc.) and the rates prevailing at the time you retire.",
      },
      {
        question: "What annuity return rate should I use?",
        answer:
          "NPS annuity rates in India have generally ranged from 5.5% to 7% in recent years. A conservative planning assumption is 6%. This rate varies with interest rate cycles and the annuity provider's offerings. If you're planning decades out, use 5.5–6% to stay conservative, since long-term interest rates can fall.",
      },
      {
        question: "Is the 40% annuity a minimum or can I choose more?",
        answer:
          "40% is the regulatory minimum — you must put at least 40% of the corpus into an annuity at maturity. You can voluntarily put more. If you put 100% into the annuity, the full amount generates pension and you get no lump sum. This calculator lets you experiment with any annuity percentage from 40% to 100% to see how that choice affects both the lump sum and monthly pension.",
      },
      {
        question: "What are Tier I and Tier II NPS accounts?",
        answer:
          "Tier I is the primary NPS account — it has a lock-in until age 60 (with limited exceptions) but offers the full suite of tax benefits under 80C and 80CCD(1B). Tier II is a voluntary savings account with no lock-in or withdrawal restrictions, but it doesn't carry the same tax deduction benefits. This calculator models Tier I, the standard retirement corpus.",
      },
      {
        question: "What is the 80CCD(1B) benefit in NPS?",
        answer:
          "Section 80CCD(1B) allows an additional deduction of up to ₹50,000 per year for NPS contributions, over and above the ₹1.5 lakh limit under 80C. So if you're in the 30% tax bracket and contribute ₹50,000 to NPS under 80CCD(1B), you save ₹15,000 in tax. This additional deduction makes NPS particularly attractive compared to other 80C instruments.",
      },
      {
        question: "Can I change my fund manager or fund allocation inside NPS?",
        answer:
          "Yes. NPS allows you to switch between pension fund managers (up to 3 times per year for Tier I) and change your asset class allocation (between equity, corporate bonds, government bonds, and alternative assets). The default active choice allows up to 75% equity for subscribers below 50, tapering to 50% by age 60. You can opt for auto choice if you prefer the allocation to be managed automatically by age.",
      },
      {
        question: "Is the NPS corpus visible in this calculator's chart?",
        answer:
          "Yes — the bar chart shows invested amount (total contributions) and gains (market growth on top) year by year up to maturity. The summary cards show the final lump sum withdrawal, annuity corpus, total maturity value, and estimated monthly pension. All values are pre-tax projections.",
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
