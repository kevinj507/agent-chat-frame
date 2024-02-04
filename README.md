# FrameGPT

Adapted from https://github.com/horsefacts/echo-the-dolphin

You need the following .env secrets:
HOST
HUB_URL
AZURE_ENDPOINT
AZURE_KEY
NEXT_PUBLIC_URL

in the code you will see something called deploymentId:

const deploymentId = "35turbo";

this is hardcoded to my Azure deployment ID. you need to update it to whatever your model is.
there is also a hardcoded 100 token restriction on responses to meet the response time required for frames.

Todo:
- chat history
- support for other models/agents
- generate link to your conversation for that frame as redirect, share with others
