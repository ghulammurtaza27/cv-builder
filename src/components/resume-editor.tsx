'use client'

import { useState } from 'react'
import { ResumeData, Section } from '@/types/resume'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ResumeEditorProps {
  section: Section
  data: ResumeData
  onUpdate: (section: Section, data: any) => void
}

export default function ResumeEditor({ section, data, onUpdate }: ResumeEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editData, setEditData] = useState(data[section])

  const handleSave = () => {
    onUpdate(section, editData)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        Edit {section}
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {section}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {section === 'personalInfo' && (
            <>
              <div>
                <Label>Name</Label>
                <Input
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                />
              </div>
              {/* Similar fields for phone, linkedin, github */}
            </>
          )}
          {/* Similar sections for education, experience, projects, additional */}
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

