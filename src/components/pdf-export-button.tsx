'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'
import { Spinner } from "../components/ui/spinner"

export function PdfExportButton() {
  const [isExporting, setIsExporting] = useState(false)

  const exportToPdf = async () => {
    setIsExporting(true)
    const element = document.getElementById('resume-content')
    if (!element) {
      console.error('Resume content not found')
      setIsExporting(false)
      return
    }

    try {
      const opt = {
        margin: 0,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
          scale: 4,
          useCORS: true,
          logging: false,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'in',
          format: [8.5, 11],
          orientation: 'portrait',
          hotfixes: ["px_scaling"]
        }
      }

      const html2pdf = (await import('html2pdf.js')).default
      await html2pdf().from(element).set(opt).save()
    } catch (error) {
      console.error('Error exporting PDF:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button 
      disabled={isExporting}
      className="relative"
      onClick={exportToPdf}
    >
      {isExporting && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
          <Spinner className="h-4 w-4" />
        </div>
      )}
      <Download className="mr-2 h-4 w-4" />
      Export PDF
    </Button>
  )
}

