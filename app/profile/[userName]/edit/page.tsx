"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { 
  Button, 
  DualRangeSlider, 
  SkillsInput, 
  Label, 
  FloatingLabelInput, 
  DateRangePicker, 
  FloatingCountryInput,
  FloatingRegionInput,
  FloatingPhoneInput
} from "@/components/ui";

export default function EditProfilePage() {
  // Basic Info
  const [userName, setUserName] = useState("hafiz_dev");
  const [name, setName] = useState("Hafiz Mateen");
  const [email] = useState("hafiz@example.com");
  const [profileImage] = useState("");
  const [bio, setBio] = useState("Software engineer at Amrood Labs");
  const [phone, setPhone] = useState("");
  const [expStart, setExpStart] = useState("01/01/2001");
  const [expEnd, setExpEnd] = useState("01/01/2001");

  // Country/City
  const [country, setCountry] = useState("United States");
  const [city, setCity] = useState("Alabama");

  // Founder Info
  const [designation, setDesignation] = useState("Software Engineer");
  const [company, setCompany] = useState("Amrood Labs");
  const [experienceDesc, setExperienceDesc] = useState("Optional experience description");
  const [skills, setSkills] = useState<string[]>([]);

  // Investor Info
  const [fundingRange, setFundingRange] = useState([10, 70]);
  const [manualMin, setManualMin] = useState(10);
  const [manualMax, setManualMax] = useState(70);

  // Sync manual inputs when slider changes
  useEffect(() => {
    setManualMin(fundingRange[0]);
    setManualMax(fundingRange[1]);
  }, [fundingRange]);

  const handleMinChange = (val: number) => {
    const min = Math.min(val, manualMax); // prevent min > max
    setManualMin(min);
    setFundingRange([min, manualMax]);
  };

  const handleMaxChange = (val: number) => {
    const max = Math.max(val, manualMin); // prevent max < min
    setManualMax(max);
    setFundingRange([manualMin, max]);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-semibold text-primary">Edit Profile</h1>

      {/* Profile Image */}
      <div className="flex items-center gap-6">
        {profileImage ? (
          <Image
            src={profileImage}
            alt="Profile"
            width={90}
            height={90}
            className="rounded-full border"
          />
        ) : (
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold"
            style={{ backgroundColor: "#4F46E5" }} // hardcoded background color
          >
            {userName?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
        <Button className="cursor-pointer" variant="outline">Change Photo</Button>
      </div>

      {/* Basic Info */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-foreground">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username */}
          <FloatingLabelInput
            id="username"
            label="Username"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full"
          />

          {/* Full Name */}
          <FloatingLabelInput
            id="fullName"
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />

          {/* Email (Read Only) */}
          <FloatingLabelInput
            id="email"
            label="Email"
            type="email"
            value={email}
            disabled
            className="w-full bg-muted opacity-70"
          />

          {/* Phone */}
          <FloatingPhoneInput
            label="Phone"
            value={phone}
            onChange={setPhone}
          />

          {/* Country */}
          <FloatingCountryInput
            label="Country"
            value={country}
            onChange={(val) => { setCountry(val); setCity(""); }}
          />

          {/* City */}
          <FloatingRegionInput
            label="City"
            country={country}
            value={city}
            onChange={setCity}
          />
        </div>

        {/* Bio */}
        <FloatingLabelInput
          id="bio"
          label="Bio"
          type="text"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full"
          // multiline
        />

      </section>

      {/* Founder Info */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-foreground">Founder Information</h2>
        <FloatingLabelInput
          id="designation"
          label="Designation"
          type="text"
          value={designation}
          onChange={e => setDesignation(e.target.value)}
          className="w-full"
        />
        <div>
        {/* Experience Dates */}
        <section className="space-y-2">
          <h3 className="text-md font-medium text-foreground">Experience Duration</h3>
          <DateRangePicker
            value={{ start: expStart, end: expEnd }}
            onChange={(range) => {
              setExpStart(range.start);
              setExpEnd(range.end);
            }}
          />
        </section>

        </div>
        <FloatingLabelInput
          id="company-name"
          label="Company Name"
          type="text"
          value={company}
          onChange={e => setCompany(e.target.value)}
          className="w-full"
        />

        <FloatingLabelInput
          id="company-name"
          label="Company Description"
          type="text"
          value={experienceDesc}
          onChange={e => setExperienceDesc(e.target.value)}
          className="w-full"
        />

        <SkillsInput skills={skills} setSkills={setSkills} />
      </section>

      {/* Investor Info */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-foreground">Investor Information</h2>
        <Label className="">Funding Range</Label>

        <div className="flex gap-4 items-end">
          {/* Dual Range Slider */}
          <DualRangeSlider
            label={(val) => `$${val}k`}
            value={fundingRange}
            onValueChange={setFundingRange}
            min={0}
            max={500}
            step={5}
            className="cursor-pointer"
          />

          {/* Manual Inputs */}
          <div className="flex gap-4 items-end">
            <FloatingLabelInput
              id="funding-min"
              label="Min"
              type="number"
              value={manualMin}
              onChange={(e) => handleMinChange(Number(e.target.value))}
              className="w-24"
            />
            <FloatingLabelInput
              id="funding-max"
              label="Max"
              type="number"
              value={manualMax}
              onChange={(e) => handleMaxChange(Number(e.target.value))}
              className="w-24"
            />
          </div>
        </div>
      </section>

      <Button className="w-full md:w-auto cursor-pointer">Save Changes</Button>
    </div>
  );
}
