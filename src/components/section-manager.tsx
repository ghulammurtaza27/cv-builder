'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SectionType } from '@/types/resume'
import { Tooltip } from "@/components/ui/tooltip"

interface SectionManagerProps {
  onAddSection: (type: SectionType, title?: string) => void
}

export function SectionManager({ onAddSection }: SectionManagerProps) {
  const [customTitle, setCustomTitle] = useState('')
  const [selectedType, setSelectedType] = useState<SectionType>('custom')

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Section</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Section Type</Label>
            <Select
              value={selectedType}
              onValueChange={(value) => setSelectedType(value as SectionType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="experience">Experience</SelectItem>
                <SelectItem value="projects">Projects</SelectItem>
                <SelectItem value="additional">Additional</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {selectedType === 'custom' && (
            <div className="space-y-2">
              <Label>Section Title</Label>
              <Input
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Enter section title"
              />
            </div>
          )}
          <Button
            onClick={() => {
              onAddSection(selectedType, customTitle)
              setCustomTitle('')
            }}
          >
            Add Section
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

