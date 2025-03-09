"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

interface AutoResizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number
  maxRows?: number
}

export function AutoResizeTextarea({
  value,
  minRows = 1,
  maxRows = 5,
  className,
  onChange,
  ...props
}: AutoResizeTextareaProps) {
  // Fix: Change the ref type to explicitly include null
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e)
    }
    adjustHeight()
  }

  const adjustHeight = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = "auto"
    const newHeight = Math.min(
      Math.max(textarea.scrollHeight, minRows * 24), // Assuming 24px per row
      maxRows * 24,
    )
    textarea.style.height = `${newHeight}px`
  }

  useEffect(() => {
    adjustHeight()
  }, [value])

  return (
    <Textarea
      ref={(node) => {
        // Now this assignment is valid because we've properly typed the ref
        textareaRef.current = node
      }}
      value={value || ""}
      rows={1}
      onChange={handleChange}
      className={cn("resize-none overflow-hidden", className)}
      {...props}
    />
  )
}

