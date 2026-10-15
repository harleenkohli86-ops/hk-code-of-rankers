import React, { useState } from 'react';
import { ICSI_OFFICIAL_SYLLABUS } from '../../services/centralStudentDatabase';
import {
  BookOpen,
  Layers,
  FileText,
  CheckCircle2,
  Bookmark,
  Award,
  Download,
  Info,
} from 'lucide-react';

export const SyllabusIndexTab: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<'exec-g1' | 'exec-g2' | 'cseet' | 'prof-g1' | 'prof-g2'>('exec-g1');

  const groups = [
    {
      id: 'exec-g1' as const,
      name: 'CS Executive — Group 1',
      level: 'Level 2',
      papers: ['JIGL (Paper 1)', 'Company Law (Paper 2)', 'SBEC (Paper 3)', 'Tax Laws & Practice (Paper 4)'],
      chaptersCount: 38,
      desc: 'Jurisprudence, Interpretation & General Laws; Company Law & Practice; Setting Up of Business; Corporate Accounting.',
    },
    {
      id: 'exec-g2' as const,
      name: 'CS Executive — Group 2',
      level: 'Level 2',
      papers: ['CMSL (Paper 5)', 'ECIPL (Paper 6)', 'FSM (Paper 7)'],
      chaptersCount: 32,
      desc: 'Capital Markets & Securities Laws; Economic, Commercial & Intellectual Property Laws; Financial & Strategic Management.',
    },
    {
      id: 'cseet' as const,
      name: 'CS EET (Executive Entrance Test)',
      level: 'Level 1',
      papers: ['Business Comm (Paper 1)', 'Legal Aptitude (Paper 2)', 'Economics (Paper 3)', 'Current Affairs (Paper 4)'],
      chaptersCount: 24,
      desc: 'Foundational entry exam testing business communication, legal reasoning, economics, and business environment.',
    },
    {
      id: 'prof-g1' as const,
      name: 'CS Professional — Group 1',
      level: 'Level 3',
      papers: ['ESG Principles (Paper 1)', 'Drafting & Pleadings (Paper 2)', 'Compliance Management (Paper 3)'],
      chaptersCount: 30,
      desc: 'Environmental, Social & Governance (ESG); Drafting, Pleadings & Appearances; Compliance Management, Audit & Due Diligence.',
    },
    {
      id: 'prof-g2' as const,
      name: 'CS Professional — Group 2',
      level: 'Level 3',
      papers: ['Strategic Management (Paper 4)', 'Corporate Restructuring (Paper 5)', 'Insolvency & Bankruptcy (Paper 6)'],
      chaptersCount: 34,
      desc: 'Strategic Management & Corporate Finance; Corporate Restructuring, Valuation & Insolvency; Multidisciplinary Case Studies.',
    },
  ];

  const currentGroup = groups.find((g) => g.id === selectedGroup)!;
  const officialGroup = ICSI_OFFICIAL_SYLLABUS[selectedGroup];
  const allChapters = officialGroup?.papers.flatMap((p) =>
    p.chapters.map((ch, idx) => ({
      id: `${p.code}-${idx}`,
      chapterNo: ch.ch,
      subjectName: `${p.code}: ${p.name}`,
      shortName: p.shortName,
      topic: ch.topic,
      amendment: ch.defaultAmendment || 'Applicable for Exam',
      part: ch.part,
    }))
  ) || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#171512] to-[#0F0F0F] text-white border-2 border-[#C8A45D]/40 p-5 rounded-3xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/20 border border-[#C8A45D]/50 flex items-center justify-center text-[#FFE3A0] shrink-0">
            <BookOpen className="w-6 h-6 text-[#C8A45D]" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-montserrat font-bold text-[#FFE3A0] tracking-wider flex items-center gap-1.5">
              <span>Standard ICSI Curriculum</span>
              <span className="px-1.5 py-0.2 bg-[#C8A45D]/20 text-[#FFE3A0] border border-[#C8A45D]/40 rounded text-[9px]">
                5 Official Trackers
              </span>
            </div>
            <h2 className="font-cinzel text-base sm:text-lg font-bold text-white mt-0.5">
              5 Official ICSI Syllabus Indexes & Trackers
            </h2>
            <p className="text-xs text-gray-400">
              Complete chapter breakdown for all 3 ICSI levels. When students are enrolled in a program, their tracker is initialized with the matching official syllabus index.
            </p>
          </div>
        </div>
      </div>

      {/* Program Group Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {groups.map((g) => {
          const isSelected = selectedGroup === g.id;
          return (
            <button
              key={g.id}
              onClick={() => setSelectedGroup(g.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-[#C8A45D] bg-[#1C1917] text-[#FFE3A0] shadow-md scale-[1.02]'
                  : 'border-gray-200 bg-white hover:border-[#C8A45D]/40 text-gray-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] uppercase font-montserrat font-bold tracking-wider opacity-70">
                    {g.level}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#C8A45D]" />
                  )}
                </div>
                <h4 className="font-montserrat font-bold text-xs leading-snug">
                  {g.name}
                </h4>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-100/20 text-[11px] opacity-80 flex items-center justify-between">
                <span>{g.papers.length} Papers</span>
                <span className="font-bold">{g.chaptersCount} Chapters</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Syllabus Detail Card */}
      <div className="bg-white border border-[#C8A45D]/30 rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <span className="px-2.5 py-0.5 bg-[#FAF5E9] text-[#8A651E] font-bold text-[10px] rounded-full uppercase tracking-wider">
              {currentGroup.level} Official Index
            </span>
            <h3 className="font-cinzel text-lg font-bold text-[#1C1917] mt-1">
              {currentGroup.name}
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              {currentGroup.desc}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-montserrat font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-xl">
              Total {allChapters.length} Pre-Mapped Chapters
            </span>
          </div>
        </div>

        {/* Papers Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {currentGroup.papers.map((paper, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-2xl space-y-1"
            >
              <div className="text-[10px] uppercase font-montserrat font-bold text-[#8A651E]">
                Paper {idx + 1}
              </div>
              <div className="font-montserrat font-bold text-xs text-gray-900">
                {paper}
              </div>
              <div className="text-[10px] text-gray-500">
                Includes Amendments, Scanner & Harkiran Kaur Strategy Notes
              </div>
            </div>
          ))}
        </div>

        {/* Chapters Table */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-[#1C1917] text-white font-montserrat font-bold text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Chapter #</th>
                  <th className="py-2.5 px-4">Subject & Paper</th>
                  <th className="py-2.5 px-4">Topic / Legislation</th>
                  <th className="py-2.5 px-4">Amendment Status</th>
                  <th className="py-2.5 px-4 text-center">Revisions Tracked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {allChapters.map((ch, idx) => (
                  <tr key={ch.id || idx} className="hover:bg-gray-50/80">
                    <td className="py-2.5 px-4 font-mono font-bold text-gray-800">
                      {ch.chapterNo}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-gray-700">
                      {ch.subjectName}
                    </td>
                    <td className="py-2.5 px-4 text-gray-900">
                      {ch.topic}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-[10px] font-medium">
                        {ch.amendment || 'Applicable for Exam'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center text-[10px] text-gray-500 font-mono">
                      R1 • R2 • R3 • Red Flag
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
