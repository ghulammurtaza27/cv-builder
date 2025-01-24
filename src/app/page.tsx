'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import ResumeTemplate from '@/components/resume-template'
import { PreviewButton } from "@/components/pdf-preview-button"
import { PDFResume } from "@/components/pdf-resume"
import { ResumeData } from '../types/resume'
import React from 'react'

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
          startDate: "2020-01-01",
          endDate: "2021-12-31",
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
          startDate: "2020-01-01",
          endDate: "2021-12-31",
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
        startDate: "2020-01-01",
        endDate: "2021-12-31",
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
        startDate: "2020-01-01",
        endDate: "2021-12-31",
        location: "",
        accomplishments: ["Key skills"]
      }]
    }
  ]
}

const MemoizedResumeTemplate = React.memo(ResumeTemplate)

export default function Page() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData)
  const [history, setHistory] = useState<ResumeData[]>([initialData])
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleUpdate = useCallback((newData: ResumeData) => {
    setResumeData(newData)
    setHistory(prev => [...prev.slice(0, currentIndex + 1), newData])
    setCurrentIndex(prev => prev + 1)
  }, [currentIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        
        if (e.shiftKey) {
          // Redo
          if (currentIndex < history.length - 1) {
            const newIndex = currentIndex + 1
            setCurrentIndex(newIndex)
            setResumeData(history[newIndex])
          }
        } else {
          // Undo
          if (currentIndex > 0) {
            const newIndex = currentIndex - 1
            setCurrentIndex(newIndex)
            setResumeData(history[newIndex])
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, history])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="w-full md:w-[8.5in] mx-auto p-2 print:p-0">
        <div className="bg-white shadow-xl rounded-lg mb-4 print:shadow-none print:mb-2">
          <MemoizedResumeTemplate data={resumeData} onUpdate={handleUpdate} />
        </div>
        <div className="flex gap-2">
          <PreviewButton document={<PDFResume data={resumeData} />} />
        </div>
      </div>
    </div>
  )
}