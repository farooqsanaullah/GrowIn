"use client";

import React, { useState } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { MessageCircle, Sparkles } from "lucide-react";
import FollowableStartupProfile from "./FollowableStartupProfile";
import { Startup } from "@/lib/types/startup";
import InvestorMatchPanel from "./InvestorMatchPanel";
import OutreachGenerator from "./OutreachGenerator"; 
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
  const [showMessages, setShowMessages] = useState(false);


  const isFounderOfStartup = startup.founders?.some(
    (founder) => founder._id === session?.user?.id
  );


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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center p-4">
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
            <StartupMessages conversations={conversations} />
          </div>
        </div>
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
      <Header />
      <FollowableStartupProfile startup={startup} />
      {/* <StartupProfile startup={startup} /> */}            
      <AIMatchButton startup={startup} />
      {/* Messages Button - Only visible to founders of this startup */}
      <MessagesButton startup={startup} conversations={conversations} />
      <Footer />
    </SessionProvider>
  );
};

export default ClientWrapper;