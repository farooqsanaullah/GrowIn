"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Camera, Save, MapPin, Link as LinkIcon, DollarSign } from "lucide-react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

interface InvestorProfile {
  _id: string;
  userName: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  city: string;
  country: string;
  profileImage?: string;
  fundingRange?: {
    min: number;
    max: number;
  };
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  investmentFocus?: string[];
  experience?: string;
  createdAt?: string;
}

export default function InvestorProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { data: session } = useSession();
  const params = useParams();
  
  const [profile, setProfile] = useState<InvestorProfile | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    email: "",
    phone: "",
    bio: "",
    city: "",
    country: "",
    fundingRange: {
      min: 5000,
      max: 100000,
    },
    socialLinks: {
      linkedin: "",
      twitter: "",
      website: "",
    },
    investmentFocus: [] as string[],
    experience: "",
  });

  // Fetch investor profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile/${session?.user?.id}`);
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
            fundingRange: data.user.fundingRange || { min: 5000, max: 100000 },
            socialLinks: {
              linkedin: data.user.socialLinks?.linkedin || "",
              twitter: data.user.socialLinks?.twitter || "",
              website: data.user.socialLinks?.website || "",
            },
            investmentFocus: data.user.investmentFocus || [],
            experience: data.user.experience || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [session?.user?.id]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSocialLinksChange = (platform: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleFundingRangeChange = (field: 'min' | 'max', value: number) => {
    setFormData((prev: any) => ({
      ...prev,
      fundingRange: {
        ...prev.fundingRange,
        [field]: value
      }
    }));
  };

  const handleInvestmentFocusChange = (value: string) => {
    const focusArray = value.split(",").map(focus => focus.trim()).filter(Boolean);
    setFormData((prev: any) => ({ ...prev, investmentFocus: focusArray }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const response = await fetch(`/api/profile/${session?.user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">Manage your investor profile and preferences</p>
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
                  placeholder="Tell us about your investment philosophy and experience..."
                />
              ) : (
                <p className="text-sm text-muted-foreground">{formData.bio || "No bio provided"}</p>
              )}
            </div>
          </div>

          {/* Location & Investment Preferences */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Location & Investment Details</h2>
            
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
                <Label htmlFor="experience">Investment Experience</Label>
                {isEditing ? (
                  <Input
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => handleInputChange("experience", e.target.value)}
                    placeholder="e.g., 5+ years"
                  />
                ) : (
                  <p className="text-sm text-card-foreground font-medium">{formData.experience || "Not specified"}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Funding Range</Label>
                {isEditing ? (
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={formData.fundingRange.min}
                      onChange={(e) => handleFundingRangeChange("min", Number(e.target.value))}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={formData.fundingRange.max}
                      onChange={(e) => handleFundingRangeChange("max", Number(e.target.value))}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-card-foreground font-medium flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                    {formatCurrency(formData.fundingRange.min)} - {formatCurrency(formData.fundingRange.max)}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="investmentFocus">Investment Focus</Label>
              {isEditing ? (
                <Input
                  id="investmentFocus"
                  value={formData.investmentFocus.join(", ")}
                  onChange={(e) => handleInvestmentFocusChange(e.target.value)}
                  placeholder="Enter focus areas separated by commas (e.g., Healthcare, FinTech, AI/ML)"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {formData.investmentFocus.length > 0 ? (
                    formData.investmentFocus.map((focus, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                      >
                        {focus}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No investment focus specified</p>
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
                    value={formData.socialLinks.website}
                    onChange={(e) => handleSocialLinksChange("website", e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                ) : (
                  formData.socialLinks.website ? (
                    <p className="text-sm text-card-foreground font-medium flex items-center">
                      <LinkIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                      <a href={formData.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {formData.socialLinks.website}
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
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => handleSocialLinksChange("linkedin", e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                ) : (
                  formData.socialLinks.linkedin ? (
                    <p className="text-sm text-card-foreground font-medium">
                      <a href={formData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {formData.socialLinks.linkedin}
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
                    value={formData.socialLinks.twitter}
                    onChange={(e) => handleSocialLinksChange("twitter", e.target.value)}
                    placeholder="https://twitter.com/username"
                  />
                ) : (
                  formData.socialLinks.twitter ? (
                    <p className="text-sm text-card-foreground font-medium">
                      <a href={formData.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {formData.socialLinks.twitter}
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
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Investment Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Investment Range</span>
                <span className="text-sm text-card-foreground font-medium">
                  {formatCurrency(formData.fundingRange.min)} - {formatCurrency(formData.fundingRange.max)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Focus Areas</span>
                <span className="text-sm text-card-foreground font-medium">
                  {formData.investmentFocus.length} sectors
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Experience</span>
                <span className="text-sm text-card-foreground font-medium">
                  {formData.experience || "Not specified"}
                </span>
              </div>
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
                  90%
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


