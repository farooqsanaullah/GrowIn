"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";
import { Startup } from "@/lib/types/startup";

interface Props {
  startup: Startup;
  onRatingUpdate?: (avgRating: number, ratingCount: number) => void; // optional callback to update parent state
}

const ReviewStars: React.FC<Props> = ({ startup, onRatingUpdate }) => {
  const { data: session } = useSession();
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch current user rating on mount
  useEffect(() => {
    const fetchUserRating = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch(`/api/startups/${startup._id}/review`);
        const data = await res.json();
        if (data.success && data.review) {
          setUserRating(data.review.rating);
        }
      } catch (err) {
        console.error("Failed to fetch user review:", err);
      }
    };

    fetchUserRating();
  }, [session?.user?.id, startup._id]);

  const handleRating = async (rating: number) => {
    if (!session?.user?.id) return alert("Please login first");

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/startups/${startup._id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });

      const data = await res.json();

      if (data.success) {
        setUserRating(rating);
        // optionally update parent component's state
        if (onRatingUpdate) onRatingUpdate(data.avgRating, data.ratingCount);
      } else {
        alert(data.message || "Failed to submit rating");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while submitting rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl p-6 shadow-md bg-gray-50">
      <h3 className="text-xl font-semibold mb-3 text-center">Rate this Startup</h3>
      <div className="flex gap-2 justify-center mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={28}
            onClick={() => handleRating(star)}
            className={`cursor-pointer transition ${
              userRating && star <= userRating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 hover:text-yellow-400"
            } ${isSubmitting ? "pointer-events-none opacity-50" : ""}`}
          />
        ))}
      </div>
      {userRating && (
        <p className="text-sm text-center">
          You rated this {userRating} star{userRating > 1 ? "s" : ""}.
        </p>
      )}
    </div>
  );
};

export default ReviewStars;
