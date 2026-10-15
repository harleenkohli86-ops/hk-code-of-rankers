import React from 'react';
import { PageId } from '../types';
import { StudentPortalPage as StudentPortalShell } from './student/StudentPortalShell';

export interface StudentPortalPageProps {
  onNavigate: (page: PageId) => void;
  onOpenJoinModal?: () => void;
  onOpenCounsellingModal?: () => void;
}

export const StudentPortalPage: React.FC<StudentPortalPageProps> = (props) => (
  <StudentPortalShell {...props} />
);
