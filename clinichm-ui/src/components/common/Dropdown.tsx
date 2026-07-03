import React from 'react';

interface DropdownProps {
  options: string[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  value?: string;
  disabled?: boolean; 
}

const Dropdown: React.FC<DropdownProps> = ({ options, placeholder, onChange , className = '', value='', disabled = false}) => {
  return (
    <select
      className={`input-style text-input-placeholder  ${className}
      ${
        disabled ? '!bg-gray-300 text-gray-400 cursor-not-allowed' : ''
      }`}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
      defaultValue=""
      value={value}
      disabled={disabled}
    >
      <option value="" disabled className="text-input-placeholder">
        {placeholder || "Seleccione una opción"}
      </option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
