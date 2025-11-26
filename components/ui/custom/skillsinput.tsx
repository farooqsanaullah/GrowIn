import { useState } from "react";
import { FloatingLabel } from "./floating-labelinput";

interface SkillsInputProps {
  skills: string[];
  setSkills: (v: string[]) => void;
}

export function SkillsInput({ skills, setSkills }: SkillsInputProps) {
  const [skillInput, setSkillInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  return (
    <div className="relative w-full">
      <div className="flex flex-wrap items-center gap-2 w-full border rounded-md p-2 peer">
        {skills.map((skill) => (
          <span
            key={skill}
            className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm flex items-center gap-1"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="text-xs text-gray-600 hover:text-red-500"
            >
              ✕
            </button>
          </span>
        ))}
        <input
          type="text"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type and press enter"
          className="flex-1 min-w-[120px] border-none outline-none p-1 text-sm focus:ring-0"
        />
      </div>
      <FloatingLabel
        htmlFor="skills"
        className="absolute left-2 top-2 text-gray-500 text-sm pointer-events-none"
      >
        Skills
      </FloatingLabel>
    </div>
  );
}
