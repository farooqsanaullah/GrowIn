"use client";

import React, { useState } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { MessageCircle } from "lucide-react";
import FollowableStartupProfile from "./FollowableStartupProfile";
import { Startup } from "@/lib/types/startup";
import TestMessaging from "./test-messaging";
import StartupMessages from "./StartupMessages"; 

interface Props {
  startup: Startup;
}

const MessagesButton: React.FC<{ startup: Startup }> = ({ startup }) => {
  const { data: session } = useSession();
  const [showMessages, setShowMessages] = useState(false);

  // Check if current user is a founder of this startup
  const isFounderOfStartup = startup.founders?.some(
    (founder) => founder._id === session?.user?.id
  );

  // Only show messages button to founders of this startup
  if (!isFounderOfStartup) {
    return null;
  }

  return (
    <>
      {/* Floating Messages Button */}
      <button
        onClick={() => setShowMessages(!showMessages)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-50 flex items-center gap-2"
        aria-label="Toggle messages"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="font-semibold">Messages</span>
      </button>

      {/* Messages Modal/Panel */}
      {showMessages && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl max-h-[90vh] overflow-auto">
            <button
              onClick={() => setShowMessages(false)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
              aria-label="Close messages"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <StartupMessages startupId={startup._id} />
          </div>
        </div>
      )}
    </>
  );
};

const ClientWrapper: React.FC<Props> = ({ startup }) => {
  return (
    <SessionProvider>
      <FollowableStartupProfile startup={startup} />
      <TestMessaging startup={startup} />
      
      {/* Messages Button - Only visible to founders of this startup */}
      <MessagesButton startup={startup} />
    </SessionProvider>
  );
};

export default ClientWrapper;