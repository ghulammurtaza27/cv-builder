'use client'

import { useDrag, useDrop } from 'react-dnd'
import { GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DragItem } from '../types/resume'
import { useRef } from 'react'

interface DraggableSectionProps {
  id: string
  index: number
  moveSection: (dragIndex: number, hoverIndex: number) => void
  children: React.ReactNode
}

export function DraggableSection({ id, index, moveSection, children }: DraggableSectionProps) {
  const dragDropRef = useRef<HTMLDivElement>(null)
  const dragHandleRef = useRef<HTMLDivElement>(null)
  const [{ isDragging }, drag] = useDrag({
    type: 'section',
    item: { type: 'section', id, index } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: 'section',
    hover(item: DragItem) {
      if (!item || item.index === index) {
        return
      }
      moveSection(item.index, index)
      item.index = index
    },
  })

  drag(drop(dragDropRef))

  return (
    <div
      ref={dragDropRef}
      className={cn(
        'relative group transition-[opacity,transform] duration-200 ease-in-out',
        isDragging ? 'opacity-50 scale-95 shadow-lg' : 'opacity-100 scale-100',
        'hover:bg-gray-50/50 rounded-lg p-2 -mx-2'
      )}
    >
      <div 
        ref={dragHandleRef}
        className="absolute -left-5 top--1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-move hover:text-gray-600"
      >
        <GripVertical className="h-4 w-4 text-gray-400 transition-colors" />
      </div>
      {children}
      <div className="absolute inset-x-0 -bottom-2 h-0.5 bg-blue-200 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}

