"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  User, 
  Mail, 
  MapPin, 
  Globe, 
  Linkedin, 
  Twitter, 
  DollarSign,
  Save,
  Camera,
  Briefcase,
  Target
} from "lucide-react";

interface InvestorProfile {
  userName: string;
  name: string;
  email: string;
  bio: string;
  city: string;
  country: string;
  profileImage: string;
  fundingRange: {
    min: number;
    max: number;
  };
  socialLinks: {
    linkedin: string;
    twitter: string;
    website: string;
  };
  investmentFocus: string[];
  experience: string;
}

export default function InvestorProfilePage() {
  const [profile, setProfile] = useState<InvestorProfile>({
    userName: "johnsmith_investor",
    name: "John Smith",
    email: "john.smith@example.com",
    bio: "Experienced angel investor focused on early-stage tech startups. Former tech executive with 15+ years in the industry. Passionate about supporting innovative founders building the future.",
    city: "San Francisco",
    country: "United States",
    profileImage: "",
    fundingRange: {
      min: 5000,
      max: 100000,
    },
    socialLinks: {
      linkedin: "https://linkedin.com/in/johnsmith",
      twitter: "https://twitter.com/johnsmith",
      website: "https://johnsmith.com",
    },
    investmentFocus: ["Healthcare", "FinTech", "AI/ML", "Clean Energy"],
    experience: "15+ years",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {

      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsEditing(false);

    } catch (error) {
      console.error('Error saving profile:', error);
      // Show error toast here
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinksChange = (platform: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleFundingRangeChange = (type: 'min' | 'max', value: number) => {
    setProfile(prev => ({
      ...prev,
      fundingRange: {
        ...prev.fundingRange,
        [type]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Investor Profile</h1>
          <p className="text-muted-foreground">
            Manage your investor profile and investment preferences.
          </p>
        </div>
        
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isSaving}
              >
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
        <div className="lg:col-span-1">
          {/* Profile Picture & Basic Info */}
          <Card className="p-6 space-y-6">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                  {profile.profileImage ? (
                    <img 
                      src={profile.profileImage} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-16 w-16 text-primary" />
                  )}
                </div>
                {isEditing && (
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="absolute bottom-0 right-0 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <h2 className="text-xl font-semibold text-foreground">{profile.name}</h2>
              <p className="text-muted-foreground">@{profile.userName}</p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{profile.email}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{profile.city}, {profile.country}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span>{profile.experience} experience</span>
              </div>

              <div className="flex items-center space-x-2 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>${profile.fundingRange.min.toLocaleString()} - ${profile.fundingRange.max.toLocaleString()}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Connect</h3>
              <div className="flex space-x-2">
                {profile.socialLinks.linkedin && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {profile.socialLinks.twitter && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {profile.socialLinks.website && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={profile.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={profile.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>
          </Card>

          {/* Investment Preferences */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Investment Preferences</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="min-funding">Minimum Investment ($)</Label>
                <Input
                  id="min-funding"
                  type="number"
                  value={profile.fundingRange.min}
                  onChange={(e) => handleFundingRangeChange('min', Number(e.target.value))}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-funding">Maximum Investment ($)</Label>
                <Input
                  id="max-funding"
                  type="number"
                  value={profile.fundingRange.max}
                  onChange={(e) => handleFundingRangeChange('max', Number(e.target.value))}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Investment Experience</Label>
                <Select
                  value={profile.experience}
                  onValueChange={(value) => handleInputChange('experience', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-2 years">0-2 years</SelectItem>
                    <SelectItem value="3-5 years">3-5 years</SelectItem>
                    <SelectItem value="5-10 years">5-10 years</SelectItem>
                    <SelectItem value="10-15 years">10-15 years</SelectItem>
                    <SelectItem value="15+ years">15+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label>Investment Focus Areas</Label>
                <div className="flex flex-wrap gap-2">
                  {["Healthcare", "FinTech", "AI/ML", "Clean Energy", "EdTech", "AgTech", "E-commerce", "SaaS", "Hardware", "Consumer"].map((focus) => (
                    <Button
                      key={focus}
                      variant={profile.investmentFocus.includes(focus) ? "default" : "outline"}
                      size="sm"
                      disabled={!isEditing}
                      onClick={() => {
                        if (isEditing) {
                          const newFocus = profile.investmentFocus.includes(focus)
                            ? profile.investmentFocus.filter(f => f !== focus)
                            : [...profile.investmentFocus, focus];
                          handleInputChange('investmentFocus', newFocus);
                        }
                      }}
                    >
                      {focus}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Social Links */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Social Links</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <Input
                  id="linkedin"
                  value={profile.socialLinks.linkedin}
                  onChange={(e) => handleSocialLinksChange('linkedin', e.target.value)}
                  disabled={!isEditing}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter Profile</Label>
                <Input
                  id="twitter"
                  value={profile.socialLinks.twitter}
                  onChange={(e) => handleSocialLinksChange('twitter', e.target.value)}
                  disabled={!isEditing}
                  placeholder="https://twitter.com/yourusername"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={profile.socialLinks.website}
                  onChange={(e) => handleSocialLinksChange('website', e.target.value)}
                  disabled={!isEditing}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}