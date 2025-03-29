import React, { useRef, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";

interface StringInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onBlur: () => void;
  onFocus: () => void;
  variableName?: string;
}

const StringInput: React.FC<StringInputProps> = ({
  value,
  onChange,
  onKeyDown,
  onBlur,
  onFocus,
  variableName
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle controlled component updating
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // If the textarea value doesn't match the value prop, update it
    if (textarea.value !== value) {
      textarea.value = value || '';
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log('StringInput onChange:', e.target.value);
    onChange(e.target.value);
  };

  // Set up event handlers directly and ensure the component focus is working
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleTextareaChange = (e: Event) => {
      const target = e.target as HTMLTextAreaElement;
      console.log('Direct textarea change:', target.value);
    };

    textarea.addEventListener('input', handleTextareaChange);
    
    // Clean up the event listener when the component unmounts
    return () => {
      textarea.removeEventListener('input', handleTextareaChange);
    };
  }, []);

  return (
    <Textarea
      ref={textareaRef}
      defaultValue={value}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      onFocus={onFocus}
      className="min-h-[32px] h-auto resize-y"
      placeholder="Enter a text value"
      rows={1}
      data-variable-name={variableName}
    />
  );
};

export default StringInput;
