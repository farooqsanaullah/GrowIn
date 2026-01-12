import { getProviders } from "next-auth/react";
import SignupForm from "@/components/forms/SignupForm";

export default async function SignupPage() {
  const providers = await getProviders(); // SSR fetch

  return <SignupForm providers={providers} />;
}
