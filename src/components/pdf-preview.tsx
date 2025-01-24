'use client';

import { PDFViewer } from '@alexandernanberg/react-pdf-renderer';
import PDFResume from './pdf-resume';
import type { ResumeData } from '@/types/resume';

export default function PDFPreview({ data }: { data?: ResumeData }) {
  // Add loading state and null checks
  if (!data || !data.sections) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <p className="text-gray-500">Loading preview...</p>
      </div>
    );
  }

  return (
    <PDFViewer className="w-full h-[80vh]">
      <PDFResume data={data} />
    </PDFViewer>
  );
} 