"use client";

import { StartupCreationForm } from '@/components/forms/StartupCreationForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NewStartupPage() {
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
        <h1 className="text-3xl font-bold text-foreground">Create New Startup</h1>
        <p className="text-muted-foreground mt-2">
          Fill out the form below to create your startup profile and start connecting with investors.
        </p>
      </div>

      {/* Form */}
      <StartupCreationForm />
    </div>
  );
}