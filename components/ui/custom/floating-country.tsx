"use client";

import * as React from "react";
import { CountryDropdown } from "react-country-region-selector";
import "react-phone-input-2/lib/style.css";
import { FloatingLabel } from "@/components/ui";

interface Props {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

const FloatingCountryInput: React.FC<Props> = ({ label, value, onChange }) => {
  return (
    <div className="relative">
      <CountryDropdown
        value={value}
        onChange={onChange}
        className="w-full rounded-md peer border border-input h-9 text-sm cursor-pointer"
      />
      <FloatingLabel
        htmlFor="country"
        className="absolute left-2 top-2 text-gray-500 text-sm pointer-events-none"
      >
        {label}
      </FloatingLabel>
    </div>
  );
};

export { FloatingCountryInput };