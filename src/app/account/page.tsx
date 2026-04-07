import { AccountPage } from "../pages/AccountPage";
import { redirect } from "next/navigation";
import { getAuthToken } from "../lib/auth/session";

export default async function Page() {
  const token = await getAuthToken();
  if (!token) {
    redirect("/login?next=/account");
  }
  return <AccountPage />;
}

