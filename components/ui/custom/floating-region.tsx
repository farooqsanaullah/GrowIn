"use client";

import * as React from "react";
import { RegionDropdown } from "react-country-region-selector";
import { FloatingLabel } from "@/components/ui";

interface Props {
  label: string;
  country: string;
  value: string;
  onChange: (val: string) => void;
}

const FloatingRegionInput: React.FC<Props> = ({ label, country, value, onChange }) => {
  return (
    <div className="relative">
      <RegionDropdown
        country={country}
        value={value}
        onChange={onChange}
        className="w-full rounded-md peer border border-input h-9 text-sm cursor-pointer"
      />
      <FloatingLabel
        htmlFor="city"
        className={`absolute left-2 top-2 text-gray-500 text-sm pointer-events-none`}
      >
        {label}
      </FloatingLabel>
    </div>
  );
};

export { FloatingRegionInput };