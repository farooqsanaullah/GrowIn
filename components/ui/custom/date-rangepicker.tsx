"use client";

import { useEffect, useRef, useState } from "react";
import "flowbite/dist/flowbite.css";
import { Datepicker } from "flowbite-datepicker";

interface DateRange {
  start: string;
  end: string;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  const [range, setRange] = useState<DateRange>({
    start: value?.start || "",
    end: value?.end || "",
  });

  // Initialize Flowbite datepicker
  useEffect(() => {
    if (startRef.current && endRef.current) {
      const picker = new Datepicker(startRef.current, {
        format: "mm/dd/yyyy",
        autohide: true,
        range: true,
        inputs: [startRef.current, endRef.current],
      });

      // Listen for changes in the inputs
      const handleChange = () => {
        const newRange = {
          start: startRef.current?.value || "",
          end: endRef.current?.value || "",
        };
        setRange(newRange);
        onChange?.(newRange);
      };

      startRef.current.addEventListener("change", handleChange);
      endRef.current.addEventListener("change", handleChange);

      return () => {
        startRef.current?.removeEventListener("change", handleChange);
        endRef.current?.removeEventListener("change", handleChange);
      };
    }
  }, [onChange]);

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-full">
        <input
          ref={startRef}
          type="text"
          className="block w-full ps-3 pe-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand placeholder:text-body"
          placeholder="Start date"
          value={range.start}
          readOnly
        />
      </div>
      <span className="text-body">to</span>
      <div className="relative w-full">
        <input
          ref={endRef}
          type="text"
          className="block w-full ps-3 pe-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand placeholder:text-body"
          placeholder="End date"
          value={range.end}
          readOnly
        />
      </div>
    </div>
  );
}
