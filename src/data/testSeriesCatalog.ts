import { Product } from '../types';

export interface TestSeriesProgram {
  id: string;
  name: string;
  level: 'executive' | 'professional' | 'cseet';
  badge: string;
  badgeColor: string;
  description: string;
  subjects: {
    code: string;
    name: string;
    shortName: string;
    isElective?: boolean;
  }[];
}

export const TEST_SERIES_PRICE_PER_SUBJECT = 699;
export const TEST_SERIES_ORIGINAL_PRICE_PER_SUBJECT = 1200;

export const TEST_SERIES_PROGRAMS: TestSeriesProgram[] = [
  {
    id: 'exec-g1',
    name: 'CS Executive - Group 1',
    level: 'executive',
    badge: 'Executive G1',
    badgeColor: 'bg-amber-500/15 text-amber-900 border-amber-500/30',
    description: '4 Core Law & Accounting Papers for June 2026 Attempt',
    subjects: [
      {
        code: 'Paper 1',
        name: 'Jurisprudence, Interpretation & General Laws (JIGL)',
        shortName: 'JIGL',
      },
      {
        code: 'Paper 2',
        name: 'Company Law & Practice',
        shortName: 'Company Law',
      },
      {
        code: 'Paper 3',
        name: 'Setting Up of Business, Industrial & Labour Laws (SBLL)',
        shortName: 'SBLL',
      },
      {
        code: 'Paper 4',
        name: 'Corporate Accounting & Financial Management (CAFM)',
        shortName: 'CAFM',
      },
    ],
  },
  {
    id: 'exec-g2',
    name: 'CS Executive - Group 2',
    level: 'executive',
    badge: 'Executive G2',
    badgeColor: 'bg-blue-500/15 text-blue-900 border-blue-500/30',
    description: '3 Core Market & Tax Papers for June 2026 Attempt',
    subjects: [
      {
        code: 'Paper 5',
        name: 'Capital Market & Securities Laws (CMSL)',
        shortName: 'CMSL',
      },
      {
        code: 'Paper 6',
        name: 'Economic, Commercial and Intellectual Property Laws (ECIPL)',
        shortName: 'ECIPL',
      },
      {
        code: 'Paper 7',
        name: 'Tax Laws & Practice (TLP)',
        shortName: 'Tax Laws',
      },
    ],
  },
  {
    id: 'exec-both',
    name: 'CS Executive - Both Groups (All 7 Papers)',
    level: 'executive',
    badge: 'Executive Both Groups',
    badgeColor: 'bg-emerald-500/15 text-emerald-900 border-emerald-500/30',
    description: 'Comprehensive 7-Subject Audit for Complete Executive Pass',
    subjects: [
      {
        code: 'Paper 1',
        name: 'Jurisprudence, Interpretation & General Laws (JIGL)',
        shortName: 'JIGL',
      },
      {
        code: 'Paper 2',
        name: 'Company Law & Practice',
        shortName: 'Company Law',
      },
      {
        code: 'Paper 3',
        name: 'Setting Up of Business, Industrial & Labour Laws (SBLL)',
        shortName: 'SBLL',
      },
      {
        code: 'Paper 4',
        name: 'Corporate Accounting & Financial Management (CAFM)',
        shortName: 'CAFM',
      },
      {
        code: 'Paper 5',
        name: 'Capital Market & Securities Laws (CMSL)',
        shortName: 'CMSL',
      },
      {
        code: 'Paper 6',
        name: 'Economic, Commercial and Intellectual Property Laws (ECIPL)',
        shortName: 'ECIPL',
      },
      {
        code: 'Paper 7',
        name: 'Tax Laws & Practice (TLP)',
        shortName: 'Tax Laws',
      },
    ],
  },
  {
    id: 'prof-g1',
    name: 'CS Professional - Group 1',
    level: 'professional',
    badge: 'Professional G1',
    badgeColor: 'bg-purple-500/15 text-purple-900 border-purple-500/30',
    description: 'Advanced Governance, Drafting & Due Diligence Papers',
    subjects: [
      {
        code: 'Paper 1',
        name: 'Environmental, Social and Governance (ESG) – Principles & Practice',
        shortName: 'ESG',
      },
      {
        code: 'Paper 2',
        name: 'Drafting, Pleadings and Appearances',
        shortName: 'Drafting',
      },
      {
        code: 'Paper 3',
        name: 'Compliance Management, Audit & Due Diligence',
        shortName: 'Audit & DD',
      },
      {
        code: 'Paper 4',
        name: 'Elective 1 (CSR / Forensic Audit / IPR / AI & Cyber Security)',
        shortName: 'Elective 1',
        isElective: true,
      },
    ],
  },
  {
    id: 'prof-g2',
    name: 'CS Professional - Group 2',
    level: 'professional',
    badge: 'Professional G2',
    badgeColor: 'bg-rose-500/15 text-rose-900 border-rose-500/30',
    description: 'Strategic Finance, Restructuring & Advanced Insolvency',
    subjects: [
      {
        code: 'Paper 5',
        name: 'Strategic Management & Corporate Finance',
        shortName: 'SMCF',
      },
      {
        code: 'Paper 6',
        name: 'Corporate Restructuring, Valuation & Insolvency',
        shortName: 'CRVI',
      },
      {
        code: 'Paper 7',
        name: 'Elective 2 (Arbitration / GST / Labour / Banking / IBC)',
        shortName: 'Elective 2',
        isElective: true,
      },
    ],
  },
  {
    id: 'prof-both',
    name: 'CS Professional - Both Groups (All 7 Papers)',
    level: 'professional',
    badge: 'Professional Both Groups',
    badgeColor: 'bg-indigo-500/15 text-indigo-900 border-indigo-500/30',
    description: 'Complete Ranker Level Audit for CS Professional Final Clearing',
    subjects: [
      {
        code: 'Paper 1',
        name: 'Environmental, Social and Governance (ESG) – Principles & Practice',
        shortName: 'ESG',
      },
      {
        code: 'Paper 2',
        name: 'Drafting, Pleadings and Appearances',
        shortName: 'Drafting',
      },
      {
        code: 'Paper 3',
        name: 'Compliance Management, Audit & Due Diligence',
        shortName: 'Audit & DD',
      },
      {
        code: 'Paper 4',
        name: 'Elective 1 (CSR / Forensic Audit / IPR / AI & Cyber Security)',
        shortName: 'Elective 1',
        isElective: true,
      },
      {
        code: 'Paper 5',
        name: 'Strategic Management & Corporate Finance',
        shortName: 'SMCF',
      },
      {
        code: 'Paper 6',
        name: 'Corporate Restructuring, Valuation & Insolvency',
        shortName: 'CRVI',
      },
      {
        code: 'Paper 7',
        name: 'Elective 2 (Arbitration / GST / Labour / Banking / IBC)',
        shortName: 'Elective 2',
        isElective: true,
      },
    ],
  },
];

/**
 * Creates a configured Test Series Product object with selected Program,
 * individual subjects list, and exact billing at ₹699 per subject.
 */
export function createConfiguredTestSeriesProduct(
  programId: string,
  selectedSubjectNames: string[]
): Product {
  const program =
    TEST_SERIES_PROGRAMS.find((p) => p.id === programId) || TEST_SERIES_PROGRAMS[0];

  // Guarantee at least one subject
  const subjectsToUse =
    selectedSubjectNames.length > 0
      ? selectedSubjectNames
      : [program.subjects[0].name];

  const count = subjectsToUse.length;
  const totalPrice = count * TEST_SERIES_PRICE_PER_SUBJECT;
  const totalOriginalPrice = count * TEST_SERIES_ORIGINAL_PRICE_PER_SUBJECT;

  const shortNames = subjectsToUse.map((s) => {
    const found = program.subjects.find((sub) => sub.name === s);
    return found ? found.shortName : s;
  });

  const title =
    count === 1
      ? `June 2026 Answersheet Analysis: ${shortNames[0]} (${program.badge})`
      : `June 2026 Answersheet Analysis: ${count} Subjects (${program.badge})`;

  return {
    id: `june-2026-test-series-${program.id}-${Date.now()}`,
    name: title,
    category: 'Test Series',
    price: totalPrice,
    originalPrice: totalOriginalPrice,
    badge: `${count} Subject${count > 1 ? 's' : ''} • ₹699/sub`,
    type: 'test-series',
    level: program.level,
    selectedProgram: program.name,
    selectedSubjects: subjectsToUse,
    pricePerSubject: TEST_SERIES_PRICE_PER_SUBJECT,
    description: `June 2026 ICSI Certified Answersheet Analysis & Step-Marking Audit by AIR 3 Harkiran Kaur Kohli for ${program.name}. Includes ${count} selected subject(s): ${shortNames.join(', ')}.`,
    features: [
      `Program: ${program.name}`,
      `Selected Subjects (${count}): ${subjectsToUse.join('; ')}`,
      `Billing Breakdown: ₹699 × ${count} subject${count > 1 ? 's' : ''} = ₹${totalPrice.toLocaleString('en-IN')}/-`,
      'Question-by-question marks deduction & statutory citation audit',
      'ICSI model answer & step-marking comparison',
      'Personalized audio/video feedback by AIR 3 Harkiran Kaur Kohli',
      'Comprehensive score-boosting action plan for upcoming attempt',
      'Turnaround time: 48-72 hours via WhatsApp / Email',
    ],
    modules: [],
  };
}
