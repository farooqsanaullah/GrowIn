import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
      <p className="mt-2 text-gray-600">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Link href="/" className="mt-4 text-blue-600 underline">
        Go back home
      </Link>
    </div>
  );
}
