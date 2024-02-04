// import { NextResponse } from "next/server";

// export async function POST() {
//     return NextResponse.redirect("https://warpcast.com/operator", {status: 302});
// }

import { NextApiRequest, NextApiResponse } from "next";

export const revalidate = 0;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Method Not Allowed
    // Extract the dynamic part from the query object
   

    // Construct the redirect URL using the dynamic part
    const redirectUrl = `https://warpcast.com/operator`;

    res.setHeader("Location", redirectUrl);

    // Set the status code to 302 for a temporary redirect and end the response
    res.status(302).end();
}