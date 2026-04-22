export default function CancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex flex-col items-center gap-4 p-10 bg-white dark:bg-black rounded-md shadow-md">
        <h1 className="text-2xl font-semibold text-red-600">
          Payment Canceled ❌
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          Your transaction was not completed.
        </p>

        <a
          href="/"
          className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-black/80"
        >
          Try Again
        </a>
      </main>
    </div>
  );
}
