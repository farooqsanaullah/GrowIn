"use client";

import React, { useState } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { MessageCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import FollowableStartupProfile from "./FollowableStartupProfile";
import { Startup } from "@/lib/types/startup";
import InvestorMatchPanel from "./InvestorMatchPanel";
import OutreachGenerator from "./OutreachGenerator"; 
import StartupMessages from "./StartupMessages";
import { IConversation } from "@/lib/types/index";

interface Props {
  startup: Startup;
  conversations: IConversation[];
}

const MessagesButton: React.FC<{ startup: Startup, conversations: IConversation[] }> = ({ startup, conversations }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isStartingConversation, setIsStartingConversation] = useState(false);

  // Check if user is a founder of this startup
  const isFounder = startup.founders?.some(
    f => f._id === session?.user?.id
  );

  // Check if user is an investor
  const isInvestor = session?.user?.role === 'investor';

  // Don't show button if user is neither founder nor investor
  if (!isFounder && !isInvestor) return null;

  const handleStartConversation = async (founderId: string) => {
    if (!session?.user) {
      toast.error('Please log in to message this startup');
      return;
    }

    if (session.user.role !== 'investor') {
      toast.error('Only investors can start conversations');
      return;
    }

    setIsStartingConversation(true);

    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: founderId,
          recipientRole: 'founder',
          startupId: startup._id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to start conversation');
      }

      const data = await response.json();
      toast.success('Conversation started!');
      router.push(`/messages/${data.conversation._id}`);
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start conversation');
    } finally {
      setIsStartingConversation(false);
    }
  };

  const handleClick = () => {
    if (isFounder) {
      // Founders see their messages
      setOpen(true);
    } else if (isInvestor) {
      // Investors start a conversation with the first founder
      const firstFounder = startup.founders?.[0];
      if (firstFounder) {
        handleStartConversation(firstFounder._id);
      } else {
        toast.error('No founder found for this startup');
      }
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isStartingConversation}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 p-4 rounded-full shadow-xl hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background:
            'linear-gradient(135deg, #60a5fa, #a78bfa)',
          color: 'white',
        }}
      >
        <MessageCircle className="w-6 h-6" />
        {isStartingConversation ? 'Starting...' : 'Messages'}
      </button>

      {/* Only show messages panel for founders */}
      {isFounder && (
        <StartupMessages
          conversations={conversations}
          isOpen={open}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

const AIMatchButton: React.FC<{ startup: Startup }> = ({ startup }) => {
  const { data: session } = useSession();
  const [showMatchPanel, setShowMatchPanel] = useState(false);
  const [showOutreachGenerator, setShowOutreachGenerator] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const isFounderOfStartup = startup.founders?.some(
    (founder) => founder._id === session?.user?.id
  );

  if (!isFounderOfStartup) {
    return null;
  }

  const handleGenerateOutreach = (investorId: string, investorName: string) => {
    setSelectedInvestor({ id: investorId, name: investorName });
    setShowMatchPanel(false);
    setShowOutreachGenerator(true);
  };

  const handleCloseOutreach = () => {
    setShowOutreachGenerator(false);
    setShowMatchPanel(true);
  };

  return (
    <>
      <button
        onClick={() => setShowMatchPanel(true)}
        className="fixed bottom-24 right-6 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-50 flex items-center gap-2"
        style={{
          background: `linear-gradient(135deg, var(--text-primary), var(--text-secondary))`
        }}
        aria-label="AI Investor Match"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.15)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(22, 38, 61, 0.4)';
        }}
        onMouseLeave={(e) => {

          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(22, 38, 61, 0.25)';
        }}
      >
        <Sparkles className="w-6 h-6" />
        <span className="font-semibold">AI Match</span>
      </button>

      {/* Match Panel Modal */}
      {showMatchPanel && (
        <InvestorMatchPanel
          startupId={startup._id}
          onClose={() => setShowMatchPanel(false)}
          onGenerateOutreach={handleGenerateOutreach}
        />
      )}

      {/* Outreach Generator Modal */}
      {showOutreachGenerator && selectedInvestor && (
        <OutreachGenerator
          startupId={startup._id}
          investorId={selectedInvestor.id}
          investorName={selectedInvestor.name}
          onClose={handleCloseOutreach}
        />
      )}
    </>
  );
};

const ClientWrapper: React.FC<Props> = ({ startup, conversations }) => {
  return (
    <SessionProvider>
      <FollowableStartupProfile startup={startup} />
      <AIMatchButton startup={startup} />
      <MessagesButton startup={startup} conversations={conversations} />
      </SessionProvider>
  );
};

export default ClientWrapper;