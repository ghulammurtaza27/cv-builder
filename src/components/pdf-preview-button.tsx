'use client';

import { Button } from "@/components/ui/button";
import { Page, pdf, Document } from '@alexandernanberg/react-pdf-renderer';
import { useState } from 'react';
import { X } from 'lucide-react';

interface PreviewButtonProps {
  document: React.ReactElement;
}

export function PreviewButton({ document }: PreviewButtonProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePreview = async () => {
    try {
      setIsLoading(true);
      const pdfDocument = (
        <Document>
          <Page size="LETTER">
            {document}
          </Page>
        </Document>
      );

      const blob = await pdf(pdfDocument).toBlob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (error) {
      console.error('Failed to generate preview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button 
        onClick={handlePreview}
        disabled={isLoading}
      >
        {isLoading ? 'Generating Preview...' : 'Preview PDF'}
      </Button>
      
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative w-[95%] h-[95%] bg-white dark:bg-gray-800 rounded-lg shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-4 border-b">
              <h3 className="text-lg font-semibold">PDF Preview</h3>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  URL.revokeObjectURL(previewUrl);
                  setPreviewUrl(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="pt-12 h-full">
              <iframe
                src={previewUrl}
                className="w-full h-full rounded-b-lg"
                title="PDF Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 