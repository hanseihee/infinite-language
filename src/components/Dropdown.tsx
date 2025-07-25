'use client';

import { useState } from 'react';

interface DropdownProps {
  label?: string;
  placeholder?: string;
  options: string[];
  onSelect: (option: string) => void;
  selectedOption?: string;
  defaultValue?: string;
}

export default function Dropdown({ label, placeholder, options, onSelect, selectedOption, defaultValue }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue || selectedOption || '');

  const handleSelect = (option: string) => {
    setSelected(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left w-full">
      <div>
        <button
          type="button"
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm sm:text-base font-semibold text-slate-200 shadow-sm min-h-[44px] transition-colors"
          style={{backgroundColor: '#252B36'}}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selected || selectedOption || placeholder || label || '선택하세요'}
          <svg
            className={`-mr-1 h-5 w-5 text-slate-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 z-10 mt-2 w-full origin-top-right rounded-md shadow-lg focus:outline-none" style={{backgroundColor: '#252B36'}}>
          <div className="py-1">
            {options.map((option, index) => (
              <button
                key={index}
                className="block w-full text-left px-4 py-2 text-sm sm:text-base text-slate-200 hover:text-white min-h-[44px] flex items-center transition-colors hover:bg-slate-600/50"
                onClick={() => handleSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}