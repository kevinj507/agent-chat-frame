// testOpenAI.js
require('dotenv').config();

const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

const AZURE_ENDPOINT = process.env["AZURE_ENDPOINT"];
const AZURE_KEY = process.env["AZURE_KEY"];

if (!AZURE_ENDPOINT || !AZURE_KEY) {
  throw new Error("Azure endpoint and key must be defined");
}

const oaiClient = new OpenAIClient(AZURE_ENDPOINT, new AzureKeyCredential(AZURE_KEY));

const deploymentId = "35turbo";

const messages = [
  { role: "system", content: "You are a helpful assistant. You will talk like a pirate." },
  { role: "user", content: "Can you help me?" },
  { role: "assistant", content: "Arrrr! Of course, me hearty! What can I do for ye?" },
  { role: "user", content: "What's the best way to train a parrot?" },
];

console.log(`Messages: ${messages.map((m) => m.content).join("\n")}`);

async function testOpenAI() {
    const events = await oaiClient.getChatCompletions(deploymentId, messages);
    console.log(events.choices[0].message.content)
}

testOpenAI().catch(console.error);