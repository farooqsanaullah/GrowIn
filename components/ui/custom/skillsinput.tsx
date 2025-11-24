import { useState } from "react";

function SkillsInput({ skills, setSkills }: { skills: string[]; setSkills: (v: string[]) => void }) {
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
    <div>
      <label className="block text-sm font-semibold mb-2 text-gray-700">Skills</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {skills.map((skill) => (
          <span key={skill} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm flex items-center gap-1">
            {skill}
            <button 
              onClick={() => removeSkill(skill)} 
              className="text-xs text-gray-600 hover:text-red-500">
              ✕
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={skillInput}
        onChange={(e) => setSkillInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type and press Enter"
        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export { SkillsInput }