import type { Metadata } from "next";
import HomeClient from "@/components/home-client";

// The root layout deliberately sets no canonical, so a 404 cannot inherit one.
export const metadata: Metadata = {
  alternates: { canonical: "https://www.lasvegasmahj.com" },
};

export default function Home() {
  return <HomeClient />;
}
