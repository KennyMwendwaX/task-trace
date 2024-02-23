import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Footer from "@/components/home/Footer";
import { auth } from "@/auth";

export default async function Home2() {
  const session = await auth();
  return (
    <>
      <Header session={session} />
      <Hero />
      <Features />
      <Footer />
    </>
  );
}
