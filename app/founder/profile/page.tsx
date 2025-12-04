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
import { useSession } from "next-auth/react";
import { Loader } from "lucide-react";
import { updateUserSchema } from "@/lib/auth/zodValidation/updateUserSchema";
import toast from "react-hot-toast";
import { isExperienceEmpty } from "@/lib/helpers/shared/validation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function EditProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { control, register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(updateUserSchema),
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
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/profile/${session.user.id}`, {
          method: "GET",
        });
        
        if (!res.ok) {
          toast.error("Failed to fetch profile");
          setIsLoading(false);
          return;
        }

        const data = await res.json();
        setUser(data.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Error fetching profile");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUser();
  }, [session?.user?.id]);

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
    
    // Handle experiences - if user has experiences, use them, otherwise start with one empty experience
    if (user.experiences && user.experiences.length > 0) {
      setValue("experiences", user.experiences.map((exp: any) => ({
        designation: exp.designation ?? "",
        startDate: exp.startDate ? new Date(exp.startDate) : new Date(),
        endDate: exp.endDate ? new Date(exp.endDate) : new Date(),
        company: exp.company ?? "",
        experienceDesc: exp.experienceDesc ?? "",
      })));
    } else {
      setValue("experiences", [
        {
          designation: user.designation ?? "",
          startDate: user.startDate ? new Date(user.startDate) : new Date(),
          endDate: user.endDate ? new Date(user.endDate) : new Date(),
          company: user.company ?? "",
          experienceDesc: user.experienceDesc ?? "",
        },
      ]);
    }
    
    setValue("skills", user.skills ?? []);
  }, [user, setValue]);

  const onSubmit = async (data: any) => {
    console.log("Form submiting with data: ", data);
    setIsUpdating(true);
    
    try {
      const res = await fetch(`/api/profile/${session?.user?.id}`, {
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
        const result = await res.json();
        toast.success("Profile updated successfully");
        setUser(result.user);
      }
    } catch (err) {
      console.error("Update error:", err);
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

  if (isLoading) {
    return (
      <div className="space-y-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please sign in to view your profile</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
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

        <Button type="button" className="cursor-pointer" variant="secondary">
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
            {...register("userName")}
          />

          <FloatingLabelInput 
            id="fullName" 
            label="Full Name" 
            {...register("name")}
          />

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

        <FloatingLabelInput 
          id="bio" 
          label="Bio" 
          {...register("bio")}
        />
      </section>

      {/* Founder Specific */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-foreground">Experiences</h2>

        {/* Ribbon for previous experiences */}
        {experiencesFields.length > 1 && (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 shadow-sm">
            {experiencesFields.slice(0, -1).map((exp, index) => (
              <div
                key={exp.id}
                className="p-3 rounded bg-gray-100 border flex justify-between items-start"
              >
                <div>
                  <p className="font-semibold">{exp.designation || "No designation"}</p>
                  <p>{exp.company || "No company"}</p>
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
        )}

        {/* Editable inputs for last experience */}
        {experiencesFields.slice(-1).map((exp, index) => {
          const realIndex = experiencesFields.length - 1;
          return (
            <div key={exp.id} className="space-y-4">
              {/* Designation */}
              <FloatingLabelInput
                id="designation"
                label="Designation"
                value={exp.designation || ""}
                onChange={(e) => update(realIndex, { ...exp, designation: e.target.value })}
              />

              {/* Duration */}
              <div className="space-y-2 relative z-10">
                <Datepicker
                  value={{ startDate: exp.startDate, endDate: exp.endDate }}
                  onChange={(range) =>
                    update(realIndex, {
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
                value={exp.company || ""}
                onChange={(e) => update(realIndex, { ...exp, company: e.target.value })}
              />

              {/* Experience Description */}
              <FloatingLabelInput
                id="desc"
                label="Experience Description"
                value={exp.experienceDesc || ""}
                onChange={(e) => update(realIndex, { ...exp, experienceDesc: e.target.value })}
              />
            </div>
          );
        })}

        {/* Add New Field Button */}
        <div className="flex justify-end">
          <Button 
            type="button" 
            variant="ghost" 
            className="cursor-pointer" 
            onClick={handleAddExperience}
          >
            Add New Field
          </Button>
        </div>

        {/* Skills */}
        <SkillsInput 
          skills={formData?.skills || []} 
          setSkills={(val) => setValue("skills", val)} 
        />
      </section>

      {/* Update Button */}
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isUpdating} 
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
    </form>
  );
}