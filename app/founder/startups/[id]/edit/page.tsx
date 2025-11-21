"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { StartupCreationForm } from '@/components/forms/StartupCreationForm';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { startupsApi } from '@/lib/api/startups';
import type { Startup } from '@/types/api';

export default function EditStartupPage() {
  const params = useParams();
  const startupId = params.id as string;
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        setLoading(true);
        const response = await startupsApi.getById(startupId);
        
        if (response.success && response.data) {
          setStartup(response.data);
        } else {
          setError(response.message || 'Failed to load startup');
        }
      } catch (err) {
        console.error('Error fetching startup:', err);
        setError('Failed to load startup');
      } finally {
        setLoading(false);
      }
    };

    if (startupId) {
      fetchStartup();
    }
  }, [startupId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading startup...
        </div>
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/founder/startups" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Startups
            </Link>
          </Button>
        </div>

        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {error || 'Startup not found'}
          </h2>
          <p className="text-muted-foreground mb-4">
            The startup you're looking for could not be loaded.
          </p>
          <Button asChild>
            <Link href="/founder/startups">
              Back to Startups
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/founder/startups" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Startups
          </Link>
        </Button>
      </div>

      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-foreground">Edit Startup</h1>
        <p className="text-muted-foreground mt-2">
          Update your startup profile information and keep your details current for investors.
        </p>
      </div>

      {/* Form */}
      <StartupCreationForm 
        isEdit={true}
        initialData={startup}
      />
    </div>
  );
}