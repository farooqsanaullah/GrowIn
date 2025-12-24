import InvestorsExploreClient from "@/components/explore/InvestorsExploreClient";

export const revalidate = 60;

export default async function ExploreInvestorsPage() {
  let initialInvestors: any[] = [];
  let initialCities: string[] = [];
  let initialCountries: string[] = [];
  let initialTotalPages = 1;

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/investors?limit=12&page=1`
    const res = await fetch(url, {
      next: { revalidate },
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.success && data?.data) {
        initialInvestors = data.data.investors || [];
        initialTotalPages = data.data.pagination?.pages || 1;
        if (data.data.filters) {
          initialCities = data.data.filters.cities || [];
          initialCountries = data.data.filters.countries || [];
        }
      }
    }
  } catch (err) {
    // Swallow network errors during build/prerender; show empty state
  }

  return (
    <div>
      <div className="space-y-6 container mx-auto px-4 pt-38 pb-12">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Explore Investors</h1>
            <p className="text-muted-foreground">Connect with investors looking for promising startups</p>
          </div>
        </div>

        <InvestorsExploreClient
          initialInvestors={initialInvestors}
          initialCities={initialCities}
          initialCountries={initialCountries}
          initialTotalPages={initialTotalPages}
        />
      </div>
    </div>
  );
}