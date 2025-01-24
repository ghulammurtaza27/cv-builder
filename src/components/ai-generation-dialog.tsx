'use client'

import { useState } from 'react'
import { Sparkles, X, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface AIGenerationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGenerate: (text: string) => void
  fieldType: string
}

export function AIGenerationDialog({ open, onOpenChange, onGenerate, fieldType }: AIGenerationDialogProps) {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const getPromptPrefix = () => {
    switch (fieldType) {
      case 'accomplishment':
        return 'Write a professional accomplishment bullet point about:'
      case 'position':
        return 'Generate a job title for someone who:'
      case 'company':
        return 'Suggest a company name related to:'
      case 'degree':
        return 'Propose an academic degree for:'
      case 'institution':
        return 'Suggest an educational institution for:'
      case 'project':
        return 'Create a project title for:'
      case 'skills':
        return 'Generate relevant technical skills for:'
      case 'summary':
        return 'Write a professional summary about:'
      default:
        return 'Generate professional content about:'
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt,
          fieldType,
          promptPrefix: getPromptPrefix()
        }),
      })
      
      const data = await response.json()
      onGenerate(data.text)
      onOpenChange(false)
      setPrompt('')
    } catch (error) {
      console.error('Error generating text:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
          <Sparkles className="h-5 w-5 text-purple-500" />
          Generate with AI
        </DialogTitle>
        <div className="relative mt-4">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to generate..."
            className="pr-12 border-purple-200 focus:border-purple-500"
          />
          <Button
            size="icon"
            className="absolute right-1 top-1 h-7 w-7 rounded-full bg-purple-500 hover:bg-purple-600 transition-colors"
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

