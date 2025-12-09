"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Button,
  DualRangeSlider,
  FloatingLabelInput,
  FloatingCountryInput,
  FloatingRegionInput,
  FloatingPhoneInput,
  Skeleton,
} from "@/components/ui";
import { useSession } from "next-auth/react";
import { Loader } from "lucide-react";
import { updateUserSchema } from "@/lib/auth/zodValidation/updateUserSchema";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
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
      fundingRange: { min: 0, max: 0 },
    },
  });

  const formData = watch();

  // INVESTOR INFO
  const [fundingRange, setFundingRange] = useState([0, 0]);
  const [manual, setManual] = useState({ min: 0, max: 0 });

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

    // ---- FUNDING RANGE ----
    const min = user?.fundingRange?.min ?? 0;
    const max = user?.fundingRange?.max ?? 0;

    setFundingRange([min, max]);
    setValue("fundingRange.min", min);
    setValue("fundingRange.max", max);
  }, [user, setValue]);

  useEffect(() => {
    const [min, max] = fundingRange;

    // Update RHF values
    setValue("fundingRange.min", min);
    setValue("fundingRange.max", max);

    // Keeping manual input synced
    setManual({ min, max });
  }, [fundingRange, setValue]);

  const handleMinChange = (val: number) => {
    const min = Math.min(val, manual.max);
    setManual(prev => ({ ...prev, min }));
    setFundingRange([min, manual.max]);
  };

  const handleMaxChange = (val: number) => {
    const max = Math.max(val, manual.min);
    setManual(prev => ({ ...prev, max }));
    setFundingRange([manual.min, max]);
  };

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

      {/* Investor Specific */}
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