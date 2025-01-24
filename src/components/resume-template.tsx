'use client'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import AIEditableText from '@/components/ai-editable-text'
import { DraggableSection } from '@/components/draggable-section'
import { Button } from '@/components/ui/button'
import { Plus, X, Trash, Sparkles, PlusCircle, BookOpen, Briefcase, FolderPlus, Download, Loader2, Mail, Eye, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { AIGenerationDialog } from '@/components/ai-generation-dialog'
import { Providers } from '@/components/providers'
import { toast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import PDFPreview from './pdf-preview'
import type { ResumeData, EducationItem, ExperienceItem, ProjectItem } from '@/types/resume'; // Use src-relative path
import { DialogTitle } from '@radix-ui/react-dialog'
import { pdf } from '@alexandernanberg/react-pdf-renderer'
import ReactDOM, { createRoot } from 'react-dom/client'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { PDFWrapper } from './pdf-wrapper'
import { generatePDF } from '@/lib/generate-pdf'

interface ResumeTemplateProps {
  data: ResumeData
  onUpdate: (data: ResumeData) => void
}



export default function ResumeTemplate({ data, onUpdate }: ResumeTemplateProps) {
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState<{
    sectionIndex: number;
    itemIndex: number;
    accIndex?: number;
    fieldType?: string;
  }>()
  const [isExporting, setIsExporting] = useState(false)
  const [initialData, setInitialData] = useState<ResumeData>(data)
  const [localData, setLocalData] = useState<ResumeData>(initialData);

  const moveSection = (dragIndex: number, hoverIndex: number) => {
    const newSections = [...localData.sections]
    const dragSection = newSections[dragIndex]
    newSections.splice(dragIndex, 1)
    newSections.splice(hoverIndex, 0, dragSection)
    onUpdate({
      ...localData,
      sections: newSections
    })
  }

  

  const removeSection = (index: number) => {
    const newSections = [...localData.sections]
    newSections.splice(index, 1)
    onUpdate({
      ...localData,
      sections: newSections
    })
  }

    // When creating a new additional section item
  const newItem: EducationItem = {
    id: crypto.randomUUID(),
    title: '',
    degree: '',
    institution: '',
    dateRange: '',
    location: '',
    accomplishments: ['']
  };

  const addAccomplishment = (sectionIndex: number, itemIndex: number) => {
    const newSections = [...localData.sections]
    const item = newSections[sectionIndex].items[itemIndex]
    
    // Add type guard
    if ('accomplishments' in item) {
      item.accomplishments.push('')
    }
    
    onUpdate({ ...localData, sections: newSections })
  }

  const handleAIGenerate = (text: string) => {
    if (!currentSection) return
    
    const { sectionIndex, itemIndex, accIndex } = currentSection
    const newSections = [...localData.sections]
    const section = newSections[sectionIndex]
    
    if (accIndex !== undefined && 'accomplishments' in section.items[itemIndex]) {
      section.items[itemIndex].accomplishments[accIndex] = text
    }
    
    onUpdate({
      ...localData,
      sections: newSections
    })
  }

  const updateField = (sectionIndex: number, itemIndex: number, field: string, value: string) => {
    const newSections = [...localData.sections];
    // @ts-ignore - dynamic field access
    newSections[sectionIndex].items[itemIndex][field] = value;
    onUpdate({ ...localData, sections: newSections });
  }

  const updateAccomplishment = (sectionIndex: number, itemIndex: number, accIndex: number, value: string) => {
    const newSections = [...localData.sections];
    const item = newSections[sectionIndex].items[itemIndex];
    
    if ('accomplishments' in item) {
      item.accomplishments[accIndex] = value;
    }
    
    onUpdate({ ...localData, sections: newSections });
  }

  const removeAccomplishment = (sectionIndex: number, itemIndex: number, accIndex: number) => {
    const newSections = [...localData.sections]
    const item = newSections[sectionIndex].items[itemIndex]
    
    if ('accomplishments' in item) {
      item.accomplishments.splice(accIndex, 1)
    }
    
    onUpdate({ ...localData, sections: newSections })
  }

  const triggerAIGeneration = (sectionIndex: number, itemIndex: number, accIndex: number, fieldType: string) => {
    setCurrentSection({ sectionIndex, itemIndex, accIndex, fieldType })
    setIsAIDialogOpen(true)
  }

  const exportHideClass = isExporting ? 'print:hidden' : ''

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      
      const blob = await generatePDF(createSafeData(localData));
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${localData.personalInfo.name.replace(/\s+/g, '_')}_resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('PDF export failed:', error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Could not generate PDF. Please try again.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Add this class to all interactive elements
  const interactiveClass = "print-hidden"

  const addEducationItem = () => {
    
    setLocalData(prevData => {
      const newSections = prevData.sections.map(section => {
        if (section.type === 'education') {
          return {
            ...section,
            items: [
              ...section.items,
              {
                id: crypto.randomUUID(),
                title: 'New Education',
                degree: 'Degree Name',
                institution: 'Institution Name',
                dateRange: 'Date Range',
                location: 'Location',
                accomplishments: ['']
              }
            ]
          };
        }
        return section;
      });
      
      return { ...prevData, sections: newSections };
    });
  };

  const addExperienceItem = () => {
    setLocalData(prevData => {
      const newSections = prevData.sections.map(section => {
        if (section.type === 'experience') {
          return {
            ...section,
            items: [
              ...section.items,
              {
                id: crypto.randomUUID(),
                title: 'New Experience',
                position: 'Position Title',
                company: 'Company Name',
                dateRange: 'Date Range',
                location: 'Location',
                accomplishments: ['']
              }
            ]
          };
        }
        return section;
      });
      
      return { ...prevData, sections: newSections };
    });
  };

  const removeEducationItem = (sectionIndex: number, itemId: string) => {
    setLocalData(prevData => {
      const newSections = [...prevData.sections];
      newSections[sectionIndex].items = newSections[sectionIndex].items.filter(
        item => item.id !== itemId
      );
      return { ...prevData, sections: newSections };
    });
  };

  const removeExperienceItem = (sectionIndex: number, itemId: string) => {
    setLocalData(prevData => {
      const newSections = [...prevData.sections];
      newSections[sectionIndex].items = newSections[sectionIndex].items.filter(
        item => item.id !== itemId
      );
      return { ...prevData, sections: newSections };
    });
  };

  const addProjectItem = () => {
    setLocalData(prevData => {
      const newSections = prevData.sections.map(section => {
        if (section.type === 'projects') {
          return {
            ...section,
            items: [
              ...section.items,
              {
                id: crypto.randomUUID(),
                title: 'Project Title',
                skills: 'Skills Used',
                dateRange: 'Date Range',
                location: '',
                accomplishments: ['']
              }
            ]
          };
        }
        return section;
      });
      
      return { ...prevData, sections: newSections };
    });
  };

  const removeProjectItem = (sectionIndex: number, itemId: string) => {
    setLocalData(prevData => {
      const newSections = [...prevData.sections];
      newSections[sectionIndex].items = newSections[sectionIndex].items.filter(
        item => item.id !== itemId
      );
      return { ...prevData, sections: newSections };
    });
  };

  const handleContactInfoChange = (index: number, value: string) => {
    const fields = ['email', 'phone', 'linkedin', 'github'];
    const field = fields[index];
    onUpdate({
      ...localData,
      personalInfo: {...localData.personalInfo, [field]: value}
    });
  };

  const handleSave = () => {
    if (!localData.personalInfo.name) {
      toast({
        variant: "destructive",
        title: "Name is required",
      });
      return;
    }
  };

  return (
    <Providers>
      <div className="relative w-[8.5in] mx-auto">
        <div 
          id="resume-content" 
          className="bg-white"
          style={{ 
            width: '8.5in',
            minHeight: '11in',
            padding: '0.4in',
            fontSize: '10.5pt',
            lineHeight: '1.15',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            boxSizing: 'border-box'
          }}
        >
          <DndProvider backend={HTML5Backend}>
            {/* Header */}
            <div className="mb-2">
              <div className="text-center whitespace-nowrap space-x-2 text-sm">
                <AIEditableText
                  value={localData.personalInfo.name}
                  onChange={(value) => onUpdate({...localData, personalInfo: {...localData.personalInfo, name: value}})}
                  className="text-[19pt] font-normal mb-[0.05in]"
                  placeholder="Your Name"
                />
                <div className="flex justify-center gap-2">
                  {[
                    localData.personalInfo.email,
                    localData.personalInfo.phone,
                    localData.personalInfo.linkedin,
                    localData.personalInfo.github
                  ].filter(Boolean).map((info, index) => (
                    <span key={index} className="flex items-center gap-1">
                      <AIEditableText
                        value={info}
                        onChange={(value) => handleContactInfoChange(index, value)}
                        className="text-xs"
                      />
                      {index < 3 && <span className="text-gray-400">|</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-4">
              {localData.sections.map((section, sectionIndex) => (
                <DraggableSection key={section.id} id={section.id} index={sectionIndex} moveSection={moveSection}>
                  <section className="group/section mb-3 border-b pb-1 print:border-b-0">
                    <div className="flex items-center justify-between">
                      <h2 className="uppercase font-bold text-[10pt] tracking-wide border-b-2 border-blue-500 inline-block">
                        {section.title}
                      </h2>
                      <div className="flex items-center gap-2">
                        {section.type === 'education' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 opacity-0 group-hover/section:opacity-100"
                            onClick={addEducationItem}
                            
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Education
                          </Button>
                        )}
                        {section.type === 'experience' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 opacity-0 group-hover/section:opacity-100"
                            onClick={addExperienceItem}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Experience
                          </Button>
                        )}
                        {section.type === 'projects' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 opacity-0 group-hover/section:opacity-100"
                            onClick={addProjectItem}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Project
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Section Items */}
                    <div className="space-y-0.5">
                      {section.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="mb-3 group/item">
                          {/* Add this inside each item's header area */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 opacity-0 group-hover/item:opacity-100"
                            onClick={() => {
                              if (section.type === 'education') removeEducationItem(sectionIndex, item.id);
                              if (section.type === 'experience') removeExperienceItem(sectionIndex, item.id);
                              if (section.type === 'projects') removeProjectItem(sectionIndex, item.id);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>

                          {section.type === 'experience' && (
                            <div className="space-y-0.5">
                              {/* Company and Location */}
                              <div className="flex justify-between items-baseline text-xs">
                                <AIEditableText
                                  value={section.type === 'experience' ? (item as ExperienceItem).company : ''}
                                  onChange={(value) => {
                                    if (section.type === 'experience') {
                                      updateField(sectionIndex, itemIndex, 'company', value);
                                    }
                                  }}
                                  className="font-medium"
                                  placeholder="Company Name"
                                />
                                <AIEditableText
                                  value={item.location}
                                  onChange={(value) => updateField(sectionIndex, itemIndex, 'location', value)}
                                  className="text-gray-600"
                                  placeholder="Location"
                                />
                              </div>
                              
                              {/* Position and Dates */}
                              <div className="flex justify-between items-baseline text-xs">
                                <AIEditableText
                                  value={section.type === 'experience' ? (item as ExperienceItem).position : ''}
                                  onChange={(value) => {
                                    if (section.type === 'experience') {
                                      updateField(sectionIndex, itemIndex, 'position', value);
                                    }
                                  }}
                                  className="font-semibold"
                                  placeholder="Position Title"
                                />
                                <AIEditableText
                                  value={item.dateRange}
                                  onChange={(value) => updateField(sectionIndex, itemIndex, 'dateRange', value)}
                                  className="text-gray-600"
                                  placeholder="Dates"
                                />
                              </div>
                              
                              {/* Accomplishments */}
                              <ul className="list-disc ml-4 mt-0.5 space-y-0.5">
                                {(item as ExperienceItem).accomplishments.map((acc, accIndex) => (
                                  <li key={accIndex} className="text-gray-600 text-sm">
                                    <div className="flex items-center gap-1">
                                      <AIEditableText
                                        value={acc}
                                        onChange={(value) => updateAccomplishment(sectionIndex, itemIndex, accIndex, value)}
                                        placeholder="Accomplishment (e.g., Led team of 5 developers)"
                                      />
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        className="h-5 w-5 opacity-0 group-hover/item:opacity-100"
                                        onClick={() => removeAccomplishment(sectionIndex, itemIndex, accIndex)}
                                      >
                                        <X className="h-3.5 w-3.5" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5 opacity-0 group-hover/item:opacity-100"
                                        onClick={() => triggerAIGeneration(sectionIndex, itemIndex, accIndex, 'accomplishment')}
                                      >
                                        <Sparkles className="h-3.5 w-3.5" />
                                      </Button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-1 text-sm opacity-0 group-hover/item:opacity-100"
                                onClick={() => addAccomplishment(sectionIndex, itemIndex)}
                              >
                                <Plus className="mr-1 h-4 w-4" /> Add Bullet
                              </Button>
                            </div>
                          )}

                          {section.type === 'education' && (
                            <div className="space-y-1">
                              <div className="flex justify-between items-baseline text-xs">
                                <div className="flex items-center gap-2">
                                  <AIEditableText
                                    value={section.type === 'education' ? (item as EducationItem).degree : ''}
                                    onChange={(value) => {
                                      if (section.type === 'education') {
                                        updateField(sectionIndex, itemIndex, 'degree', value);
                                      }
                                    }}
                                    className="font-semibold"
                                    placeholder="Degree (e.g., Bachelor of Science)"
                                  />
                                  <span className="text-gray-500">at</span>
                                  <AIEditableText
                                    value={section.type === 'education' ? (item as EducationItem).institution : ''}
                                    onChange={(value) => {
                                      if (section.type === 'education') {
                                        updateField(sectionIndex, itemIndex, 'institution', value);
                                      }
                                    }}
                                    className="font-medium"
                                    placeholder="Institution Name"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <AIEditableText
                                    value={item.dateRange}
                                    onChange={(value) => updateField(sectionIndex, itemIndex, 'dateRange', value)}
                                    className="text-gray-600 text-sm"
                                    placeholder="Dates (e.g., 2018-2022)"
                                  />
                                </div>
                              </div>
                              
                              <div className="text-gray-600 text-sm">
                                <AIEditableText
                                  value={item.location}
                                  onChange={(value) => updateField(sectionIndex, itemIndex, 'location', value)}
                                  className="italic"
                                  placeholder="Location (e.g., City, Country)"
                                />
                              </div>
                              
                              <ul className="list-disc ml-4 mt-0.5 space-y-0.5">
                                {item.accomplishments.map((acc, accIndex) => (
                                  <li key={accIndex} className="text-gray-600 text-sm">
                                    <div className="flex items-center gap-1">
                                      <AIEditableText
                                        value={acc}
                                        onChange={(value) => updateAccomplishment(sectionIndex, itemIndex, accIndex, value)}
                                        placeholder="Accomplishment (e.g., GPA: 3.8)"
                                      />
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        className="h-5 w-5 opacity-0 group-hover/item:opacity-100"
                                        onClick={() => removeAccomplishment(sectionIndex, itemIndex, accIndex)}
                                      >
                                        <X className="h-3.5 w-3.5" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5 opacity-0 group-hover/item:opacity-100"
                                        onClick={() => triggerAIGeneration(sectionIndex, itemIndex, accIndex, 'accomplishment')}
                                      >
                                        <Sparkles className="h-3.5 w-3.5" />
                                      </Button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                              
                              <div className="flex gap-2 mt-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-sm opacity-0 group-hover/item:opacity-100"
                                  onClick={() => addAccomplishment(sectionIndex, itemIndex)}
                                >
                                  <Plus className="mr-1 h-4 w-4" /> Add Bullet
                                </Button>
                              </div>
                            </div>
                          )}

                          {section.type === 'projects' && (
                            <div className="space-y-1">
                              <div className="flex justify-between items-baseline text-xs">
                                <AIEditableText
                                  value={item.title}
                                  onChange={(value) => updateField(sectionIndex, itemIndex, 'title', value)}
                                  className="font-semibold"
                                  placeholder="Project Title"
                                />
                                <div className="flex gap-2">
                                  <AIEditableText
                                    value={item.dateRange}
                                    onChange={(value) => updateField(sectionIndex, itemIndex, 'dateRange', value)}
                                    className="text-gray-600 text-sm"
                                    placeholder="Dates (e.g., Jan 2023 - Present)"
                                  />
                                </div>
                              </div>
                              
                              <div className="text-gray-600 text-sm">
                                <AIEditableText
                                  value={section.type === 'projects' ? (item as ProjectItem).skills : ''}
                                  onChange={(value) => {
                                    if (section.type === 'projects') {
                                      updateField(sectionIndex, itemIndex, 'skills', value);
                                    }
                                  }}
                                  className="italic"
                                  placeholder="Skills Used (e.g., React, TypeScript)"
                                />
                              </div>
                              
                              <ul className="list-disc ml-4 mt-0.5 space-y-0.5">
                                {item.accomplishments.map((acc, accIndex) => (
                                  <li key={accIndex} className="text-gray-600 text-sm">
                                    <div className="flex items-center gap-1">
                                      <AIEditableText
                                        value={acc}
                                        onChange={(value) => updateAccomplishment(sectionIndex, itemIndex, accIndex, value)}
                                        placeholder="Project accomplishment (e.g., Implemented key features)"
                                      />
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        className="h-5 w-5 opacity-0 group-hover/item:opacity-100"
                                        onClick={() => removeAccomplishment(sectionIndex, itemIndex, accIndex)}
                                      >
                                        <X className="h-3.5 w-3.5" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5 opacity-0 group-hover/item:opacity-100"
                                        onClick={() => triggerAIGeneration(sectionIndex, itemIndex, accIndex, 'accomplishment')}
                                      >
                                        <Sparkles className="h-3.5 w-3.5" />
                                      </Button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                              
                              <div className="flex gap-2 mt-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-sm opacity-0 group-hover/item:opacity-100"
                                  onClick={() => addAccomplishment(sectionIndex, itemIndex)}
                                >
                                  <Plus className="mr-1 h-4 w-4" /> Add Bullet
                                </Button>
                              </div>
                            </div>
                          )}

                          {section.type === 'custom' && (
                            <div className="space-y-1">
                              <div className="flex justify-between items-baseline text-xs">
                                <AIEditableText
                                  value={item.title}
                                  onChange={(value) => updateField(sectionIndex, itemIndex, 'title', value)}
                                  className="font-semibold"
                                />
                                <div className="flex gap-2">
                                  <AIEditableText
                                    value={item.dateRange}
                                    onChange={(value) => updateField(sectionIndex, itemIndex, 'dateRange', value)}
                                    className="text-gray-600 text-sm"
                                  />
                                </div>
                              </div>
                              
                              {/* Bullet Points */}
                              <ul className="list-disc ml-4 mt-0.5 space-y-0.5">
                                {item.accomplishments?.map((acc, accIndex) => (
                                  <li key={accIndex} className="text-gray-600 text-sm">
                                    <div className="flex items-center gap-1">
                                      <AIEditableText
                                        value={acc}
                                        onChange={(value) => updateAccomplishment(sectionIndex, itemIndex, accIndex, value)}
                                      />
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        className="h-5 w-5 opacity-0 group-hover/item:opacity-100"
                                        onClick={() => removeAccomplishment(sectionIndex, itemIndex, accIndex)}
                                      >
                                        <X className="h-3.5 w-3.5" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5 opacity-0 group-hover/item:opacity-100"
                                        onClick={() => triggerAIGeneration(sectionIndex, itemIndex, accIndex, 'accomplishment')}
                                      >
                                        <Sparkles className="h-3.5 w-3.5" />
                                      </Button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-1 text-sm opacity-0 group-hover/item:opacity-100"
                                onClick={() => addAccomplishment(sectionIndex, itemIndex)}
                              >
                                <Plus className="mr-1 h-4 w-4" /> Add Bullet Point
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                      {section.items.length === 0 && (
                        <div className="text-gray-400 text-sm italic">
                          Click "+ Add" to create your first entry
                        </div>
                      )}
                    </div>
                  </section>
                </DraggableSection>
              ))}
            </div>
          </DndProvider>
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2 bg-white p-2 rounded-lg shadow-lg border print-hidden">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setIsAIDialogOpen(true)}
            >
              <Sparkles className="h-4 w-4" />
              AI Assistant
            </Button>
            
            {isExporting ? (
              <Button disabled className={exportHideClass}>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating PDF...
              </Button>
            ) : (
              <Button onClick={handleExportPDF} className={exportHideClass}>
                <Download className="h-4 w-4 mr-1" />
                Download PDF
              </Button>
            )}
          </div>
          <AIGenerationDialog
            open={isAIDialogOpen}
            onOpenChange={(open) => {
              if (!isExporting) setIsAIDialogOpen(open)
            }}
            onGenerate={handleAIGenerate}
            fieldType={currentSection?.fieldType || 'accomplishment'}
          />
         
        </div>
      </div>
    </Providers>
  )
}

// Add this inside your component file, outside the main component
const createSafeData = (data?: ResumeData): ResumeData => {
  // Provide a complete default structure
  const fallback: ResumeData = {
    personalInfo: {
      name: 'Your Name',
      email: 'email@example.com',
      phone: '(123) 456-7890',
      linkedin: 'linkedin.com/in/yourprofile',
      github: 'github.com/yourusername'
    },
    sections: []
  };

  return {
    personalInfo: { 
      ...fallback.personalInfo, 
      ...(data?.personalInfo || {}) 
    },
    sections: (data?.sections || []).map(section => ({
      id: section.id || crypto.randomUUID(),
      type: section.type || 'custom',
      title: section.title || 'Section Title',
      items: (section.items || []).map(item => ({
        id: item.id || crypto.randomUUID(),
        title: item.title || 'Item Title',
        dateRange: item.dateRange || 'Date Range',
        location: item.location || 'Location',
        accomplishments: item.accomplishments || ['Accomplishment description'],
        // Type-specific fields with safe defaults
        ...(section.type === 'education' && {
          degree: (item as EducationItem).degree || 'Degree Name',
          institution: (item as EducationItem).institution || 'Institution Name'
        }),
        ...(section.type === 'experience' && {
          company: (item as ExperienceItem).company || 'Company Name',
          position: (item as ExperienceItem).position || 'Position Title'
        }),
        ...(section.type === 'projects' && {
          skills: (item as ProjectItem).skills || 'Relevant Skills'
        })
      }))
    }))
  };
};

