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
  const [focused, setFocused] = React.useState(false);

  return (
    <div className="relative">
      <RegionDropdown
        country={country}
        value={value}
        onChange={onChange}
        className="w-full rounded-md peer cursor-pointer"
        onFocus={() => setFocused(true)}
        // onBlur={() => setFocused(false)}
      />
      <FloatingLabel
        htmlFor=""
        className={`${focused || value ? "peer-focus:top-2" : ""}`}
      >
        {label}
      </FloatingLabel>
    </div>
  );
};

export { FloatingRegionInput };