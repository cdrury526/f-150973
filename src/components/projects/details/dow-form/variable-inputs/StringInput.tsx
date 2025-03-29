
import React, { useRef } from 'react';
import { Textarea } from "@/components/ui/textarea";

interface StringInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const StringInput: React.FC<StringInputProps> = ({
  value,
  onChange,
  onKeyDown
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      className="min-h-[32px] h-auto resize-y"
      placeholder="Enter a text value"
      rows={1}
    />
  );
};

export default StringInput;
