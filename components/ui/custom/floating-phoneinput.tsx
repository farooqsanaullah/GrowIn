"use client";

import * as React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FloatingLabel } from "@/components/ui";

interface Props {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

const FloatingPhoneInput: React.FC<Props> = ({ label, value, onChange }) => {

  return (
    <div className="relative">
      <PhoneInput
        country="pk"
        value={value}
        onChange={onChange}
        inputClass="!w-full border rounded-md p-2 peer"
      />
      <FloatingLabel
        htmlFor="phone"
        className="bg-background absolute left-2 top-2 text-gray-500 text-sm pointer-events-none"
      >
        {label}
      </FloatingLabel>
    </div>
  );
};

export { FloatingPhoneInput };