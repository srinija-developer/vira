'use client';
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';

interface OptimizerEditorProps {
  content: string;
  originalContent: string;
  onChange: (text: string) => void;
  onReset: () => void;
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function estimateReadTime(words: number): string {
  const seconds = Math.round((words / 200) * 60);
  if (seconds < 60) return `${seconds}s read`;
  return `${Math.ceil(seconds / 60)}m read`;
}

export default function OptimizerEditor({
  content,
  originalContent,
  onChange,
  onReset,
}: OptimizerEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wordCount = countWords(content);
  const charCount = content.length;
  const isModified = content !== originalContent;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col h-full card-glow"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Icon name="DocumentTextIcon" size={16} className="text-muted-foreground" />
          <span className="text-sm font-bold text-foreground">Original Content</span>
          {isModified && (
            <span className="text-2xs font-semibold text-warning bg-warning/10 border border-warning/20 px-2 py-0.5 rounded-full">
              Edited
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isModified && (
            <button
              onClick={onReset}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground bg-muted border border-border px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Icon name="ArrowUturnLeftIcon" size={12} />
              Reset
            </button>
          )}
          <button
            onClick={() => {
              navigator.clipboard.writeText(content);
            }}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground bg-muted border border-border px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Icon name="ClipboardDocumentIcon" size={12} />
            Copy
          </button>
        </div>
      </div>

      {/* Textarea */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full min-h-[400px] bg-transparent text-sm text-foreground leading-relaxed p-5 resize-none focus:outline-none scrollbar-thin font-sans placeholder:text-muted-foreground"
          placeholder="Your content will appear here..."
          aria-label="Content editor"
          spellCheck
        />
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/30">
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-muted-foreground font-tabular">
            <span className="text-foreground font-bold">{wordCount}</span> words
          </span>
          <span className="text-xs font-medium text-muted-foreground font-tabular">
            <span className="text-foreground font-bold">{charCount}</span> chars
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {estimateReadTime(wordCount)}
          </span>
        </div>
        {isModified && (
          <span className="text-2xs text-warning font-medium flex items-center gap-1">
            <Icon name="PencilIcon" size={11} />
            Unsaved changes
          </span>
        )}
      </div>
    </motion.div>
  );
}