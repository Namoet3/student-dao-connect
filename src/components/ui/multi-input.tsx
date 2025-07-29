import React, { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface MultiInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  className?: string;
}

export const MultiInput = React.forwardRef<HTMLInputElement, MultiInputProps>(
  ({ value = [], onChange, placeholder, suggestions = [], className }, ref) => {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const filteredSuggestions = suggestions.filter(
      (suggestion) =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
        !value.includes(suggestion)
    );

    const addTag = (tag: string) => {
      if (tag && !value.includes(tag)) {
        onChange([...value, tag]);
        setInputValue('');
        setShowSuggestions(false);
      }
    };

    const removeTag = (tagToRemove: string) => {
      onChange(value.filter((tag) => tag !== tagToRemove));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTag(inputValue.trim());
      } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
        removeTag(value[value.length - 1]);
      }
    };

    const handleSuggestionClick = (suggestion: string) => {
      addTag(suggestion);
    };

    return (
      <div className="relative">
        <div
          className={cn(
            'flex min-h-[40px] w-full flex-wrap gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
            className
          )}
        >
          {value.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 rounded-full hover:bg-secondary-foreground/20"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <input
            ref={ref}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={value.length === 0 ? placeholder : ''}
            className="flex-1 border-0 bg-transparent p-0 outline-none placeholder:text-muted-foreground"
          />
        </div>

        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md">
            {filteredSuggestions.slice(0, 10).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground"
              >
                #{suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

MultiInput.displayName = 'MultiInput';