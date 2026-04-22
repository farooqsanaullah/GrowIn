"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Loader } from "lucide-react";
import { getInitials } from "@/lib/helpers";

interface AdminCardProps {
  id: string;
  name?: string;
  userName: string;
  profileImage?: string;
  city?: string;
  country?: string;
  status: "active" | "inactive";
  count: number;
  countLabel: string; // e.g., "investments" or "startups"
  skills?: string[];
  updatingId?: string | null;
  onToggleStatus: (id: string, status: "active" | "inactive") => void;
}

export const AdminCard = ({
  id,
  name,
  userName,
  profileImage,
  city,
  country,
  status,
  count,
  countLabel,
  skills,
  updatingId,
  onToggleStatus,
}: AdminCardProps) => {
  return (
    <Card className="relative p-4 hover:shadow-lg transition flex flex-col gap-3">
      {/* Top: Profile Image + Badge */}
      <div className="relative w-full h-32 rounded-lg overflow-hidden">
        {profileImage ? (
          <img
            src={profileImage}
            alt={name || userName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center font-semibold text-foreground text-2xl">
            {getInitials(name, userName)}
          </div>
        )}

        <Badge className="absolute top-2 right-2 bg-green-50 text-green-600 rounded-sm py-1 px-3 flex items-center gap-1 shadow-sm">
          {count} {countLabel}
        </Badge>
      </div>

      {/* Name + Activate/Deactivate Button */}
      <div className="flex justify-between items-center mt-2">
        <p className="font-semibold text-lg">{name || userName}</p>
        <Button
          size="sm"
          variant={status === "active" ? "outline" : "default"}
          disabled={updatingId === id}
          className="cursor-pointer"
          onClick={() => onToggleStatus(id, status)}
        >
          {updatingId === id ? (
            <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : status === "active" ? (
            "Deactivate"
          ) : (
            "Activate"
          )}
        </Button>
      </div>

      {/* Optional Skills */}
      {skills && skills.length > 0 && (
        <details className="mt-1">
          <summary className="cursor-pointer text-sm text-muted-foreground">
            Skills ({skills.length})
          </summary>
          <div className="mt-1 flex flex-wrap gap-1">
            {skills.map((skill, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="border-blue-400 bg-blue-50 text-blue-600 rounded-sm"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </details>
      )}

      {/* Separator */}
      <div className="border-t mt-2 pt-2"></div>

      {/* Location */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        {city || country
          ? `${city ?? ""}${city && country ? ", " : ""}${country ?? ""}`
          : "Location not set"}
      </div>
    </Card>
  );
};
