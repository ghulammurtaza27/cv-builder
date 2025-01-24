'use client'

import dynamic from 'next/dynamic'
import { ResumeData } from '@/types/resume'

const PDFResume = dynamic(() => import('./pdf-resume'), {
  ssr: false,
  loading: () => <div>Loading PDF...</div>
})

export function PDFWrapper({ data }: { data: ResumeData }) {
  return <PDFResume data={data} />
} 