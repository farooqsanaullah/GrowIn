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

    // RANGe INFO
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
        <h2 className="text-xl font-semibold text-foreground">Basic Information</h2>

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

      <section className="space-y-6">
        <h2 className="text-xl font-bold text-foreground">Funding Range</h2>

        <div className="flex gap-4 items-end">
          <DualRangeSlider
            label={(val) => `$${val}k`}
            value={fundingRange}
            onValueChange={setFundingRange}
            min={0}
            max={500}
            step={5}
            className="cursor-pointer"
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
      <div className="flex justify-end">
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
    </div>
  );
}
