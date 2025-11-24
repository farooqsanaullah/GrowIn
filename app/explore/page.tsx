// app/explore/page.tsx
import ClientExplore from "@/components/explore/ClientExplore";
import { Startup } from "@/lib/types/startup";

// Force dynamic rendering - skip build-time pre-rendering
export const dynamic = 'force-dynamic';

export default async function ExplorePage() {
  const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/startups?limit=7`;

  try {
    const [trendingRes, fundedRes, activeRes] = await Promise.all([
      fetch(`${baseUrl}&badges=Trending`, { cache: 'no-store' }).then((res) => res.json()),
      fetch(`${baseUrl}&badges=Funded`, { cache: 'no-store' }).then((res) => res.json()),
      fetch(`${baseUrl}&status=active`, { cache: 'no-store' }).then((res) => res.json()),
    ]);

    const trending: Startup[] = trendingRes.data || [];
    const funded: Startup[] = fundedRes.data || [];
    const active: Startup[] = activeRes.data || [];

    return (
      <div className="p-4 sm:p-6 md:p-8 bg-gray-50">
        <h1 className="text-xl sm:text-xl md:text-2xl font-bold mb-4 md:mx-20 sm:mx-4 text-center sm:text-left">
          Invest in Innovation, Grow Together.
        </h1>

        <ClientExplore trending={trending} funded={funded} active={active} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching startups:', error);
    return (
      <div className="p-4 sm:p-6 md:p-8 bg-gray-50">
        <h1 className="text-xl sm:text-xl md:text-2xl font-bold mb-4 md:mx-20 sm:mx-4 text-center sm:text-left">
          Invest in Innovation, Grow Together.
        </h1>
        <p className="text-center text-red-600">Failed to load startups. Please try again later.</p>
      </div>
    );
  }
}