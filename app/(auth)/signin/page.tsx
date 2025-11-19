import { getProviders } from "next-auth/react";
import SigninForm from "@/components/forms/SigninForm";

export default async function SigninPage() {
  const providers = await getProviders(); // SSR fetch

  return <SigninForm providers={providers} />;
}
