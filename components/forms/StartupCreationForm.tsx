"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Building2, 
  Upload, 
  X, 
  Plus, 
  Loader2, 
  Link as LinkIcon,
  FileText,
  ImageIcon,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
  Facebook
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { 
  startupFormSchema, 
  StartupFormData,
  INDUSTRY_OPTIONS,
  CATEGORY_TYPE_OPTIONS,
  STATUS_OPTIONS
} from '@/lib/validations/startup';
import { startupsApi } from '@/lib/api/startups';
import type { CreateStartupData, Startup } from '@/types/api';

interface StartupCreationFormProps {
  onSuccess?: () => void;
  isEdit?: boolean;
  initialData?: Startup;
}

export function StartupCreationForm({ onSuccess, isEdit = false, initialData }: StartupCreationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [pitchFileUrl, setPitchFileUrl] = useState<string>(initialData?.pitch?.[0] || '');
  const [pitchFileName, setPitchFileName] = useState<string>('');
  const [equityRanges, setEquityRanges] = useState<Array<{ range: string; equity: number }>>(
    initialData?.equityRange || []
  );
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState<string>(initialData?.profilePic || '');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      categoryType: initialData?.categoryType || '',
      industry: initialData?.industry || '',
      status: initialData?.status || 'active',
      socialLinks: {
        website: initialData?.socialLinks?.website || '',
        linkedin: initialData?.socialLinks?.linkedin || '',
        twitter: initialData?.socialLinks?.twitter || '',
        x: initialData?.socialLinks?.x || '',
        instagram: initialData?.socialLinks?.instagram || '',
        facebook: initialData?.socialLinks?.facebook || '',
      },
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'pitch');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setPitchFileUrl(result.data.url);
        setPitchFileName(file.name);
      } else {
        alert(result.message || 'Failed to upload file');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleProfilePicUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingProfilePic(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'profile');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setProfilePicUrl(result.data.url);
      } else {
        alert(result.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingProfilePic(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Prepare the submission data
      const submissionData = {
        ...data,
        pitch: pitchFileUrl ? [pitchFileUrl] : [],
        profilePic: profilePicUrl || '',
        equityRange: equityRanges.filter(range => range.range.trim() !== ''),
        // Clean up empty social links
        socialLinks: Object.fromEntries(
          Object.entries(data.socialLinks || {}).filter(([_, value]) => 
            typeof value === 'string' && value.trim() !== ''
          )
        ),
      };

      const response = isEdit && initialData?._id 
        ? await startupsApi.update(initialData._id, submissionData)
        : await startupsApi.create(submissionData);

      if (response.success) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/founder/startups');
        }
      } else {
        alert(response.message || `Failed to ${isEdit ? 'update' : 'create'} startup`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Failed to ${isEdit ? 'update' : 'create'} startup`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Startup Title *</Label>
              <Input
                id="title"
                placeholder="Enter your startup name"
                {...register('title')}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryType">Category Type *</Label>
              <Select
                value={watch('categoryType')}
                onValueChange={(value) => setValue('categoryType', value)}
              >
                <SelectTrigger className={errors.categoryType ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select category type" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_TYPE_OPTIONS.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryType && (
                <p className="text-sm text-destructive">{errors.categoryType.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Select
                value={watch('industry')}
                onValueChange={(value) => setValue('industry', value)}
              >
                <SelectTrigger className={errors.industry ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRY_OPTIONS.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-destructive">{errors.industry.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch('status')}
                onValueChange={(value) => setValue('status', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your startup, its mission, and what makes it unique..."
              rows={4}
              {...register('description')}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profilePic">Profile Picture</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4">
              {profilePicUrl ? (
                <div className="flex items-center gap-4">
                  <img 
                    src={profilePicUrl} 
                    alt="Profile preview" 
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-success">Image uploaded successfully</p>
                    <p className="text-xs text-muted-foreground">Click to change image</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setProfilePicUrl('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <div>
                    <Label htmlFor="profilePicFile" className="cursor-pointer">
                      <span className="text-sm font-medium text-primary hover:text-primary/80">
                        {uploadingProfilePic ? 'Uploading...' : 'Click to upload'}
                      </span>
                      <span className="text-sm text-muted-foreground"> or drag and drop</span>
                    </Label>
                    <Input
                      id="profilePicFile"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicUpload}
                      disabled={uploadingProfilePic}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG, WebP, or GIF (max 5MB)
                  </p>
                  {uploadingProfilePic && (
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Uploading...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pitch Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Pitch Presentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              {pitchFileUrl ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-6 w-6 text-success" />
                  <span className="text-sm font-medium text-success">
                    {pitchFileName} uploaded successfully
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPitchFileUrl('');
                      setPitchFileName('');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                  <div>
                    <Label htmlFor="pitchFile" className="cursor-pointer">
                      <span className="text-sm font-medium text-primary hover:text-primary/80">
                        {uploadingFile ? 'Uploading...' : 'Click to upload'}
                      </span>
                      <span className="text-sm text-muted-foreground"> or drag and drop</span>
                    </Label>
                    <Input
                      id="pitchFile"
                      type="file"
                      accept=".ppt,.pptx,.pdf"
                      onChange={handleFileUpload}
                      disabled={uploadingFile}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    PPT, PPTX, or PDF (max 10MB)
                  </p>
                  {uploadingFile && (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Uploading...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-primary" />
            Social Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Website
              </Label>
              <Input
                id="website"
                placeholder="https://yourwebsite.com"
                {...register('socialLinks.website')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                placeholder="https://linkedin.com/company/yourcompany"
                {...register('socialLinks.linkedin')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter" className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                Twitter
              </Label>
              <Input
                id="twitter"
                placeholder="https://twitter.com/yourcompany"
                {...register('socialLinks.twitter')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="x" className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                X (formerly Twitter)
              </Label>
              <Input
                id="x"
                placeholder="https://x.com/yourcompany"
                {...register('socialLinks.x')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram" className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                Instagram
              </Label>
              <Input
                id="instagram"
                placeholder="https://instagram.com/yourcompany"
                {...register('socialLinks.instagram')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook" className="flex items-center gap-2">
                <Facebook className="h-4 w-4" />
                Facebook
              </Label>
              <Input
                id="facebook"
                placeholder="https://facebook.com/yourcompany"
                {...register('socialLinks.facebook')}
              />
            </div>
          </div>
        </CardContent>
      </Card>



      {/* Equity Ranges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Equity Ranges
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {equityRanges.map((range, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Range (e.g., Series A)"
                  value={range.range}
                  onChange={(e) => {
                    const newRanges = [...equityRanges];
                    newRanges[index].range = e.target.value;
                    setEquityRanges(newRanges);
                  }}
                />
                <Input
                  type="number"
                  placeholder="Equity %"
                  min="0"
                  max="100"
                  value={range.equity}
                  onChange={(e) => {
                    const newRanges = [...equityRanges];
                    newRanges[index].equity = Number(e.target.value);
                    setEquityRanges(newRanges);
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newRanges = equityRanges.filter((_, i) => i !== index);
                    setEquityRanges(newRanges);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEquityRanges([...equityRanges, { range: '', equity: 0 }])}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Equity Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isEdit ? 'Updating Startup...' : 'Creating Startup...'}
            </>
          ) : (
            <>
              <Building2 className="h-4 w-4" />
              {isEdit ? 'Update Startup' : 'Create Startup'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}