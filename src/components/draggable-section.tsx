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
        'relative group transition-opacity',
        isDragging ? 'opacity-50' : 'opacity-100'
      )}
    >
      <div className="absolute left-0 top-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
        <GripVertical className="h-4 w-4 text-gray-400 hover:text-gray-600" />
      </div>
      {children}
    </div>
  )
}

