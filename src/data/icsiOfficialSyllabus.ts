export interface OfficialSyllabusChapter {
  ch: string;
  topic: string;
  part?: string;
  defaultAmendment?: string;
}

export interface OfficialSyllabusPaper {
  code: string;
  name: string;
  shortName: string;
  parts?: string[];
  chapters: OfficialSyllabusChapter[];
}

export interface OfficialSyllabusGroup {
  id: string; // 'cseet' | 'exec-g1' | 'exec-g2' | 'prof-g1' | 'prof-g2'
  program: 'CS EET' | 'CS Executive' | 'CS Professional';
  groupName: 'General' | 'Group 1' | 'Group 2';
  title: string;
  papers: OfficialSyllabusPaper[];
}

/**
 * Verified ICSI Official New Syllabus Index
 * Sourced directly from Official ICSI Curriculum Specification:
 * - CSEET: Papers 1 to 4
 * - CS Executive: Group 1 (Papers 1 to 4) & Group 2 (Papers 5 to 7)
 * - CS Professional: Group 1 (Papers 1 to 4.1) & Group 2 (Papers 5 to 7.5)
 */
export const ICSI_OFFICIAL_SYLLABUS: Record<string, OfficialSyllabusGroup> = {
  // -------------------------------------------------------------
  // 1. CSEET
  // -------------------------------------------------------------
  cseet: {
    id: 'cseet',
    program: 'CS EET',
    groupName: 'General',
    title: 'CSEET (Company Secretary Executive Entrance Test)',
    papers: [
      {
        code: 'Paper 1',
        shortName: 'BC',
        name: 'Business Communication',
        chapters: [
          { ch: 'Lesson 1', topic: 'Essentials of Good English' },
          { ch: 'Lesson 2', topic: 'Communication' },
          { ch: 'Lesson 3', topic: 'Business Correspondence' },
          { ch: 'Lesson 4', topic: 'Common Business Terminologies' },
        ],
      },
      {
        code: 'Paper 2',
        shortName: 'FOA',
        name: 'Fundamentals of Accounting',
        chapters: [
          { ch: 'Lesson 1', topic: 'Basics Concept and Principles of Accounting' },
          { ch: 'Lesson 2', topic: 'Accounting Process' },
          { ch: 'Lesson 3', topic: 'Bank Reconciliation Statement' },
          { ch: 'Lesson 4', topic: 'Depreciation and Amortization' },
          { ch: 'Lesson 5', topic: 'Preparation of Final Accounts for Sole Proprietorship' },
          { ch: 'Lesson 6', topic: 'Partnership and LLP Accounts' },
          { ch: 'Lesson 7', topic: 'Introduction to Company Accounts' },
          { ch: 'Lesson 8', topic: 'Accounting for Non-Profit Organizations' },
        ],
      },
      {
        code: 'Paper 3',
        shortName: 'EBE',
        name: 'Economic and Business Environment',
        parts: ['Part A: Economic Environment', 'Part B: Business Environment'],
        chapters: [
          // Part A
          { ch: 'Lesson 1', topic: 'Basics of Demand and Supply and Forms of Market Competition', part: 'Part A: Economic Environment' },
          { ch: 'Lesson 2', topic: 'National Income Accounting and Related Concepts', part: 'Part A: Economic Environment' },
          { ch: 'Lesson 3', topic: 'Indian Union Budget', part: 'Part A: Economic Environment' },
          { ch: 'Lesson 4', topic: 'Indian Financial Markets', part: 'Part A: Economic Environment' },
          { ch: 'Lesson 5', topic: 'Indian Economy', part: 'Part A: Economic Environment' },
          // Part B
          { ch: 'Lesson 6', topic: 'Entrepreneurship Scenario', part: 'Part B: Business Environment' },
          { ch: 'Lesson 7', topic: 'Business Environment', part: 'Part B: Business Environment' },
          { ch: 'Lesson 8', topic: 'Key Government Institutions', part: 'Part B: Business Environment' },
          { ch: 'Lesson 9', topic: 'Global Environment', part: 'Part B: Business Environment' },
          { ch: 'Lesson 10', topic: 'Environmental Governance', part: 'Part B: Business Environment' },
          { ch: 'Lesson 11', topic: 'AI and Business Environment', part: 'Part B: Business Environment' },
          { ch: 'Lesson 12', topic: 'Elements of Corporate Governance', part: 'Part B: Business Environment' },
        ],
      },
      {
        code: 'Paper 4',
        shortName: 'BLM',
        name: 'Business Laws & Management',
        parts: ['Part A: Business Laws', 'Part B: Business Management'],
        chapters: [
          // Part A
          { ch: 'Lesson 1', topic: 'Introduction to Law', part: 'Part A – Business Laws' },
          { ch: 'Lesson 2', topic: 'Elements of Company Law', part: 'Part A – Business Laws' },
          { ch: 'Lesson 3', topic: 'Elements of Law of Contracts', part: 'Part A – Business Laws' },
          { ch: 'Lesson 4', topic: 'Elements of Law relating to Partnership and Limited Liability Partnership', part: 'Part A – Business Laws' },
          { ch: 'Lesson 5', topic: 'Elements of Law relating to Sale of Goods', part: 'Part A – Business Laws' },
          { ch: 'Lesson 6', topic: 'Elements of Law relating to Negotiable Instruments', part: 'Part A – Business Laws' },
          // Part B
          { ch: 'Lesson 7', topic: 'Introduction to Management', part: 'Part B – Business Management' },
          { ch: 'Lesson 8', topic: 'Functions of Management', part: 'Part B – Business Management' },
          { ch: 'Lesson 9', topic: 'Principles of Management and Modern Approaches', part: 'Part B – Business Management' },
          { ch: 'Lesson 10', topic: 'Management Knowledge for Company Secretaries', part: 'Part B – Business Management' },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // 2. CS EXECUTIVE - GROUP 1
  // -------------------------------------------------------------
  'exec-g1': {
    id: 'exec-g1',
    program: 'CS Executive',
    groupName: 'Group 1',
    title: 'CS Executive — Group 1',
    papers: [
      {
        code: 'Paper 1',
        shortName: 'JIGL',
        name: 'Jurisprudence, Interpretation and General Laws (JIGL)',
        chapters: [
          { ch: 'Lesson 1', topic: 'Sources of Law' },
          { ch: 'Lesson 2', topic: 'Constitution of India' },
          { ch: 'Lesson 3', topic: 'Interpretation of Statutes' },
          { ch: 'Lesson 4', topic: 'Administrative Laws' },
          { ch: 'Lesson 5', topic: 'Law of Torts' },
          { ch: 'Lesson 6', topic: 'Law relating to Civil Procedure' },
          { ch: 'Lesson 7', topic: 'Laws relating to Crime and its Procedure' },
          { ch: 'Lesson 8', topic: 'Law relating to Evidence' },
          { ch: 'Lesson 9', topic: 'Law relating to Limitation' },
          { ch: 'Lesson 10', topic: 'Law relating to Arbitration, Mediation and Conciliation' },
          { ch: 'Lesson 11', topic: 'Right to Information Law' },
          { ch: 'Lesson 12', topic: 'Law relating to Information Technology' },
          { ch: 'Lesson 13', topic: 'Contract Law' },
          { ch: 'Lesson 14', topic: 'Law relating to Negotiable Instruments' },
        ],
      },
      {
        code: 'Paper 2',
        shortName: 'CL',
        name: 'Company Law & Practice',
        parts: ['PART I : COMPANY LAW – PRINCIPLES & CONCEPTS', 'PART II: COMPANY ADMINISTRATION AND MEETINGS'],
        chapters: [
          // Part I
          { ch: 'Lesson 1', topic: 'Introduction to Company Law', part: 'PART I : COMPANY LAW – PRINCIPLES & CONCEPTS' },
          { ch: 'Lesson 2', topic: 'Legal Status and Types of Registered Companies', part: 'PART I : COMPANY LAW – PRINCIPLES & CONCEPTS' },
          { ch: 'Lesson 3', topic: 'Memorandum and Articles of Associations and its Alteration', part: 'PART I : COMPANY LAW – PRINCIPLES & CONCEPTS' },
          { ch: 'Lesson 4', topic: 'Share and Share Capital – Concepts', part: 'PART I : COMPANY LAW – PRINCIPLES & CONCEPTS' },
          { ch: 'Lesson 5', topic: 'Members and Shareholders', part: 'PART I : COMPANY LAW – PRINCIPLES & CONCEPTS' },
          { ch: 'Lesson 6', topic: 'Debt Instruments – Concepts', part: 'PART I : COMPANY LAW – PRINCIPLES & CONCEPTS' },
          { ch: 'Lesson 7', topic: 'Charges', part: 'PART I : COMPANY LAW – PRINCIPLES & CONCEPTS' },
          { ch: 'Lesson 8', topic: 'Distribution of Profits', part: 'PART I : COMPANY LAW – PRINCIPLES & CONCEPTS' },
          { ch: 'Lesson 9', topic: 'Accounts and Auditors', part: 'PART I : COMPANY LAW – PRINCIPLES & CONCEPTS' },
          { ch: 'Lesson 10', topic: 'Compromise, Arrangement and Amalgamations – Concepts', part: 'PART I : COMPANY LAW – PRINCIPLES & CONCEPTS' },
          { ch: 'Lesson 11', topic: 'Dormant Company', part: 'PART I : COMPANY LAW – PRINCIPLES & CONCEPTS' },
          // Part II
          { ch: 'Lesson 12', topic: 'General Meetings', part: 'PART II: COMPANY ADMINISTRATION AND MEETINGS' },
          { ch: 'Lesson 13', topic: 'Directors', part: 'PART II: COMPANY ADMINISTRATION AND MEETINGS' },
          { ch: 'Lesson 14', topic: 'Board Composition and Powers of the Board', part: 'PART II: COMPANY ADMINISTRATION AND MEETINGS' },
          { ch: 'Lesson 15', topic: 'Meetings of Board and its Committees', part: 'PART II: COMPANY ADMINISTRATION AND MEETINGS' },
          { ch: 'Lesson 16', topic: 'Annual Report – Concepts', part: 'PART II: COMPANY ADMINISTRATION AND MEETINGS' },
          { ch: 'Lesson 17', topic: 'Key Managerial Personnel (KMP’s) and their Remuneration', part: 'PART II: COMPANY ADMINISTRATION AND MEETINGS' },
        ],
      },
      {
        code: 'Paper 3',
        shortName: 'SBILL',
        name: 'Setting Up of Business, Industrial and Labour Laws (SBILL)',
        parts: ['PART I: SETTING UP OF BUSINESS', 'PART II: INDUSTRIAL AND LABOUR LAWS'],
        chapters: [
          // Part I
          { ch: 'Lesson 1', topic: 'Selection of Business Organization', part: 'PART I: SETTING UP OF BUSINESS' },
          { ch: 'Lesson 2', topic: 'Corporate Entities – Companies', part: 'PART I: SETTING UP OF BUSINESS' },
          { ch: 'Lesson 3', topic: 'Limited Liability Partnership', part: 'PART I: SETTING UP OF BUSINESS' },
          { ch: 'Lesson 4', topic: 'Startups and its Registration', part: 'PART I: SETTING UP OF BUSINESS' },
          { ch: 'Lesson 5', topic: 'Micro, Small and Medium Enterprises', part: 'PART I: SETTING UP OF BUSINESS' },
          { ch: 'Lesson 6', topic: 'Conversion of Business Entities', part: 'PART I: SETTING UP OF BUSINESS' },
          { ch: 'Lesson 7', topic: 'Non-Corporate Entities', part: 'PART I: SETTING UP OF BUSINESS' },
          { ch: 'Lesson 8', topic: 'Financial Services Organization', part: 'PART I: SETTING UP OF BUSINESS' },
          { ch: 'Lesson 9', topic: 'Business Collaborations', part: 'PART I: SETTING UP OF BUSINESS' },
          { ch: 'Lesson 10', topic: 'Setting up of Branch Office/ Liaison Office/ Wholly Owned Subsidiary by Foreign Company', part: 'PART I: SETTING UP OF BUSINESS' },
          { ch: 'Lesson 11', topic: 'Setting up of Business outside India and Issue Relating thereto', part: 'PART I: SETTING UP OF BUSINESS' },
          { ch: 'Lesson 12', topic: 'Identifying laws applicable to various Industries and their initial compliances', part: 'PART I: SETTING UP OF BUSINESS' },
          { ch: 'Lesson 13', topic: 'Various Initial Registrations and Licenses', part: 'PART I: SETTING UP OF BUSINESS' },
          // Part II
          { ch: 'Lesson 14', topic: 'Constitution and Labour Laws', part: 'PART II: INDUSTRIAL AND LABOUR LAWS' },
          { ch: 'Lesson 15', topic: 'Evaluation of Labour Legislation and need of Labour Code', part: 'PART II: INDUSTRIAL AND LABOUR LAWS' },
          { ch: 'Lesson 16', topic: 'The Occupational Safety, Health and Working Conditions Code, 2020', part: 'PART II: INDUSTRIAL AND LABOUR LAWS' },
          { ch: 'Lesson 17', topic: 'The Industrial Relations Code, 2020', part: 'PART II: INDUSTRIAL AND LABOUR LAWS' },
          { ch: 'Lesson 18', topic: 'Code On Wages, 2019', part: 'PART II: INDUSTRIAL AND LABOUR LAWS' },
          { ch: 'Lesson 19', topic: 'Code on Social Security, 2020', part: 'PART II: INDUSTRIAL AND LABOUR LAWS' },
          { ch: 'Lesson 20', topic: 'The Child and Adolescent Labour (Prohibition and Regulation) Act', part: 'PART II: INDUSTRIAL AND LABOUR LAWS' },
          { ch: 'Lesson 21', topic: 'Apprentices Act, 1961', part: 'PART II: INDUSTRIAL AND LABOUR LAWS' },
          { ch: 'Lesson 22', topic: 'The Labour Laws (Simplification of Procedure for furnishing Returns and Maintaining Registers by Certain Establishments) Act.', part: 'PART II: INDUSTRIAL AND LABOUR LAWS' },
          { ch: 'Lesson 23', topic: 'Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013', part: 'PART II: INDUSTRIAL AND LABOUR LAWS' },
        ],
      },
      {
        code: 'Paper 4',
        shortName: 'CAFM',
        name: 'Corporate Accounting and Financial Management (CAFM)',
        parts: ['PART I : CORPORATE ACCOUNTING (60 MARKS)', 'PART II : FINANCIAL MANAGEMENT (40 MARKS)'],
        chapters: [
          // Part I
          { ch: 'Lesson 1', topic: 'Introduction to Accounting', part: 'PART I : CORPORATE ACCOUNTING' },
          { ch: 'Lesson 2', topic: 'Introduction to Corporate Accounting', part: 'PART I : CORPORATE ACCOUNTING' },
          { ch: 'Lesson 3', topic: 'Accounting Standards (AS)', part: 'PART I : CORPORATE ACCOUNTING' },
          { ch: 'Lesson 4', topic: 'Accounting for Share Capital', part: 'PART I : CORPORATE ACCOUNTING' },
          { ch: 'Lesson 5', topic: 'Accounting for Debentures', part: 'PART I : CORPORATE ACCOUNTING' },
          { ch: 'Lesson 6', topic: 'Related Aspects of Company Accounts', part: 'PART I : CORPORATE ACCOUNTING' },
          { ch: 'Lesson 7', topic: 'Consolidation of Accounts', part: 'PART I : CORPORATE ACCOUNTING' },
          { ch: 'Lesson 8', topic: 'Financial Statement Analysis', part: 'PART I : CORPORATE ACCOUNTING' },
          { ch: 'Lesson 9', topic: 'Cash Flows', part: 'PART I : CORPORATE ACCOUNTING' },
          { ch: 'Lesson 10', topic: 'Forecasting Financial Statements', part: 'PART I : CORPORATE ACCOUNTING' },
          // Part II
          { ch: 'Lesson 11', topic: 'Introduction', part: 'PART II : FINANCIAL MANAGEMENT' },
          { ch: 'Lesson 12', topic: 'Time Value of Money', part: 'PART II : FINANCIAL MANAGEMENT' },
          { ch: 'Lesson 13', topic: 'Capital Budgeting', part: 'PART II : FINANCIAL MANAGEMENT' },
          { ch: 'Lesson 14', topic: 'Cost of Capital', part: 'PART II : FINANCIAL MANAGEMENT' },
          { ch: 'Lesson 15', topic: 'Capital Structure', part: 'PART II : FINANCIAL MANAGEMENT' },
          { ch: 'Lesson 16', topic: 'Dividend Decisions', part: 'PART II : FINANCIAL MANAGEMENT' },
          { ch: 'Lesson 17', topic: 'Working Capital Management', part: 'PART II : FINANCIAL MANAGEMENT' },
          { ch: 'Lesson 18', topic: 'Security Analysis', part: 'PART II : FINANCIAL MANAGEMENT' },
          { ch: 'Lesson 19', topic: 'Operational Approach to Financial Decision', part: 'PART II : FINANCIAL MANAGEMENT' },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // 3. CS EXECUTIVE - GROUP 2
  // -------------------------------------------------------------
  'exec-g2': {
    id: 'exec-g2',
    program: 'CS Executive',
    groupName: 'Group 2',
    title: 'CS Executive — Group 2',
    papers: [
      {
        code: 'Paper 5',
        shortName: 'CMSL',
        name: 'Capital Market & Securities Laws (CMSL)',
        parts: ['PART I – CAPITAL MARKET', 'PART II – SECURITIES LAWS'],
        chapters: [
          // Part I
          { ch: 'Lesson 1', topic: 'Basics of Capital Market', part: 'PART I – CAPITAL MARKET' },
          { ch: 'Lesson 2', topic: 'Secondary Market in India', part: 'PART I – CAPITAL MARKET' },
          { ch: 'Lesson 3', topic: 'Securities Contracts (Regulation) Act, 1956', part: 'PART I – CAPITAL MARKET' },
          { ch: 'Lesson 4', topic: 'Securities and Exchange Board of India', part: 'PART I – CAPITAL MARKET' },
          { ch: 'Lesson 5', topic: 'Laws Governing to Depositories and Depository Participants', part: 'PART I – CAPITAL MARKET' },
          { ch: 'Lesson 6', topic: 'Securities Market Intermediaries', part: 'PART I – CAPITAL MARKET' },
          { ch: 'Lesson 7', topic: 'International Financial Services Centres Authority (IFSCA)', part: 'PART I – CAPITAL MARKET' },
          // Part II
          { ch: 'Lesson 8', topic: 'Issue of Capital & Disclosure Requirements', part: 'PART II – SECURITIES LAWS' },
          { ch: 'Lesson 9', topic: 'Share Based Employee Benefits and Sweat Equity', part: 'PART II – SECURITIES LAWS' },
          { ch: 'Lesson 10', topic: 'Issue and Listing of Non-Convertible Securities', part: 'PART II – SECURITIES LAWS' },
          { ch: 'Lesson 11', topic: 'Listing Obligations and Disclosure Requirements', part: 'PART II – SECURITIES LAWS' },
          { ch: 'Lesson 12', topic: 'Acquisition of Shares and Takeovers – Concepts', part: 'PART II – SECURITIES LAWS' },
          { ch: 'Lesson 13', topic: 'Prohibition of Insider Trading', part: 'PART II – SECURITIES LAWS' },
          { ch: 'Lesson 14', topic: 'Prohibition of Fraudulent and Unfair Trade Practices Relating to Securities Market', part: 'PART II – SECURITIES LAWS' },
          { ch: 'Lesson 15', topic: 'Delisting of Equity Shares', part: 'PART II – SECURITIES LAWS' },
          { ch: 'Lesson 16', topic: 'Buy-Back of Securities', part: 'PART II – SECURITIES LAWS' },
          { ch: 'Lesson 17', topic: 'Mutual Funds', part: 'PART II – SECURITIES LAWS' },
          { ch: 'Lesson 18', topic: 'Collective Investment Schemes', part: 'PART II – SECURITIES LAWS' },
        ],
      },
      {
        code: 'Paper 6',
        shortName: 'ECIPL',
        name: 'Economic, Commercial & Intellectual Property Laws (ECIPL)',
        parts: ['PART I: ECONOMIC & COMMERCIAL LAWS', 'PART II: INTELLECTUAL PROPERTY LAWS'],
        chapters: [
          // Part I
          { ch: 'Lesson 1', topic: 'Law relating Foreign Exchange Management', part: 'PART I: ECONOMIC & COMMERCIAL LAWS' },
          { ch: 'Lesson 2', topic: 'Foreign Direct Investments – Regulations & Policy', part: 'PART I: ECONOMIC & COMMERCIAL LAWS' },
          { ch: 'Lesson 3', topic: 'Overseas Direct Investment', part: 'PART I: ECONOMIC & COMMERCIAL LAWS' },
          { ch: 'Lesson 4', topic: 'Foreign Trade Policy & Procedure', part: 'PART I: ECONOMIC & COMMERCIAL LAWS' },
          { ch: 'Lesson 5', topic: 'Law relating to Special Economic Zones', part: 'PART I: ECONOMIC & COMMERCIAL LAWS' },
          { ch: 'Lesson 6', topic: 'Law relating to Foreign Contribution Regulation', part: 'PART I: ECONOMIC & COMMERCIAL LAWS' },
          { ch: 'Lesson 7', topic: 'Prevention of Money Laundering', part: 'PART I: ECONOMIC & COMMERCIAL LAWS' },
          { ch: 'Lesson 8', topic: 'Competition Law', part: 'PART I: ECONOMIC & COMMERCIAL LAWS' },
          { ch: 'Lesson 9', topic: 'Law relating to Consumer Protection', part: 'PART I: ECONOMIC & COMMERCIAL LAWS' },
          { ch: 'Lesson 10', topic: 'Legal Metrology', part: 'PART I: ECONOMIC & COMMERCIAL LAWS' },
          { ch: 'Lesson 11', topic: 'Real Estate Regulation and Development Law', part: 'PART I: ECONOMIC & COMMERCIAL LAWS' },
          // Part II
          { ch: 'Lesson 12', topic: 'Intellectual Property Rights', part: 'PART II: INTELLECTUAL PROPERTY LAWS' },
          { ch: 'Lesson 13', topic: 'Law relating to Patents', part: 'PART II: INTELLECTUAL PROPERTY LAWS' },
          { ch: 'Lesson 14', topic: 'Law relating to Trade Marks', part: 'PART II: INTELLECTUAL PROPERTY LAWS' },
          { ch: 'Lesson 15', topic: 'Law relating to Copyright', part: 'PART II: INTELLECTUAL PROPERTY LAWS' },
          { ch: 'Lesson 16', topic: 'Law relating to Geographical Indications of Goods', part: 'PART II: INTELLECTUAL PROPERTY LAWS' },
          { ch: 'Lesson 17', topic: 'Law relating to Designs', part: 'PART II: INTELLECTUAL PROPERTY LAWS' },
        ],
      },
      {
        code: 'Paper 7',
        shortName: 'TLP',
        name: 'Tax Laws & Practice',
        parts: ['PART I : DIRECT TAX', 'PART II : INDIRECT TAX (GST & CUSTOMS)'],
        chapters: [
          // Part I
          { ch: 'Lesson 1', topic: 'Direct Taxes – At a Glance', part: 'PART I : DIRECT TAX' },
          { ch: 'Lesson 2', topic: 'Basic Concept of Income Tax', part: 'PART I : DIRECT TAX' },
          { ch: 'Lesson 3', topic: 'Incomes which do not form part of Total Income', part: 'PART I : DIRECT TAX' },
          { ch: 'Lesson 4', topic: 'Income under the head Salary', part: 'PART I : DIRECT TAX' },
          { ch: 'Lesson 5', topic: 'Income under the head House Property', part: 'PART I : DIRECT TAX' },
          { ch: 'Lesson 6', topic: 'Profits and Gains from Business and Profession', part: 'PART I : DIRECT TAX' },
          { ch: 'Lesson 7', topic: 'Capital Gains', part: 'PART I : DIRECT TAX' },
          { ch: 'Lesson 8', topic: 'Income from Other Sources', part: 'PART I : DIRECT TAX' },
          { ch: 'Lesson 9', topic: 'Clubbing provisions and Set off and / or Carry forward of Losses', part: 'PART I : DIRECT TAX' },
          { ch: 'Lesson 10', topic: 'Deductions', part: 'PART I : DIRECT TAX' },
          { ch: 'Lesson 11', topic: 'Computation of Total Income and Tax Liability of various Entities', part: 'PART I : DIRECT TAX' },
          { ch: 'Lesson 12', topic: 'Classification and Tax incidence on Companies', part: 'PART I : DIRECT TAX' },
          { ch: 'Lesson 13', topic: 'Procedural Compliance', part: 'PART I : DIRECT TAX' },
          // Part II
          { ch: 'Lesson 14', topic: 'Concept of Indirect Taxes at a Glance', part: 'PART II : INDIRECT TAX (GST & CUSTOMS)' },
          { ch: 'Lesson 15', topic: 'Basics of Goods and Services Tax ‘GST’', part: 'PART II : INDIRECT TAX (GST & CUSTOMS)' },
          { ch: 'Lesson 16', topic: 'Levy and Collection of GST', part: 'PART II : INDIRECT TAX (GST & CUSTOMS)' },
          { ch: 'Lesson 17', topic: 'Time, Value & Place of Supply', part: 'PART II : INDIRECT TAX (GST & CUSTOMS)' },
          { ch: 'Lesson 18', topic: 'Input Tax Credit & Computation of GST Liability', part: 'PART II : INDIRECT TAX (GST & CUSTOMS)' },
          { ch: 'Lesson 19', topic: 'Procedural Compliance under GST', part: 'PART II : INDIRECT TAX (GST & CUSTOMS)' },
          { ch: 'Lesson 20', topic: 'Overview of Customs Act', part: 'PART II : INDIRECT TAX (GST & CUSTOMS)' },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // 4. CS PROFESSIONAL - GROUP 1
  // -------------------------------------------------------------
  'prof-g1': {
    id: 'prof-g1',
    program: 'CS Professional',
    groupName: 'Group 1',
    title: 'CS Professional — Group 1',
    papers: [
      {
        code: 'Paper 1',
        shortName: 'ESG',
        name: 'Environmental, Social and Governance (ESG) – Principles & Practice',
        parts: [
          'PART I: GOVERNANCE AND SUSTAINABILITY',
          'PART II : RISK MANAGEMENT',
          'PART III: ENVIRONMENT & SUSTAINABILITY REPORTING',
        ],
        chapters: [
          // Part I
          { ch: 'Lesson 1', topic: 'Conceptual Framework of Corporate Governance', part: 'PART I: GOVERNANCE AND SUSTAINABILITY' },
          { ch: 'Lesson 2', topic: 'Legislative Framework of Corporate Governance in India', part: 'PART I: GOVERNANCE AND SUSTAINABILITY' },
          { ch: 'Lesson 3', topic: 'Board Effectiveness/Building Better Boards', part: 'PART I: GOVERNANCE AND SUSTAINABILITY' },
          { ch: 'Lesson 4', topic: 'Board Processes through Secretarial Standards', part: 'PART I: GOVERNANCE AND SUSTAINABILITY' },
          { ch: 'Lesson 5', topic: 'Board Committees', part: 'PART I: GOVERNANCE AND SUSTAINABILITY' },
          { ch: 'Lesson 6', topic: 'Building Better Boards (This lesson has been merged with Lesson 3: Board Effectiveness / Building Better Boards.)', part: 'PART I: GOVERNANCE AND SUSTAINABILITY' },
          { ch: 'Lesson 7', topic: 'Concept of Governance in Professional Managed Company & Promoters Driven Company', part: 'PART I: GOVERNANCE AND SUSTAINABILITY' },
          { ch: 'Lesson 8', topic: 'Board Disclosures and Website Disclosures', part: 'PART I: GOVERNANCE AND SUSTAINABILITY' },
          { ch: 'Lesson 9', topic: 'Data Governance', part: 'PART I: GOVERNANCE AND SUSTAINABILITY' },
          { ch: 'Lesson 10', topic: 'Stakeholders Rights', part: 'PART I: GOVERNANCE AND SUSTAINABILITY' },
          { ch: 'Lesson 11', topic: 'Business Ethics, Code of Conduct and Anti-Bribery', part: 'PART I: GOVERNANCE AND SUSTAINABILITY' },
          { ch: 'Lesson 12', topic: 'Board’s Accountability on ESG', part: 'PART I: GOVERNANCE AND SUSTAINABILITY' },
          { ch: 'Lesson 13', topic: 'Environment', part: 'PART I: GOVERNANCE AND SUSTAINABILITY' },
          { ch: 'Lesson 14', topic: 'Corporate Social Responsibility (CSR)', part: 'PART I: GOVERNANCE AND SUSTAINABILITY' },
          { ch: 'Lesson 15', topic: 'Green Initiatives', part: 'PART I: GOVERNANCE AND SUSTAINABILITY' },
          { ch: 'Lesson 16', topic: 'Governance Influencers', part: 'PART I: GOVERNANCE AND SUSTAINABILITY' },
          { ch: 'Lesson 17', topic: 'Empowerment of the Company Secretary Profession', part: 'PART I: GOVERNANCE AND SUSTAINABILITY' },
          // Part II
          { ch: 'Lesson 18', topic: 'Risk Management', part: 'PART II : RISK MANAGEMENT' },
          // Part III
          { ch: 'Lesson 19', topic: 'Sustainability Audit; ESG Rating; Emerging Mandates from Government and Regulators', part: 'PART III: ENVIRONMENT & SUSTAINABILITY REPORTING' },
          { ch: 'Lesson 20', topic: 'Integrated Reporting Framework; Global Reporting Initiative Framework; Business Responsibility & Sustainability Reporting', part: 'PART III: ENVIRONMENT & SUSTAINABILITY REPORTING' },
        ],
      },
      {
        code: 'Paper 2',
        shortName: 'DPA',
        name: 'Drafting, Pleadings & Appearances',
        parts: ['Part I : Drafting and Conveorncing', 'Part II : Pleadings and Appearances'],
        chapters: [
          // Part I
          { ch: 'Lesson 1', topic: 'Types of Documents', part: 'Part I : Drafting and Conveorncing' },
          { ch: 'Lesson 2', topic: 'General principles of Drafting', part: 'Part I : Drafting and Conveorncing' },
          { ch: 'Lesson 3', topic: 'Laws relating to Drafting and Conveorncing', part: 'Part I : Drafting and Conveorncing' },
          { ch: 'Lesson 4', topic: 'Drafting of Agreements, Deeds and Documents', part: 'Part I : Drafting and Conveorncing' },
          { ch: 'Lesson 5', topic: 'Drafting of Commercial Contracts', part: 'Part I : Drafting and Conveorncing' },
          { ch: 'Lesson 6', topic: 'Documents under Companies Act, 2013', part: 'Part I : Drafting and Conveorncing' },
          { ch: 'Lesson 7', topic: 'Art of Opinion Writing', part: 'Part I : Drafting and Conveorncing' },
          { ch: 'Lesson 8', topic: 'Commercial Contract Management', part: 'Part I : Drafting and Conveorncing' },
          // Part II
          { ch: 'Lesson 9', topic: 'Judicial & Administrative framework', part: 'Part II : Pleadings and Appearances' },
          { ch: 'Lesson 10', topic: 'Pleadings', part: 'Part II : Pleadings and Appearances' },
          { ch: 'Lesson 11', topic: 'Art of Advocacy and Appearances', part: 'Part II : Pleadings and Appearances' },
          { ch: 'Lesson 12', topic: 'Applications, Petitions and Appeals under Companies Act, 2013', part: 'Part II : Pleadings and Appearances' },
          { ch: 'Lesson 13', topic: 'Adjudications and Appeals under SEBI Laws', part: 'Part II : Pleadings and Appearances' },
          { ch: 'Lesson 14', topic: 'Appearance before other Regulatory and Quasi-judicial Authorities', part: 'Part II : Pleadings and Appearances' },
        ],
      },
      {
        code: 'Paper 3',
        shortName: 'CMADD',
        name: 'Compliance Management, Audit & Due Diligence',
        parts: ['PART I: COMPLIANCE MANAGEMENT (40 MARKS)', 'PART II: AUDIT & DUE DILIGENCE (60 MARKS)'],
        chapters: [
          // Part I
          { ch: 'Lesson 1', topic: 'Compliance Framework', part: 'PART I: COMPLIANCE MANAGEMENT' },
          { ch: 'Lesson 2', topic: 'Documentation & Maintenance of Records', part: 'PART I: COMPLIANCE MANAGEMENT' },
          { ch: 'Lesson 3', topic: 'Signing and Certification', part: 'PART I: COMPLIANCE MANAGEMENT' },
          { ch: 'Lesson 4', topic: 'Legal Framework Governing Company Secretaries', part: 'PART I: COMPLIANCE MANAGEMENT' },
          { ch: 'Lesson 5', topic: 'Values, Ethics and Professional Conduct', part: 'PART I: COMPLIANCE MANAGEMENT' },
          { ch: 'Lesson 6', topic: 'Non-Compliances, Penalties and Adjudications', part: 'PART I: COMPLIANCE MANAGEMENT' },
          { ch: 'Lesson 7', topic: 'Relief and Remedies', part: 'PART I: COMPLIANCE MANAGEMENT' },
          // Part II
          { ch: 'Lesson 8', topic: 'Concepts of Various Audits', part: 'PART II: AUDIT & DUE DILIGENCE' },
          { ch: 'Lesson 9', topic: 'Audit Engagement', part: 'PART II: AUDIT & DUE DILIGENCE' },
          { ch: 'Lesson 10', topic: 'Audit Principles and Techniques', part: 'PART II: AUDIT & DUE DILIGENCE' },
          { ch: 'Lesson 11', topic: 'Audit Process and Documentation', part: 'PART II: AUDIT & DUE DILIGENCE' },
          { ch: 'Lesson 12', topic: 'Forming an Opinion & Reporting', part: 'PART II: AUDIT & DUE DILIGENCE' },
          { ch: 'Lesson 13', topic: 'Secretarial Audit', part: 'PART II: AUDIT & DUE DILIGENCE' },
          { ch: 'Lesson 14', topic: 'Internal Audit & Performance Audit', part: 'PART II: AUDIT & DUE DILIGENCE' },
          { ch: 'Lesson 15', topic: 'Peer Review and Quality Review', part: 'PART II: AUDIT & DUE DILIGENCE' },
          { ch: 'Lesson 16', topic: 'Due Diligence', part: 'PART II: AUDIT & DUE DILIGENCE' },
        ],
      },
      {
        code: 'Elective Paper 4.1',
        shortName: 'CSR',
        name: 'CSR & Social Governance',
        parts: ['PART I – CORPORATE SOCIAL RESPONSIBILITY', 'PART II – SOCIAL GOVERNANCE'],
        chapters: [
          // Part I
          { ch: 'Lesson 1', topic: 'Corporate Social Responsibility', part: 'PART I – CORPORATE SOCIAL RESPONSIBILITY' },
          { ch: 'Lesson 2', topic: 'CSR Policy', part: 'PART I – CORPORATE SOCIAL RESPONSIBILITY' },
          { ch: 'Lesson 3', topic: 'CSR Projects & Implementation Agency', part: 'PART I – CORPORATE SOCIAL RESPONSIBILITY' },
          { ch: 'Lesson 4', topic: 'Social Impact Assessment & CSR Audit', part: 'PART I – CORPORATE SOCIAL RESPONSIBILITY' },
          { ch: 'Lesson 5', topic: 'Guidelines on CSR', part: 'PART I – CORPORATE SOCIAL RESPONSIBILITY' },
          { ch: 'Lesson 6', topic: 'CSR and Sustainable Development Goals', part: 'PART I – CORPORATE SOCIAL RESPONSIBILITY' },
          { ch: 'Lesson 7', topic: 'Impact of CSR', part: 'PART I – CORPORATE SOCIAL RESPONSIBILITY' },
          // Part II
          { ch: 'Lesson 8', topic: 'Social Governance', part: 'PART II – SOCIAL GOVERNANCE' },
          { ch: 'Lesson 9', topic: 'Social Stock Exchange', part: 'PART II – SOCIAL GOVERNANCE' },
          { ch: 'Lesson 10', topic: 'Contribution of Non-Corporate Entities (NCE) in Social Governance', part: 'PART II – SOCIAL GOVERNANCE' },
          { ch: 'Lesson 11', topic: 'Societies and Trusts', part: 'PART II – SOCIAL GOVERNANCE' },
          { ch: 'Lesson 12', topic: 'Partnership Firms', part: 'PART II – SOCIAL GOVERNANCE' },
          { ch: 'Lesson 13', topic: 'Model Code for Meetings of Non-Corporate Entities', part: 'PART II – SOCIAL GOVERNANCE' },
          { ch: 'Lesson 14', topic: 'Financial and Non-financial Reporting of Different non-corporate Entities', part: 'PART II – SOCIAL GOVERNANCE' },
          { ch: 'Lesson 15', topic: 'Foreign Funding to Non-Corporate Entities', part: 'PART II – SOCIAL GOVERNANCE' },
          { ch: 'Lesson 16', topic: 'Local Self Governance', part: 'PART II – SOCIAL GOVERNANCE' },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // 5. CS PROFESSIONAL - GROUP 2
  // -------------------------------------------------------------
  'prof-g2': {
    id: 'prof-g2',
    program: 'CS Professional',
    groupName: 'Group 2',
    title: 'CS Professional — Group 2',
    papers: [
      {
        code: 'Paper 5',
        shortName: 'SMCF',
        name: 'Strategic Management & Corporate Finance',
        parts: ['PART I: STRATEGIC MANAGEMENT', 'PART II: CORPORATE FINANCE'],
        chapters: [
          // Part I
          { ch: 'Lesson 1', topic: 'Introduction to Strategic Management', part: 'PART I: STRATEGIC MANAGEMENT' },
          { ch: 'Lesson 2', topic: 'Analyzing the External and Internal Environment', part: 'PART I: STRATEGIC MANAGEMENT' },
          { ch: 'Lesson 3', topic: 'Business Policy and Formulation of Functional Strategy', part: 'PART I: STRATEGIC MANAGEMENT' },
          { ch: 'Lesson 4', topic: 'Strategic Analysis and Planning', part: 'PART I: STRATEGIC MANAGEMENT' },
          { ch: 'Lesson 5', topic: 'Competitive Positioning', part: 'PART I: STRATEGIC MANAGEMENT' },
          { ch: 'Lesson 6', topic: 'Managing the Multi-Business Firm and Analyzing Strategic Edge', part: 'PART I: STRATEGIC MANAGEMENT' },
          // Part II
          { ch: 'Lesson 7', topic: 'Sources of Corporate Funding', part: 'PART II: CORPORATE FINANCE' },
          { ch: 'Lesson 8', topic: 'Raising of Funds from Equity and Procedural Aspects – Public Funding', part: 'PART II: CORPORATE FINANCE' },
          { ch: 'Lesson 9', topic: 'Real Estate Investment Trusts', part: 'PART II: CORPORATE FINANCE' },
          { ch: 'Lesson 10', topic: 'Infrastructure Investment Trusts', part: 'PART II: CORPORATE FINANCE' },
          { ch: 'Lesson 11', topic: 'Raising of Funds – Private Funding', part: 'PART II: CORPORATE FINANCE' },
          { ch: 'Lesson 12', topic: 'Raising of Funds – Non Fund Based', part: 'PART II: CORPORATE FINANCE' },
          { ch: 'Lesson 13', topic: 'An Overview on Listing and Issuance of Securities in International Financial Services Centre', part: 'PART II: CORPORATE FINANCE' },
          { ch: 'Lesson 14', topic: 'Raising of Funds from Debt and Procedural Aspects', part: 'PART II: CORPORATE FINANCE' },
          { ch: 'Lesson 15', topic: 'Foreign Funding-Institutions', part: 'PART II: CORPORATE FINANCE' },
          { ch: 'Lesson 16', topic: 'Foreign Funding-Instruments, Laws and Procedures', part: 'PART II: CORPORATE FINANCE' },
          { ch: 'Lesson 17', topic: 'Role of Intermediaries in Fund Raising', part: 'PART II: CORPORATE FINANCE' },
          { ch: 'Lesson 18', topic: 'Project Evaluation', part: 'PART II: CORPORATE FINANCE' },
        ],
      },
      {
        code: 'Paper 6',
        shortName: 'CRVI',
        name: 'Corporate Restructuring, Valuation & Insolvency',
        parts: ['PART I : CORPORATE RESTRUCTURING', 'PART II : VALUATION', 'PART III : INSOLVENCY, LIQUIDATION & WINDING UP'],
        chapters: [
          // Part I
          { ch: 'Lesson 1', topic: 'Types of Corporate Restructuring', part: 'PART I : CORPORATE RESTRUCTURING' },
          { ch: 'Lesson 2', topic: 'Acquisition of Company/Business', part: 'PART I : CORPORATE RESTRUCTURING' },
          { ch: 'Lesson 3', topic: 'Planning & Strategy', part: 'PART I : CORPORATE RESTRUCTURING' },
          { ch: 'Lesson 4', topic: 'Process of M&A transactions', part: 'PART I : CORPORATE RESTRUCTURING' },
          { ch: 'Lesson 5', topic: 'Documentation-Merger & Amalgamation', part: 'PART I : CORPORATE RESTRUCTURING' },
          { ch: 'Lesson 6', topic: 'Accounting in Corporate Restructuring: Concept and Accounting Treatment', part: 'PART I : CORPORATE RESTRUCTURING' },
          { ch: 'Lesson 7', topic: 'Taxation & Stamp Duty aspects of Corporate Restructuring', part: 'PART I : CORPORATE RESTRUCTURING' },
          { ch: 'Lesson 8', topic: 'Regulation of Combinations', part: 'PART I : CORPORATE RESTRUCTURING' },
          { ch: 'Lesson 9', topic: 'Regulatory Approvals of Scheme', part: 'PART I : CORPORATE RESTRUCTURING' },
          { ch: 'Lesson 10', topic: 'Fast Track Mergers', part: 'PART I : CORPORATE RESTRUCTURING' },
          { ch: 'Lesson 11', topic: 'Cross Border Mergers', part: 'PART I : CORPORATE RESTRUCTURING' },
          // Part II
          { ch: 'Lesson 12', topic: 'Overview of Business Valuation', part: 'PART II : VALUATION' },
          { ch: 'Lesson 13', topic: 'Valuation of Business and Assets for Corporate Restructuring', part: 'PART II : VALUATION' },
          // Part III
          { ch: 'Lesson 14', topic: 'Insolvency', part: 'PART III : INSOLVENCY, LIQUIDATION & WINDING UP' },
          { ch: 'Lesson 15', topic: 'Application for Corporate Insolvency Resolution Process', part: 'PART III : INSOLVENCY, LIQUIDATION & WINDING UP' },
          { ch: 'Lesson 16', topic: 'Role, Functions and Duties of IP/IRP/RP', part: 'PART III : INSOLVENCY, LIQUIDATION & WINDING UP' },
          { ch: 'Lesson 17', topic: 'Resolution Strategies', part: 'PART III : INSOLVENCY, LIQUIDATION & WINDING UP' },
          { ch: 'Lesson 18', topic: 'Convening and Conduct of Meetings of Committee of Creditors', part: 'PART III : INSOLVENCY, LIQUIDATION & WINDING UP' },
          { ch: 'Lesson 19', topic: 'Preparation & Approval of Resolution Plan', part: 'PART III : INSOLVENCY, LIQUIDATION & WINDING UP' },
          { ch: 'Lesson 20', topic: 'Pre-Packaged Insolvency Resolution Process', part: 'PART III : INSOLVENCY, LIQUIDATION & WINDING UP' },
          { ch: 'Lesson 21', topic: 'Cross Border Insolvency', part: 'PART III : INSOLVENCY, LIQUIDATION & WINDING UP' },
          { ch: 'Lesson 22', topic: 'Liquidation on or after failing of Resolution Plan', part: 'PART III : INSOLVENCY, LIQUIDATION & WINDING UP' },
          { ch: 'Lesson 23', topic: 'Voluntary Liquidation', part: 'PART III : INSOLVENCY, LIQUIDATION & WINDING UP' },
          { ch: 'Lesson 24', topic: 'Debt Recovery & SARFAESI', part: 'PART III : INSOLVENCY, LIQUIDATION & WINDING UP' },
          { ch: 'Lesson 25', topic: 'Winding-up by Tribunal under the Companies Act, 2013', part: 'PART III : INSOLVENCY, LIQUIDATION & WINDING UP' },
          { ch: 'Lesson 26', topic: 'Strike Off and Restoration of Name of the Company and LLP', part: 'PART III : INSOLVENCY, LIQUIDATION & WINDING UP' },
        ],
      },
      {
        code: 'Elective Paper 7.5',
        shortName: 'IBC',
        name: 'Insolvency and Bankruptcy – Law & Practice',
        chapters: [
          { ch: 'Lesson 1', topic: 'Introduction to Insolvency and Bankruptcy Code' },
          { ch: 'Lesson 2', topic: 'Corporate Insolvency Resolution Process' },
          { ch: 'Lesson 3', topic: 'Resolution Strategies' },
          { ch: 'Lesson 4', topic: 'Liquidation of Corporate Person' },
          { ch: 'Lesson 5', topic: 'Voluntary Liquidation of Companies' },
          { ch: 'Lesson 6', topic: 'Adjudication and Appeals for Corporate Persons' },
          { ch: 'Lesson 7', topic: 'Pre-Packaged Insolvency Resolution Process' },
          { ch: 'Lesson 8', topic: 'Debt Recovery & Securitization' },
          { ch: 'Lesson 9', topic: 'Winding-Up by Tribunal' },
          { ch: 'Lesson 10', topic: 'Insolvency Resolution of Individual and Partnership Firms' },
          { ch: 'Lesson 11', topic: 'Bankruptcy Order for Individuals and Partnership Firms' },
          { ch: 'Lesson 12', topic: 'Bankruptcy for Individuals and Partnership Firms' },
          { ch: 'Lesson 13', topic: 'Fresh Start Process' },
          { ch: 'Lesson 14', topic: 'Professional and Ethical Practices for Insolvency Practitioners' },
          { ch: 'Lesson 15', topic: 'Group Insolvency' },
          { ch: 'Lesson 16', topic: 'Cross Border Insolvency' },
        ],
      },
    ],
  },
};
