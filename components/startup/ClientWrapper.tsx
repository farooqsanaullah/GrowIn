"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import FollowableStartupProfile from "./FollowableStartupProfile";
import { Startup } from "@/lib/types/startup";
import TestMessaging from "./test-messaging";
interface Props {
  startup: Startup;
}

const ClientWrapper: React.FC<Props> = ({ startup }) => {
  return (
    <SessionProvider>
      <FollowableStartupProfile startup={startup} />
      <TestMessaging startup={startup} />
      
    </SessionProvider>
  );
};

export default ClientWrapper;
