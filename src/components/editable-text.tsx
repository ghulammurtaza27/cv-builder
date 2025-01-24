'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface EditableTextProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  italic?: boolean
  as?: 'div' | 'h1' | 'h2'
}

export function EditableText({
  value,
  onChange,
  placeholder,
  className,
  italic,
  as: Component = 'div'
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isEditing && ref.current) {
      ref.current.focus()
    }
  }, [isEditing])

  return (
    <Component
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onFocus={() => setIsEditing(true)}
      onBlur={(e) => {
        setIsEditing(false)
        onChange(e.currentTarget.textContent || '')
      }}
      className={cn(
        'outline-none focus:outline-none min-w-[1ch] print:text-black',
        !value && 'text-gray-500 print:text-gray-400',
        italic && 'italic',
        className
      )}
      dangerouslySetInnerHTML={{
        __html: value || placeholder || ''
      }}
    />
  )
}

