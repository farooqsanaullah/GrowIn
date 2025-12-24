import ClientExplore from "@/components/explore/ClientExplore";
import { Startup } from "@/lib/types/startup";


export const dynamic = 'force-dynamic';

const fetchStartups = async (query: string): Promise<Startup[]> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/startups?limit=7${query}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch startups: ${res.status}`);
    const data = await res.json();
    return data?.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const colors = {
  bgPrimary: '#D6F6FE',
  bgSecondary: '#FEE8BD',
  textPrimary: '#16263d',
  textSecondary: '#65728d',
  textMuted: '#657da8'
};

export default async function ExplorePage() {
  const [trending, funded, active] = await Promise.all([
    fetchStartups('&badges=Trending'),
    fetchStartups('&badges=Funded'),
    fetchStartups('&status=active'),
  ]);

  return (
    
    <div>
      
    <div className="bg-gray-50 min-h-screen pt-20"
      style={{
          background: `linear-gradient(135deg, ${colors.bgPrimary}, ${colors.bgSecondary})`,
        }}
    >
      <div className="p-4 sm:p-6 md:p-8">
        <h1 className="text-xl sm:text-xl md:text-2xl font-bold mb-4 md:mx-20 sm:mx-4 text-center sm:text-left">
          Invest in Innovation, Grow Together.
        </h1>

        {trending.length || funded.length || active.length ? (
          <ClientExplore trending={trending} funded={funded} active={active} />
        ) : (
          <p className="text-center text-red-600">Failed to load startups. Please try again later.</p>
        )}
      </div>
    </div>

    </div>
  );
}
