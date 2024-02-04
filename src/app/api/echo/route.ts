import { NextRequest, NextResponse } from "next/server";
import { getSSLHubRpcClient, Message } from "@farcaster/hub-nodejs";
import fetch from 'node-fetch';
import { OpenAIClient, AzureKeyCredential, ChatRequestMessage } from "@azure/openai";
require('dotenv').config();

const HUB_URL = process.env["HUB_URL"] || "nemes.farcaster.xyz:2283";
const hubClient = getSSLHubRpcClient(HUB_URL);
const AZURE_ENDPOINT = process.env["AZURE_ENDPOINT"];
const AZURE_KEY = process.env["AZURE_KEY"];

if (!AZURE_ENDPOINT || !AZURE_KEY) {
  console.log("no endpoint or key")
  throw new Error("Azure endpoint and key must be defined");
}

const oaiClient = new OpenAIClient(AZURE_ENDPOINT, new AzureKeyCredential(AZURE_KEY));

const deploymentId = "35turbo";

export async function POST(req: NextRequest) {
  interface ApiResponse {
    message: string;
  }

  const {
    untrustedData: { inputText },
    trustedData: { messageBytes },
    buttonIndex: {buttonIndex}
  } = await req.json();
  console.log(`Button index: ${buttonIndex}`)
  const frameMessage = Message.decode(Buffer.from(messageBytes, "hex"));
  const validateResult = await hubClient.validateMessage(frameMessage);
  if (validateResult.isOk() && validateResult.value.valid) {
    const validMessage = validateResult.value.message;

    let urlBuffer = validMessage?.data?.frameActionBody?.url ?? [];
    const urlString = Buffer.from(urlBuffer).toString("utf-8");
    if (!urlString.startsWith(process.env["HOST"] ?? "")) {
      console.log("url doesnt start with host")
      return new NextResponse("Bad Request", { status: 400 });
    }

    // Use the OpenAI client to get completions
    console.log(`Input text: ${inputText}`)
    const messages: ChatRequestMessage[] = [
      { role: "system", content: "You are a helpful assistant. Be efficient, accurate, and concise." },
      { role: "user", content: inputText },
    ];
    const options = {
      maxTokens: 100,
    };
    const completionsResponse = await oaiClient.getChatCompletions(deploymentId, messages, options);

    let message: string;
    if (completionsResponse.choices[0] && completionsResponse.choices[0].message && completionsResponse.choices[0].message.content) {
      message = completionsResponse.choices[0].message.content;
      console.log(`Response text: ${completionsResponse.choices[0].message.content}`);
    } else {
      message = "Error: No response"
      console.log('No response text available');
    }
    // Use the response from the API to generate the next frame

    let postUrl;
    if (buttonIndex == 1) {
      postUrl = `${process.env["HOST"]}/api/echo`;
    } else {
      postUrl = `${process.env["HOST"]}/api/code`;
    }

    const imageUrl = `${process.env["HOST"]}/api/images/echo?date=${Date.now()}&message=${message}`;
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>GPT Says:</title>
          <meta property="og:title" content="GPT Says:" />
          <meta property="og:image" content="${imageUrl}" />
          <meta name="fc:frame" content="vNext" />
          <meta name="fc:frame:image" content="${imageUrl}" />
          <meta name="fc:frame:input:text" content="Type something here..." />
          <meta name="fc:frame:button:1:action" content="post" />
          <meta name="fc:frame:post_url" content="${postUrl}" />
          <meta name="fc:frame:button:1" content="🗣️ Chat" />
          <meta name="fc:frame:button:2" content="Learn more" />
          <meta name="fc:frame:button:2:action" content="post_redirect" />
        </head>
        <body>
<p>GPT RESPONSE </p>
        </body
      </html>`,
      {
        status: 200,
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  } else {
    console.log("validate not ok")
    return new NextResponse("Unauthorized", { status: 401 });
  }
}

export const GET = POST;
