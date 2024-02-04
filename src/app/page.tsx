import { FrameConfig, Frame, FrameButton, FrameImage } from "@devcaster/next/frames";

export default function Home({ searchParams }: { searchParams: Record<string, string>; }) {
    const frame = new FrameConfig<{ count: number }>({ count: 0 }, searchParams);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Frame frame={frame}>
                <FrameButton onClick={(f: FrameConfig<{ count: number }>) => { f.state.count -= 1; }}>-</FrameButton>
                <FrameButton onClick={(f: FrameConfig<{ count: number }>) => { f.state.count += 1; }}>+</FrameButton>
                <FrameImage src={`${process.env.BASE_URL}/image?count=${frame.state.count}`} />
            </Frame>
            {/* Rest of your code */}
        </main>
    );
}