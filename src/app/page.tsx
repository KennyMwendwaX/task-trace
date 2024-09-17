import Header from "@/components/home/header";
import Hero from "@/components/home/hero";
import Features from "@/components/home/features";
import Footer from "@/components/home/footer";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <>
      <Header session={session} />
      <Hero />
      {/* <Features /> */}
      <Footer />
    </>
  );
}
