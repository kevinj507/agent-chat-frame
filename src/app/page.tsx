import { Metadata } from "next";
import Echo from "@/app/components/Echo";

const postUrl = `${process.env["HOST"]}/api/echo`;

export async function generateMetadata(): Promise<Metadata> {
  const imageUrl = `${process.env["HOST"]}/api/images/start?date=${Date.now()}`;
  return {
    title: "FrameGPT",
    description: "Talk to GPT in a frame",
    openGraph: {
      title: "FrameGPT",
      images: [imageUrl],
    },
    other: {
      "fc:frame": "vNext",
      "fc:frame:image": imageUrl,
      "fc:frame:post_url": postUrl,
      "fc:frame:input:text": "Type something here...",
      "fc:frame:button:1": "🗣️ Chat",
    },
  };
}

export default function Home() {
  return (
    <main className="flex flex-col text-center lg:p-16">
      <Echo />
    </main>
  );
}
