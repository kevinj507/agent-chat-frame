import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.redirect("https://warpcast.com/operator", {status: 302});
}
