import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth/nextAuthOptions";
import { SessionUser, UserRole } from '@/lib/types/index';

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id as string,
    role: session.user.role as UserRole,
    email: session.user.email as string,
    name: session.user.name as string,
  };
}

export function validateRoles(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}

export function canInitiateConversation(initiatorRole: UserRole, recipientRole: UserRole): boolean {
  // Only investors can initiate conversations with founders
  if (recipientRole === 'founder') {
    return initiatorRole === 'investor';
  }
  
  // Team members can chat with each other freely
  return true;
}