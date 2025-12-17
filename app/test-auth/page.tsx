'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function TestAuth() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div className="p-8">
        <h1 className="text-2xl mb-4">Test Authentication</h1>
        <button
          onClick={() => signIn()}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Authenticated!</h1>
      <div className="bg-gray-100 p-4 rounded mb-4">
        <p><strong>Name:</strong> {session.user?.name}</p>
        <p><strong>Email:</strong> {session.user?.email}</p>
        <p><strong>Role:</strong> {session.user?.role}</p>
        <p><strong>ID:</strong> {session.user?.id}</p>
      </div>
      <button
        onClick={() => signOut()}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Sign Out
      </button>
    </div>
  );
}