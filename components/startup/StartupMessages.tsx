'use client';

import { IConversation, IUser } from '@/lib/types';
import { MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface StartupMessagesProps {
  conversations: IConversation[];
}

const StartupMessages = ({ conversations }: StartupMessagesProps) => {
  const router = useRouter();

  const formatTime = (date?: string | Date) => {
    if (!date) return '';
    const now = new Date();
    const msgDate = new Date(date);
    const diffMins = Math.floor((now.getTime() - msgDate.getTime()) / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return msgDate.toLocaleDateString();
  };

  // Get the investor participant (populated) safely
  const getInvestorInfo = (conv: IConversation): IUser | undefined => {
    const participant = conv.participants.find(p => p.role === 'investor');
    const user = participant?.userId;

    // Only return if userId is populated as object
    if (user && typeof user === 'object' && 'name' in user) {
      return user as IUser;
    }

    return undefined;
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="w-7 h-7" />
            Investor Messages
          </h2>
          <p className="mt-1 text-blue-100">
            {conversations.length} active conversation
            {conversations.length !== 1 ? 's' : ''}
          </p>
        </div>

        {conversations.length === 0 ? (
          <div className="p-16 text-center text-gray-500">No messages yet.</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {conversations.map(conv => {
              const investor = getInvestorInfo(conv);
              const lastMsg = conv.lastMessage;

              return (
                <div
                  key={conv._id.toString()}
                  onClick={() => router.push(`/messages/${conv._id.toString()}`)}
                  className="p-5 cursor-pointer hover:bg-gray-100 transition-all"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {investor?.userName || investor?.name || 'Unknown Investor'}
                      </h3>
                      {lastMsg?.content && (
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {lastMsg.content}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatTime(lastMsg?.sentAt || conv.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupMessages;
