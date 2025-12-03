"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Button,
  SkillsInput,
  FloatingLabelInput,
  FloatingCountryInput,
  FloatingRegionInput,
  FloatingPhoneInput,
  FloatingLabel,
  Skeleton,
} from "@/components/ui";
import Datepicker from "react-tailwindcss-datepicker";
import "flowbite/dist/flowbite.css";
import { useParams } from "next/navigation";
import { Loader } from "lucide-react";
import { UpdateUserSchema } from "@/lib/auth/zodSchemas";
import toast from "react-hot-toast";
import { isExperienceEmpty } from "@/lib/helpers/shared";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function EditProfilePage() {
  const params = useParams();
  const userName = params.userName;
  const [user, setUser] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const { control, register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      userName: "",
      name: "",
      email: "",
      profileImage: "",
      bio: "",
      phone: "",
      country: "",
      city: "",
      experiences: [
        {
          designation: "",
          company: "",
          experienceDesc: "",
          startDate: new Date(),
          endDate: new Date(),
        },
      ],
      skills: [] as string[],
    },
  });

  const { fields: experiencesFields, append, remove, update } = useFieldArray({
    control,
    name: "experiences",
  });

  const formData = watch();

  // Fetching User From API
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`/api/profile/${userName}`, {
        method: "GET",
      });
      if (!res.ok) return;

      const data = await res.json();
      setUser(data.user);
    }
    fetchUser();
  }, [userName]);

  // Populate form when user data arrives
  useEffect(() => {
    if (!user) return;

    setValue("userName", user.userName ?? "");
    setValue("name", user.name ?? "");
    setValue("email", user.email ?? "");
    setValue("profileImage", user.profileImage ?? "");
    setValue("bio", user.bio ?? "");
    setValue("phone", user.phone ?? "");
    setValue("country", user.country ?? "");
    setValue("city", user.city ?? "");
    setValue("experiences", [
      {
        designation: user.designation ?? "",
        startDate: user.startDate ? new Date(user.startDate) : new Date(),
        endDate: user.endDate ? new Date(user.endDate) : new Date(),
        company: user.company ?? "",
        experienceDesc: user.experienceDesc ?? "",
      },
    ]);
    setValue("skills", user.skills ?? []);
  }, [user, setValue]);

  const onSubmit = async (data: any) => {
    console.log("Form submiting with data: ", data);
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/profile/${data.userName}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || "Failed to update profile");
      } else {
        toast.success("Profile updated successfully");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddExperience = () => {
    const lastExp = experiencesFields[experiencesFields.length - 1];

    // Preventing to add a new empty field set
    if (isExperienceEmpty(lastExp)) {
      toast.error("Fill the current experience first.");
      return;
    }

    append({
      designation: "",
      startDate: new Date(),
      endDate: new Date(),
      company: "",
      experienceDesc: "",
    });
  };

  const handleRemoveExperience = (index: number) => remove(index);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-semibold text-primary">Edit Profile</h1>

      {/* PROFILE IMAGE */}
      <div className="flex items-center gap-6">
        {formData.profileImage ? (
          <Image
            src={formData.profileImage}
            alt="Profile"
            width={90}
            height={90}
            className="rounded-full border transition-opacity duration-300 opacity-0"
            onLoadingComplete={(img) => (img.style.opacity = "1")}
          />
        ) : (
          <Skeleton className="w-[90px] h-[90px] rounded-full" />
        )}

        <Button className="cursor-pointer" variant="secondary">
          Change Photo
        </Button>
      </div>

      {/* BASIC INFO */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FloatingLabelInput id="username" label="Username" {...register("userName")} />

          <FloatingLabelInput id="fullName" label="Full Name" {...register("name")} />

          <FloatingLabelInput
            id="email"
            label="Email"
            disabled
            className="bg-muted opacity-70"
            {...register("email")}
          />

          <FloatingPhoneInput
            label="Phone"
            value={formData?.phone || ""}
            onChange={(val) => setValue("phone", val)}
          />

          <FloatingCountryInput
            label="Country"
            value={formData?.country || ""}
            onChange={(val) => {
              setValue("country", val);
              setValue("city", "");
            }}
          />

          <FloatingRegionInput
            label="City"
            country={formData?.country || ""}
            value={formData?.city || ""}
            onChange={(val) => setValue("city", val)}
          />
        </div>

        <FloatingLabelInput id="bio" label="Bio" {...register("bio")} />
      </section>

      {/* Founder Specific */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-foreground">Experiences</h2>

        {/* Ribbon for previous experiences */}
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 shadow-sm">
          {experiencesFields.slice(0, -1).map((exp, index) => (
            <div
              key={exp.id}
              className="p-3 rounded bg-gray-100 border flex justify-between items-start"
            >
              <div>
                <p className="font-semibold">{exp.designation}</p>
                <p>{exp.company}</p>
                <p>
                  {exp.startDate?.toString().slice(0, 15)} - {exp.endDate?.toString().slice(0, 15)}
                </p>
              </div>
              {/* Remove button */}
              <Button
                type="button"
                variant="outline"
                onClick={() => handleRemoveExperience(index)}
                className="border-none text-destructive hover:text-background hover:bg-destructive/60 cursor-pointer"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        {/* Editable inputs for last experience */}
        {experiencesFields.slice(-1).map((exp, index) => (
          <div key={exp.id} className="space-y-4">
            {/* Designation */}
            <FloatingLabelInput
              id="designation"
              label="Designation"
              value={exp.designation}
              onChange={(e) => update(index, { ...exp, designation: e.target.value })}
            />

            {/* Duration */}
            <div className="space-y-2 relative z-[9999]">
              <Datepicker
                value={{ startDate: exp.startDate, endDate: exp.endDate }}
                onChange={(range) =>
                  update(index, {
                    ...exp,
                    startDate: range?.startDate || new Date(),
                    endDate: range?.endDate || new Date(),
                  })
                }
                displayFormat="MM/DD/YYYY"
                separator="-"
                startFrom={exp.startDate}
                inputClassName="peer w-full rounded-md border border-input h-9 text-sm cursor-pointer"
              />
              <FloatingLabel
                htmlFor="experiences"
                className="bg-background absolute left-2 top-2 text-gray-500 text-sm pointer-events-none"
              >
                Experience Duration
              </FloatingLabel>
            </div>

            {/* Company Name */}
            <FloatingLabelInput
              id="company"
              label="Company Name"
              value={exp.company}
              onChange={(e) => update(index, { ...exp, company: e.target.value })}
            />

            {/* Experience Description */}
            <FloatingLabelInput
              id="desc"
              label="Experience Description"
              value={exp.experienceDesc}
              onChange={(e) => update(index, { ...exp, experienceDesc: e.target.value })}
            />
          </div>
        ))}

        {/* Add New Field Button */}
        <div className="flex justify-end">
          <Button type="button" variant="ghost" className="cursor-pointer" onClick={handleAddExperience}>
            Add New Field
          </Button>
        </div>

        {/* Skills */}
        <SkillsInput skills={formData?.skills || []} setSkills={(val) => setValue("skills", val)} />
      </section>

      {/* Update Button */}
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isUpdating} 
          className="w-full md:w-auto cursor-pointer">
          {isUpdating ? (
            <>Saving<Loader className="animate-spin ml-2" /></>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
