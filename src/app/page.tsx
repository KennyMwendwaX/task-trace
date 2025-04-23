import Header from "@/app/components/home/header";
import Hero from "@/app/components/home/hero";
import Features from "@/app/components/home/features";
import Footer from "@/app/components/home/footer";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header session={session} />
      <main className="flex-grow">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
