'use client';

import { IConversation, IUser } from '@/lib/types';
import { MessageCircle, X } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface StartupMessagesProps {
  conversations: IConversation[];
  isOpen: boolean;
  onClose: () => void;
}

const StartupMessages = ({
  conversations,
  isOpen,
  onClose,
}: StartupMessagesProps) => {
  const router = useRouter();

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatTime = (date?: string | Date) => {
    if (!date) return '';
    const now = new Date();
    const msgDate = new Date(date);
    const diff = Math.floor(
      (now.getTime() - msgDate.getTime()) / 60000
    );

    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return msgDate.toLocaleDateString();
  };

  const getInvestorInfo = (conv: IConversation): IUser | undefined => {
    const p = conv.participants.find(p => p.role === 'investor');
    const u = p?.userId;
    if (u && typeof u === 'object' && 'name' in u) return u as IUser;
    return u as IUser | undefined;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-3xl rounded-2xl shadow-2xl animate-slideUp"
          style={{ backgroundColor: 'var(--bg-primary)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-black/10">
            <div className="flex items-center gap-3">
              <div
                className="p-3 rounded-full"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <MessageCircle
                  className="w-6 h-6"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <h2
                  className="text-xl font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Investor Messages
                </h2>
                <p
                  className="text-sm"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {conversations.length} conversation
                  {conversations.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/10"
            >
              <X />
            </button>
          </div>

          {/* Messages */}
          <div className="max-h-[65vh] overflow-y-auto">
            {conversations.length === 0 ? (
              <div
                className="p-12 text-center"
                style={{ color: 'var(--text-secondary)' }}
              >
                No messages yet
              </div>
            ) : (
              conversations.map(conv => {
                const investor = getInvestorInfo(conv);
                const lastMsg = conv.lastMessage;

                return (
                  <div
                    key={conv._id.toString()}
                    onClick={() => {
                      onClose();
                      router.push(`/messages/${conv._id}`);
                    }}
                    className="p-5 cursor-pointer transition hover:bg-white/60"
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3
                          className="font-semibold"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {investor?.email ||
                            investor?.name ||
                            'Unknown Investor'}
                        </h3>
                        {lastMsg?.content && (
                          <p
                            className="text-sm mt-1 line-clamp-2"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {lastMsg.content}
                          </p>
                        )}
                      </div>
                      <span
                        className="text-xs whitespace-nowrap"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {formatTime(
                          lastMsg?.sentAt || conv.createdAt
                        )}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StartupMessages;
