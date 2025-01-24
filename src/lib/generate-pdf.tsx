'use client'

import { pdf, Document, Page } from '@alexandernanberg/react-pdf-renderer'
import type { ResumeData } from '@/types/resume'
import PDFResume from '@/components/pdf-resume'

export async function generatePDF(data: ResumeData): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const PDFDocument = (
        <Document>
          <PDFResume data={data} />
        </Document>
      );
      
      setTimeout(async () => {
        try {
          const blob = await pdf(PDFDocument).toBlob();
          resolve(blob);
        } catch (error) {
          reject(error);
        }
      }, 0);
    } catch (error) {
      reject(error);
    }
  });
} 