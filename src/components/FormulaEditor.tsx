import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';

interface FormulaEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const FormulaEditor: React.FC<FormulaEditorProps> = ({ value, onChange, className }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [highlightedCode, setHighlightedCode] = useState('');

  const highlightFormula = (formula: string) => {
    if (!formula) return '';
    
    return formula
      // Highlight variables {variable}
      .replace(/\{[^}]+\}/g, '<span class="text-formula-variable font-semibold">$&</span>')
      // Highlight operators
      .replace(/[+\-*/()]/g, '<span class="text-formula-operator font-bold">$&</span>')
      // Highlight numbers
      .replace(/\b\d+\.?\d*\b/g, '<span class="text-formula-number font-medium">$&</span>')
      // Preserve spaces and line breaks
      .replace(/\n/g, '<br>')
      .replace(/ /g, '&nbsp;');
  };

  useEffect(() => {
    setHighlightedCode(highlightFormula(value));
  }, [value]);

  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-card border-border/50">
      <div className="relative">
        <div
          ref={highlightRef}
          className="absolute inset-0 p-4 font-mono text-sm leading-6 pointer-events-none overflow-auto bg-formula-bg/50 whitespace-pre-wrap break-words"
          style={{ 
            color: 'transparent',
            zIndex: 1,
            lineHeight: '1.5rem'
          }}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          placeholder="Digite sua fórmula aqui... Ex: {peso} / ({altura} * {altura})"
          className={`
            relative z-10 w-full min-h-[120px] p-4 font-mono text-sm
            bg-transparent border-0 outline-none resize-none
            text-foreground/90 placeholder:text-muted-foreground
            leading-6 overflow-auto whitespace-pre-wrap break-words
            ${className}
          `}
          style={{ 
            caretColor: 'hsl(var(--primary))',
            lineHeight: '1.5rem'
          }}
        />
      </div>
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
        Use {'{'}variavel{'}'} para criar campos dinâmicos
      </div>
    </Card>
  );
};

export default FormulaEditor;