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
import { useParams } from "next/navigation";
import { Loader } from "lucide-react";
import { updateUserSchema } from "@/lib/auth/zodValidation/updateUserSchema";
import toast from "react-hot-toast";

export default function EditProfilePage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const params = useParams();
  const userName = params.userName;
  const [user, setUser] = useState<any>(null);

  // BASIC INFO
  const [basicInfo, setBasicInfo] = useState({
    userName: "",
    name: "",
    email: "",
    profileImage: "",
    bio: "",
    phone: "",
  });

  // LOCATION
  const [location, setLocation] = useState({
    country: "",
    city: "",
  });

  // FOUNDER INFO
  const [founder, setFounder] = useState({
    experiences: [
      {
        designation: "",
        company: "",
        experienceDesc: "",
        expStart: new Date(),
        expEnd: new Date(),
      },
    ],
    skills: [] as string[],
  });

  // INVESTOR INFO
  const [fundingRange, setFundingRange] = useState([0, 0]);
  const [manual, setManual] = useState({ min: 0, max: 0 });

  // Fetching User From API
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`/api/profile/${userName}`);
      if (!res.ok) return;

      const data = await res.json();
      setUser(data.user);
    }
    fetchUser();
  }, [userName]);

  // Applying user data to all fields
  useEffect(() => {
    if (!user) return;

    // BASIC INFO
    setBasicInfo({
      userName: user.userName ?? "",
      name: user.name ?? "",
      email: user.email ?? "",
      profileImage: user.profileImage ?? "",
      bio: user.bio ?? "",
      phone: user.phone ?? "",
    });

    // LOCATION
    setLocation({
      country: user.country ?? "",
      city: user.city ?? "",
    });

    // FOUNDER INFO
    setFounder({
      experiences: [{
        designation: user.designation ?? "",
        expStart: user.expStart ? new Date(user.expStart) : new Date(),
        expEnd: user.expEnd ? new Date(user.expEnd) : new Date(),
        company: user.company ?? "",
        experienceDesc: user.experienceDesc ?? "",
      }],
      skills: user.skills ?? [],
    });

    // INVESTOR INFO
    const min = user.fundingMin ?? 10;
    const max = user.fundingMax ?? 70;

    setFundingRange([min, max]);
    setManual({ min, max });
  }, [user]);

  // Keeping manual input synced
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reload
    setIsUpdating(true);

    try {
      // Prepare the data according to your schema
      const updateData = {
        userName: basicInfo.userName,
        name: basicInfo.name,
        phone: basicInfo.phone,
        bio: basicInfo.bio,
        profileImage: basicInfo.profileImage,
        city: location.city,
        country: location.country,
        // Founder info
        experiences: founder.experiences,
        skills: founder.skills,
        fundingRange: { min: fundingRange[0], max: fundingRange[1] },
      };

      // Validate data with Zod
      const parsed = updateUserSchema.parse(updateData);

      // Make PUT request
      const res = await fetch(`/api/profile/${basicInfo.userName}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || "Failed to update profile");
      } else {
        toast.success("Profile updated successfully");
      }
    } catch (err: any) {
      if (err?.issues) {
        // Zod validation errors
        toast.error(err.issues.map((i: any) => i.message).join(", "));
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddExperience = () => {
    setFounder((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          designation: "",
          expStart: new Date(),
          expEnd: new Date(),
          company: "",
          experienceDesc: "",
        },
      ],
    }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-semibold text-primary">Edit Profile</h1>

      {/* PROFILE IMAGE */}
      <div className="flex items-center gap-6">
        {basicInfo.profileImage ? (
          <Image
            src={basicInfo.profileImage}
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
            {basicInfo.userName.charAt(0).toUpperCase()}
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
            value={basicInfo.userName}
            onChange={(e) => setBasicInfo({ ...basicInfo, userName: e.target.value })}
          />

          <FloatingLabelInput
            id="fullName"
            label="Full Name"
            value={basicInfo.name}
            onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
          />

          <FloatingLabelInput
            id="email"
            label="Email"
            disabled
            value={basicInfo.email}
            className="bg-muted opacity-70"
          />

          <FloatingPhoneInput
            label="Phone"
            value={basicInfo.phone}
            onChange={(val) => setBasicInfo({ ...basicInfo, phone: val })}
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
          value={basicInfo.bio}
          onChange={(e) => setBasicInfo({ ...basicInfo, bio: e.target.value })}
        />
      </section>

      {/* FOUNDER INFO */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-foreground">Founder Information</h2>

        {/* Experience Taker */}
        {founder.experiences.map((exp, index) => (
          <div key={index} className="space-y-4">
              <FloatingLabelInput
              id={`designation-${index}`}
              label="Designation"
              value={exp.designation}
              onChange={(e) => {
                const newExps = [...founder.experiences];
                newExps[index].designation = e.target.value;
                setFounder({ ...founder, experiences: newExps });
              }}
            />

            <div className="space-y-2 relative z-[9999]">
              <Datepicker
                value={{ startDate: exp.expStart, endDate: exp.expEnd }}
                onChange={(range) => {
                  const newExps = [...founder.experiences];
                  newExps[index].expStart = range?.startDate || new Date();
                  newExps[index].expEnd = range?.endDate || new Date();
                  setFounder({ ...founder, experiences: newExps });
                }}
                displayFormat="MM/DD/YYYY"
                separator="-"
                startFrom={exp.expStart}
                inputClassName="peer w-full border rounded-md p-2 placeholder-transparent"
              />
              <FloatingLabel
                htmlFor="experiences"
                className="absolute left-2 top-2 text-gray-500 text-sm pointer-events-none"
              >
                Experience Duration
              </FloatingLabel>
            </div>

            <FloatingLabelInput
              id={`company-${index}`}
              label="Company Name"
              value={exp.company}
              onChange={(e) => {
                const newExps = [...founder.experiences];
                newExps[index].company = e.target.value;
                setFounder({ ...founder, experiences: newExps });
              }}
            />

            <FloatingLabelInput
              id={`desc-${index}`}
              label="Experience Description"
              value={exp.experienceDesc}
              onChange={(e) => {
                const newExps = [...founder.experiences];
                newExps[index].experienceDesc = e.target.value;
                setFounder({ ...founder, experiences: newExps });
              }}
            />
          </div>
        ))}
        <Button
          type="button"
          className="cursor-pointer"
          onClick={handleAddExperience}
        >
          Add More
        </Button>

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

      {/* Update Button */}
      <Button
        type="submit"
        disabled={isUpdating}
        onSubmit={handleSave}
        className="w-full md:w-auto cursor-pointer"
      >
        {isUpdating ? (
          <>
            Saving
            <Loader className="animate-spin ml-2" />
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </div>
  );
}
