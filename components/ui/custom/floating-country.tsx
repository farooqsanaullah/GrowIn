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

export const FloatingCountryInput: React.FC<Props> = ({ label, value, onChange }) => {
  const [focused, setFocused] = React.useState(false);

  return (
    <div className="relative">
      <CountryDropdown
        value={value}
        onChange={onChange}
        className="w-full border rounded-md p-2 peer"
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
