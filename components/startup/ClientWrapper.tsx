"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import FollowableStartupProfile from "./FollowableStartupProfile";
import { Startup } from "@/types/startup";

interface Props {
  startup: Startup;
}

const ClientWrapper: React.FC<Props> = ({ startup }) => {
  return (
    <SessionProvider>
      <FollowableStartupProfile startup={startup} />
    </SessionProvider>
  );
};

export default ClientWrapper;
