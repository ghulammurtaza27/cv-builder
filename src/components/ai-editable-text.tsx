'use client'

import { EditableText } from '@/components/editable-text'
import { useState } from 'react'

interface AIEditableTextProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  fieldType?: string
  as?: 'div' | 'h1' | 'h2'
  italic?: boolean
  inline?: boolean
}

export default function AIEditableText({ 
  value,
  onChange,
  placeholder,
  className,
  fieldType,
  as,
  italic,
  inline
}: AIEditableTextProps) {
  return (
    <EditableText
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      as={as}
      italic={italic}
    />
  )
}

