"use client";

import React, { useState } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { MessageCircle } from "lucide-react";
import FollowableStartupProfile from "./FollowableStartupProfile";
import { Startup } from "@/lib/types/startup";
// import StartupProfile from "./MessageInitiator";
import StartupMessages from "./StartupMessages"; 
import Header from "../landingpage/Header";
import Footer from "../landingpage/Footer";
import { IConversation } from "@/lib/types/index";

interface Props {
  startup: Startup;
  conversations: IConversation[];
}

const MessagesButton: React.FC<{ startup: Startup, conversations: IConversation[] }> = ({ startup, conversations }) => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const isFounder = startup.founders?.some(
    f => f._id === session?.user?.id
  );

  if (!isFounder) return null;


  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 p-4 rounded-full shadow-xl hover:scale-110 transition-all"
        style={{
          background:
            'linear-gradient(135deg, #60a5fa, #a78bfa)',
          color: 'white',
        }}
      >
        <MessageCircle className="w-6 h-6" />
        Messages
      </button>

      <StartupMessages
        conversations={conversations}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

const ClientWrapper: React.FC<Props> = ({ startup, conversations }) => {
  return (
    <SessionProvider>
      <Header />
      <FollowableStartupProfile startup={startup} />
      {/* <StartupProfile startup={startup} /> */}
      
      {/* Messages Button - Only visible to founders of this startup */}
      <MessagesButton startup={startup} conversations={conversations} />
      <Footer />
    </SessionProvider>
  );
};

export default ClientWrapper;