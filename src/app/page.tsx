'use client'

import { useState, useCallback, useEffect } from 'react'
import { Share2, Eye } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { SectionManager } from '@/components/section-manager'
import { PdfExportButton } from '@/components/pdf-export-button'
import ResumeTemplate from "@/components/resume-template"
import { ResumeData, Section, SectionType } from '../types/resume'
import { serif } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import React from 'react'
import dynamic from 'next/dynamic'
import LoadingSkeleton from '@/components/loading-skeleton'

const initialData: ResumeData = {
  personalInfo: {
    name: "Your Name",
    email: "youremail@gmail.com",
    phone: "123-456-7890",
    linkedin: "linkedin.com/in/username",
    github: "github.com/username"
  },
  sections: [
    {
      id: "education",
      type: "education",
      title: "EDUCATION",
      items: [
        {
          id: crypto.randomUUID(),
          title: "Bachelor of Science",
          degree: "Bachelor of Science",
          institution: "University Name",
          dateRange: "2018-2022",
          location: "City, Country",
          accomplishments: ["GPA: 3.8", "Relevant coursework..."]
        }
      ]
    },
    {
      id: "experience",
      type: "experience",
      title: "EXPERIENCE",
      items: [
        {
          id: crypto.randomUUID(),
          title: "Software Engineer",
          position: "Software Engineer",
          company: "Tech Corp",
          dateRange: "2020-Present",
          location: "Remote",
          accomplishments: [
            "Developed key features for main product",
            "Led team of 5 developers"
          ]
        }
      ]
    },
    {
      id: "projects",
      type: "projects",
      title: "PROJECTS",
      items: [{
        id: crypto.randomUUID(),
        title: "Project Title",
        skills: "Skills used",
        dateRange: "Select a date range",
        location: "",
        accomplishments: [
          "Write an accomplishment",
          "Write an accomplishment",
          "Write an accomplishment"
        ]
      }]
    },
    {
      id: "additional",
      type: "custom",
      title: "ADDITIONAL",
      items: [{
        id: crypto.randomUUID(),
        title: "Category",
        dateRange: "",
        location: "",
        accomplishments: ["Key skills"]
      }]
    }
  ]
}

const MemoizedResumeTemplate = React.memo(ResumeTemplate)

const PDFResume = dynamic(() => import('@/components/pdf-resume'), {
  ssr: false,
  loading: () => <LoadingSkeleton />
})

export default function Page() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData)
  const [isPrintPreview, setIsPrintPreview] = useState(false)
  const { toast } = useToast()
  const [history, setHistory] = useState<ResumeData[]>([initialData])
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleUpdate = useCallback((newData: ResumeData) => {
    setResumeData(newData)
  }, [])

  const handleAddSection = (type: SectionType, customTitle?: string) => {
    const newSection: Section = {
      id: crypto.randomUUID(),
      type,
      title: customTitle?.toUpperCase() || type.toUpperCase(),
      items: []
    }
    
    setResumeData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }))
  }

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied!",
      description: "Share this link to let others view your resume.",
    })
  }

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setResumeData(history[currentIndex - 1])
    }
  }

  const handleError = (error: Error) => {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    })
  }

  useEffect(() => {
    const saveToLocalStorage = () => {
      localStorage.setItem('resumeData', JSON.stringify(resumeData))
    }
    
    const timeoutId = setTimeout(saveToLocalStorage, 1000)
    return () => clearTimeout(timeoutId)
  }, [resumeData])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="w-full md:w-[8.5in] mx-auto p-2 print:p-0">
        <div className="bg-white shadow-xl rounded-lg mb-4 print:shadow-none print:mb-2">
          <MemoizedResumeTemplate data={resumeData} onUpdate={handleUpdate} />
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setIsPrintPreview(!isPrintPreview)}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <PdfExportButton />
        </div>
      </div>
    </div>
  )
}