"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Button,
  DualRangeSlider,
  SkillsInput,
  Label,
  FloatingLabelInput,
  FloatingCountryInput,
  FloatingRegionInput,
  FloatingPhoneInput,
  FloatingLabel,
} from "@/components/ui";
import Datepicker from "react-tailwindcss-datepicker";
import "flowbite/dist/flowbite.css";

export default function EditProfilePage() {
  // BASIC INFO
  const [basic, setBasic] = useState({
    userName: "hafiz_dev",
    name: "Hafiz Mateen",
    email: "hafiz@example.com",
    profileImage: "",
    bio: "Software engineer at Amrood Labs",
    phone: "",
  });

  // LOCATION
  const [location, setLocation] = useState({
    country: "United States",
    city: "Alabama",
  });

  // FOUNDER INFO
  const [founder, setFounder] = useState({
    designation: "Software Engineer",
    company: "Amrood Labs",
    experienceDesc: "Optional experience description",
    expStart: new Date("2001-01-01"),
    expEnd: new Date("2001-01-01"),
    skills: [] as string[],
  });

  // INVESTOR INFO
  const [fundingRange, setFundingRange] = useState([10, 70]);
  const [manual, setManual] = useState({ min: 10, max: 70 });

  useEffect(() => {
    setManual({
      min: fundingRange[0],
      max: fundingRange[1],
    });
  }, [fundingRange]);

  const handleMinChange = (val: number) => {
    const min = Math.min(val, manual.max);
    setManual((prev) => ({ ...prev, min }));
    setFundingRange([min, manual.max]);
  };

  const handleMaxChange = (val: number) => {
    const max = Math.max(val, manual.min);
    setManual((prev) => ({ ...prev, max }));
    setFundingRange([manual.min, max]);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-semibold text-primary">Edit Profile</h1>

      {/* PROFILE IMAGE */}
      <div className="flex items-center gap-6">
        {basic.profileImage ? (
          <Image
            src={basic.profileImage}
            alt="Profile"
            width={90}
            height={90}
            className="rounded-full border"
          />
        ) : (
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold"
            style={{ backgroundColor: "#4F46E5" }}
          >
            {basic.userName.charAt(0).toUpperCase()}
          </div>
        )}

        <Button className="cursor-pointer" variant="outline">
          Change Photo
        </Button>
      </div>

      {/* BASIC INFO */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-foreground">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FloatingLabelInput
            id="username"
            label="Username"
            type="text"
            value={basic.userName}
            onChange={(e) =>
              setBasic({ ...basic, userName: e.target.value })
            }
          />

          <FloatingLabelInput
            id="fullName"
            label="Full Name"
            type="text"
            value={basic.name}
            onChange={(e) => setBasic({ ...basic, name: e.target.value })}
          />

          <FloatingLabelInput
            id="email"
            label="Email"
            type="email"
            disabled
            value={basic.email}
            className="bg-muted opacity-70"
          />

          <FloatingPhoneInput
            label="Phone"
            value={basic.phone}
            onChange={(val) => setBasic({ ...basic, phone: val })}
          />

          <FloatingCountryInput
            label="Country"
            value={location.country}
            onChange={(val) => setLocation({ country: val, city: "" })}
          />

          <FloatingRegionInput
            label="City"
            country={location.country}
            value={location.city}
            onChange={(val) => setLocation({ ...location, city: val })}
          />
        </div>

        <FloatingLabelInput
          id="bio"
          label="Bio"
          type="text"
          value={basic.bio}
          onChange={(e) => setBasic({ ...basic, bio: e.target.value })}
          className="w-full"
        />
      </section>

      {/* FOUNDER INFO */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-foreground">
          Founder Information
        </h2>

        <FloatingLabelInput
          id="designation"
          label="Designation"
          value={founder.designation}
          onChange={(e) =>
            setFounder({ ...founder, designation: e.target.value })
          }
        />

        <div className="space-y-2 relative z-[9999]">
          <Datepicker
            value={{ startDate: founder.expStart, endDate: founder.expEnd }}
            onChange={(range) =>
              setFounder({
                ...founder,
                expStart: range?.startDate || new Date(),
                expEnd: range?.endDate || new Date(),
              })
            }
            displayFormat="MM/DD/YYYY"
            separator="-"
            startFrom={founder.expStart}
            inputClassName="peer w-full border rounded-md p-2 placeholder-transparent"
          />
          <FloatingLabel
            htmlFor="experience"
            className="absolute left-2 top-2 text-gray-500 text-sm pointer-events-none"
          >
            Experience Duration
          </FloatingLabel>
        </div>

        <FloatingLabelInput
          id="company"
          label="Company Name"
          value={founder.company}
          onChange={(e) =>
            setFounder({ ...founder, company: e.target.value })
          }
        />

        <FloatingLabelInput
          id="company-desc"
          label="Company Description"
          value={founder.experienceDesc}
          onChange={(e) =>
            setFounder({ ...founder, experienceDesc: e.target.value })
          }
        />

        <SkillsInput
          skills={founder.skills}
          setSkills={(val) => setFounder({ ...founder, skills: val })}
        />
      </section>

      {/* INVESTOR INFO */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-foreground">
          Investor Information
        </h2>

        <Label>Funding Range</Label>

        <div className="flex gap-4 items-end">
          <DualRangeSlider
            label={(val) => `$${val}k`}
            value={fundingRange}
            onValueChange={setFundingRange}
            min={0}
            max={500}
            step={5}
          />

          <div className="flex gap-4 items-end">
            <FloatingLabelInput
              id="funding-min"
              label="Min"
              type="number"
              value={manual.min}
              onChange={(e) => handleMinChange(Number(e.target.value))}
              className="w-24"
            />

            <FloatingLabelInput
              id="funding-max"
              label="Max"
              type="number"
              value={manual.max}
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
