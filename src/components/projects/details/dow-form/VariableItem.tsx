import React, { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DOWVariable } from '../types';
import { format, isValid, parse } from 'date-fns';

interface VariableItemProps {
  variable: DOWVariable;
  activeVariableName: string | null;
  onUpdate: (id: string, field: 'name' | 'value' | 'type', newValue: string) => void;
  onRemove: (id: string) => void;
  onSaveRequested?: () => boolean; // Updated to return boolean success status
}

const VariableItem: React.FC<VariableItemProps> = ({
  variable,
  activeVariableName,
  onUpdate,
  onRemove,
  onSaveRequested
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isActive = activeVariableName === variable.name;

  const validateValue = (value: string, type: string): boolean => {
    setValidationError(null); // Reset error state

    switch (type) {
      case 'number':
        if (value === '') return true; // Allow empty for optional fields
        const num = parseFloat(value);
        if (isNaN(num) || num < 0) {
          setValidationError('Please enter a valid non-negative number');
          return false;
        }
        return true;
      
      case 'date':
        if (value === '') return true; // Allow empty for optional fields
        try {
          const dateObj = parse(value, 'yyyy-MM-dd', new Date());
          if (!isValid(dateObj)) {
            setValidationError('Please enter a valid date (YYYY-MM-DD)');
            return false;
          }
          return true;
        } catch {
          setValidationError('Please enter a valid date (YYYY-MM-DD)');
          return false;
        }
      
      default: // 'string' or any other type
        return true; // No validation needed for string type
    }
  };

  const formatValueForType = (value: string, type: string): string => {
    switch (type) {
      case 'date':
        try {
          const dateObj = parse(value, 'yyyy-MM-dd', new Date());
          if (isValid(dateObj)) {
            return format(dateObj, 'yyyy-MM-dd');
          }
          return value;
        } catch {
          return value;
        }
      default:
        return value;
    }
  };
  
  const handleValueChange = (newValue: string) => {
    onUpdate(variable.id, 'value', newValue);
  };

  const handleTypeChange = (newType: string) => {
    setValidationError(null);
    
    let formattedValue = variable.value;
    
    if (newType === 'date' && variable.type !== 'date') {
      try {
        const dateObj = new Date(variable.value);
        if (isValid(dateObj)) {
          formattedValue = format(dateObj, 'yyyy-MM-dd');
        } else {
          formattedValue = '';
        }
      } catch {
        formattedValue = '';
      }
    }
    
    if (newType === 'number' && variable.type !== 'number') {
      const numericValue = variable.value.replace(/[^0-9.]/g, '');
      formattedValue = numericValue || '';
    }
    
    onUpdate(variable.id, 'type', newType);
    onUpdate(variable.id, 'value', formattedValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && variable.type !== 'string') {
      e.preventDefault();
      
      if (validateValue(variable.value, variable.type)) {
        if (onSaveRequested) {
          onSaveRequested();
        }
      }
    }

    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && variable.type === 'string') {
      e.preventDefault();
      
      if (validateValue(variable.value, variable.type)) {
        if (onSaveRequested) {
          onSaveRequested();
        }
      }
    }
  };

  const renderInputControl = () => {
    switch (variable.type) {
      case 'number':
        return (
          <Input
            ref={inputRef}
            type="number"
            min="0"
            value={variable.value}
            onChange={(e) => {
              const newValue = e.target.value;
              validateValue(newValue, 'number');
              handleValueChange(newValue);
            }}
            onBlur={(e) => validateValue(e.target.value, 'number')}
            onKeyDown={handleKeyDown}
            className={validationError ? "border-red-500" : ""}
            placeholder="Enter a number value"
          />
        );
      
      case 'date':
        return (
          <div className="relative">
            <Input
              ref={inputRef}
              type="date"
              value={variable.value}
              onChange={(e) => {
                const newValue = e.target.value;
                validateValue(newValue, 'date');
                handleValueChange(newValue);
              }}
              onBlur={(e) => validateValue(e.target.value, 'date')}
              onKeyDown={handleKeyDown}
              className={`${validationError ? "border-red-500" : ""} pr-10`}
              placeholder="YYYY-MM-DD"
            />
            <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        );
      
      default: // 'string' or any other type
        return (
          <Textarea
            ref={textareaRef}
            value={variable.value}
            onChange={(e) => handleValueChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-20 resize-y"
            placeholder="Enter a text value"
          />
        );
    }
  };

  return (
    <Card className={`overflow-hidden ${isActive ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="grid grid-cols-12 gap-3 items-start">
          <div className="col-span-3">
            <Input
              value={variable.name}
              onChange={(e) => onUpdate(variable.id, 'name', e.target.value.toUpperCase())}
              placeholder="VARIABLE_NAME"
              className="font-mono uppercase"
            />
          </div>
          
          <div className="col-span-2">
            <Select
              value={variable.type}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="string">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="date">Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="col-span-6">
            {renderInputControl()}
            {validationError && (
              <p className="text-red-500 text-xs mt-1">{validationError}</p>
            )}
          </div>
          
          <div className="col-span-1 flex justify-end">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onRemove(variable.id)}
              className="h-9 w-9"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VariableItem;
