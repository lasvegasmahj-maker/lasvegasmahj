import HomeClient from "@/components/home-client";
import { getHomeEvents } from "@/lib/events";

export const revalidate = 1800;

export default async function Home() {
  const { upcoming, past } = await getHomeEvents();
  return <HomeClient upcoming={upcoming} past={past} />;
}
