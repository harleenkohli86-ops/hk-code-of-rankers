/**
 * HK StudyTrack Pro – CS Progress Index
 * Service & Configuration
 *
 * Dedicated self-study tracking product that allows students to track and edit
 * their own preparation after purchasing the applicable index.
 */

export interface StudyTrackDetails {
  productName: string;
  applicableIndex: string;
  price: number;
  originalPrice: number;
  productId: string;
  indexId: 'cseet' | 'exec-g1' | 'exec-g2' | 'exec-both' | 'prof-g1' | 'prof-g2' | 'prof-both';
  programName: 'CS EET' | 'CS Executive' | 'CS Professional';
  groupName: string;
  levelName: string;
  features: string[];
}

/**
 * Maps student's registered program and group to the exact applicable Study Progress Index
 */
export function getStudyTrackDetails(
  program?: string,
  group?: string,
  level?: string
): StudyTrackDetails {
  const normProg = (program || level || '').toLowerCase();
  const normGroup = (group || '').toLowerCase();

  // 1. CSEET
  if (
    normProg.includes('eet') ||
    normGroup.includes('eet') ||
    (level && level.toLowerCase().includes('eet'))
  ) {
    return {
      productName: 'HK StudyTrack Pro – CS Progress Index',
      applicableIndex: 'CSEET Index',
      price: 699,
      originalPrice: 1499,
      productId: 'hk-studytrack-cseet',
      indexId: 'cseet',
      programName: 'CS EET',
      groupName: 'All 4 Papers',
      levelName: 'CSEET',
      features: [
        'Official ICSI CSEET Syllabus Index (All 4 Papers)',
        '100% Student-Editable: Update lectures, readings, test status & revisions',
        'Dynamic Syllabus Completion % and revision milestone metrics',
        'Red Doubt marker (🚩) for self-audit & doubt prioritization',
        'Dedicated self-tracking tool (Self-paced study, no mentor calls)',
      ],
    };
  }

  // 2. CS Executive
  if (normProg.includes('executive') || (level && level.toLowerCase().includes('executive'))) {
    if (normGroup.includes('both') || normGroup.includes('combined')) {
      return {
        productName: 'HK StudyTrack Pro – CS Progress Index',
        applicableIndex: 'Executive Combined Index',
        price: 1499,
        originalPrice: 2999,
        productId: 'hk-studytrack-exec-both',
        indexId: 'exec-both',
        programName: 'CS Executive',
        groupName: 'Both Groups',
        levelName: 'CS Executive',
        features: [
          'Official ICSI CS Executive Syllabus Index (Both Group 1 & Group 2)',
          '100% Student-Editable: Update lectures, readings, test status & revisions',
          'Dynamic Syllabus Completion % across all 7 Executive papers',
          'Red Doubt marker (🚩) for self-audit & doubt prioritization',
          'Dedicated self-tracking tool (Self-paced study, no mentor calls)',
        ],
      };
    }

    if (normGroup.includes('2') || normGroup.includes('group 2') || normGroup.includes('g2')) {
      return {
        productName: 'HK StudyTrack Pro – CS Progress Index',
        applicableIndex: 'Executive Group 2 Index',
        price: 799,
        originalPrice: 1799,
        productId: 'hk-studytrack-exec-g2',
        indexId: 'exec-g2',
        programName: 'CS Executive',
        groupName: 'Group 2',
        levelName: 'CS Executive',
        features: [
          'Official ICSI CS Executive Group 2 Syllabus Index',
          '100% Student-Editable: Update lectures, readings, test status & revisions',
          'Dynamic Syllabus Completion % and revision milestone metrics',
          'Red Doubt marker (🚩) for self-audit & doubt prioritization',
          'Dedicated self-tracking tool (Self-paced study, no mentor calls)',
        ],
      };
    }

    // Default to Group 1
    return {
      productName: 'HK StudyTrack Pro – CS Progress Index',
      applicableIndex: 'Executive Group 1 Index',
      price: 899,
      originalPrice: 1999,
      productId: 'hk-studytrack-exec-g1',
      indexId: 'exec-g1',
      programName: 'CS Executive',
      groupName: 'Group 1',
      levelName: 'CS Executive',
      features: [
        'Official ICSI CS Executive Group 1 Syllabus Index',
        '100% Student-Editable: Update lectures, readings, test status & revisions',
        'Dynamic Syllabus Completion % and revision milestone metrics',
        'Red Doubt marker (🚩) for self-audit & doubt prioritization',
        'Dedicated self-tracking tool (Self-paced study, no mentor calls)',
      ],
    };
  }

  // 3. CS Professional
  if (normProg.includes('prof') || (level && level.toLowerCase().includes('prof'))) {
    if (normGroup.includes('both') || normGroup.includes('combined')) {
      return {
        productName: 'HK StudyTrack Pro – CS Progress Index',
        applicableIndex: 'Professional Combined Index',
        price: 1699,
        originalPrice: 3499,
        productId: 'hk-studytrack-prof-both',
        indexId: 'prof-both',
        programName: 'CS Professional',
        groupName: 'Both Groups',
        levelName: 'CS Professional',
        features: [
          'Official ICSI CS Professional Syllabus Index (Both Group 1 & Group 2)',
          '100% Student-Editable: Update lectures, readings, test status & revisions',
          'Dynamic Syllabus Completion % across all Professional papers',
          'Red Doubt marker (🚩) for self-audit & doubt prioritization',
          'Dedicated self-tracking tool (Self-paced study, no mentor calls)',
        ],
      };
    }

    if (normGroup.includes('2') || normGroup.includes('group 2') || normGroup.includes('g2')) {
      return {
        productName: 'HK StudyTrack Pro – CS Progress Index',
        applicableIndex: 'Professional Group 2 Index',
        price: 899,
        originalPrice: 1999,
        productId: 'hk-studytrack-prof-g2',
        indexId: 'prof-g2',
        programName: 'CS Professional',
        groupName: 'Group 2',
        levelName: 'CS Professional',
        features: [
          'Official ICSI CS Professional Group 2 Syllabus Index',
          '100% Student-Editable: Update lectures, readings, test status & revisions',
          'Dynamic Syllabus Completion % and revision milestone metrics',
          'Red Doubt marker (🚩) for self-audit & doubt prioritization',
          'Dedicated self-tracking tool (Self-paced study, no mentor calls)',
        ],
      };
    }

    // Default to Group 1
    return {
      productName: 'HK StudyTrack Pro – CS Progress Index',
      applicableIndex: 'Professional Group 1 Index',
      price: 999,
      originalPrice: 2299,
      productId: 'hk-studytrack-prof-g1',
      indexId: 'prof-g1',
      programName: 'CS Professional',
      groupName: 'Group 1',
      levelName: 'CS Professional',
      features: [
        'Official ICSI CS Professional Group 1 Syllabus Index',
        '100% Student-Editable: Update lectures, readings, test status & revisions',
        'Dynamic Syllabus Completion % and revision milestone metrics',
        'Red Doubt marker (🚩) for self-audit & doubt prioritization',
        'Dedicated self-tracking tool (Self-paced study, no mentor calls)',
      ],
    };
  }

  // Fallback default: Executive Group 1
  return {
    productName: 'HK StudyTrack Pro – CS Progress Index',
    applicableIndex: 'Executive Group 1 Index',
    price: 899,
    originalPrice: 1999,
    productId: 'hk-studytrack-exec-g1',
    indexId: 'exec-g1',
    programName: 'CS Executive',
    groupName: 'Group 1',
    levelName: 'CS Executive',
    features: [
      'Official ICSI CS Executive Group 1 Syllabus Index',
      '100% Student-Editable: Update lectures, readings, test status & revisions',
      'Dynamic Syllabus Completion % and revision milestone metrics',
      'Red Doubt marker (🚩) for self-audit & doubt prioritization',
      'Dedicated self-tracking tool (Self-paced study, no mentor calls)',
    ],
  };
}

/**
 * Converts StudyTrackDetails to standard Product definition for cart & checkout
 */
export function createStudyTrackProduct(details: StudyTrackDetails) {
  return {
    id: details.productId,
    name: `${details.productName} (${details.applicableIndex})`,
    category: 'Mentorship',
    price: details.price,
    originalPrice: details.originalPrice,
    badge: `₹${details.price.toLocaleString('en-IN')} Only • Student-Editable`,
    type: 'mentorship',
    level: details.programName === 'CS EET' ? 'cseet' : details.programName === 'CS Executive' ? 'executive' : 'professional',
    description: `Independent ICSI syllabus and revision progress tracker for ${details.programName} (${details.applicableIndex}). 100% Student-Editable in your personal Student Portal.`,
    features: details.features,
    modules: [],
  };
}
