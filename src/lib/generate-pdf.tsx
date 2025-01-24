'use client'

import { pdf } from '@alexandernanberg/react-pdf-renderer'
import type { ResumeData } from '@/types/resume'
import { PDFResume } from '@/components/pdf-resume'

export async function generatePDF(data: ResumeData) {
  try {
    const blob = await pdf(
      <PDFResume data={data} />
    ).toBlob();
    return blob;
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw error;
  }
} 