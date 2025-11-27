"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Camera, Save, MapPin, Link as LinkIcon } from "lucide-react";
import { useParams } from "next/navigation";

interface UserProfile {
  _id: string;
  userName: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  city: string;
  country: string;
  skills?: string[];
  profileImage?: string;
  designation?: string;
  company?: string;
  experiences?: any[];
  createdAt?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const params = useParams();
  const username = params.username as string;
  
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    email: "",
    phone: "",
    bio: "",
    city: "",
    country: "",
    skills: [] as string[],
    designation: "",
    company: "",
    website: "",
    linkedin: "",
    twitter: "",
  });

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile/${username}`);
        if (response.ok) {
          const data = await response.json();
          setProfile(data.user);
          setFormData({
            name: data.user.name || "",
            userName: data.user.userName || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            bio: data.user.bio || "",
            city: data.user.city || "",
            country: data.user.country || "",
            skills: data.user.skills || [],
            designation: data.user.designation || "",
            company: data.user.company || "",
            website: data.user.socialLinks?.website || "",
            linkedin: data.user.socialLinks?.linkedin || "",
            twitter: data.user.socialLinks?.twitter || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSkillsChange = (value: string) => {
    const skillsArray = value.split(",").map(skill => skill.trim()).filter(Boolean);
    setFormData((prev: any) => ({ ...prev, skills: skillsArray }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    console.log("Saving profile:", formData);
    
    try {
      const updateData = {
        name: formData.name,
        userName: formData.userName,
        phone: formData.phone,
        bio: formData.bio,
        city: formData.city,
        country: formData.country,
        skills: formData.skills,
        designation: formData.designation,
        company: formData.company,
        socialLinks: {
          website: formData.website,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
        }
      };

      const response = await fetch(`/api/profile/${username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setProfile(updatedData.user);
        setIsEditing(false);
        console.log("Profile saved successfully:", updatedData);
      } else {
        const error = await response.json();
        console.error("Error saving profile:", error);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and public profile</p>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Basic Information</h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                ) : (
                  <p className="text-sm text-card-foreground font-medium">{formData.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="userName">Username</Label>
                {isEditing ? (
                  <Input
                    id="userName"
                    value={formData.userName}
                    onChange={(e) => handleInputChange("userName", e.target.value)}
                  />
                ) : (
                  <p className="text-sm text-card-foreground font-medium">@{formData.userName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <p className="text-sm text-card-foreground font-medium">{formData.email}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                ) : (
                  <p className="text-sm text-card-foreground font-medium">{formData.phone || "Not provided"}</p>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="bio">Bio</Label>
              {isEditing ? (
                <Textarea
                  id="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-sm text-muted-foreground">{formData.bio || "No bio provided"}</p>
              )}
            </div>
          </div>

          {/* Location & Experience */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Location & Experience</h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                {isEditing ? (
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                ) : (
                  <p className="text-sm text-card-foreground font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    {formData.city || "Not specified"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                {isEditing ? (
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                  />
                ) : (
                  <p className="text-sm text-card-foreground font-medium">{formData.country || "Not specified"}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation">Current Position</Label>
                {isEditing ? (
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) => handleInputChange("designation", e.target.value)}
                  />
                ) : (
                  <p className="text-sm text-card-foreground font-medium">{formData.designation || "Not specified"}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                {isEditing ? (
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                  />
                ) : (
                  <p className="text-sm text-card-foreground font-medium">{formData.company || "Not specified"}</p>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="skills">Skills</Label>
              {isEditing ? (
                <Input
                  id="skills"
                  value={formData.skills.join(", ")}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                  placeholder="Enter skills separated by commas"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.length > 0 ? (
                    formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No skills listed</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Social Links</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                {isEditing ? (
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                ) : (
                  formData.website ? (
                    <p className="text-sm text-card-foreground font-medium flex items-center">
                      <LinkIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                      <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {formData.website}
                      </a>
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">No website provided</p>
                  )
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                {isEditing ? (
                  <Input
                    id="linkedin"
                    value={formData.linkedin}
                    onChange={(e) => handleInputChange("linkedin", e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                ) : (
                  formData.linkedin ? (
                    <p className="text-sm text-card-foreground font-medium">
                      <a href={formData.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {formData.linkedin}
                      </a>
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">No LinkedIn provided</p>
                  )
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                {isEditing ? (
                  <Input
                    id="twitter"
                    value={formData.twitter}
                    onChange={(e) => handleInputChange("twitter", e.target.value)}
                    placeholder="https://twitter.com/username"
                  />
                ) : (
                  formData.twitter ? (
                    <p className="text-sm text-card-foreground font-medium">
                      <a href={formData.twitter} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {formData.twitter}
                      </a>
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">No Twitter provided</p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Profile Photo</h3>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {profile.profileImage ? (
                  <img 
                    src={profile.profileImage} 
                    alt={profile.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                )}
                {isEditing && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute -bottom-1 -right-1 rounded-full h-8 w-8"
                  >
                    <Camera className="h-3 w-3" />
                  </Button>
                )}
              </div>
              {isEditing && (
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
              )}
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email Verified</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Verified
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Profile Complete</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  85%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm text-card-foreground font-medium">
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}