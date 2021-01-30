import { Wit } from "node-wit";
import responses from "./responses";

const client = new Wit({
  accessToken: process.env.WIT_ACCESS_TOKEN as string,
});

export async function processMessage({
  text,
  user,
  channel,
}: {
  text: string;
  user: string;
  channel: string;
}) {
  const response = await client.message(text, {});
  if (response.intents.length > 0) {
    return responses[response.intents[0].name](user, channel);
  } else {
    throw "No response";
  }
}
