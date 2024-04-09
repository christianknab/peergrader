import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { createClient } from "../utils/supabase/server";
import { readUser } from "@/utils/readUser";
import { UserProvider } from "@/utils/providers/UserDataProvider";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "PeerGrader",
  description: "Grading made easy",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
 
  const appUser = user != null ? await readUser(user.id): null;
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          <UserProvider appUser={appUser}>
            {children}
          </UserProvider>
        </main>
      </body>
    </html>
  );
}
