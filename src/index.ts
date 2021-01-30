import dotenv from "dotenv";

if (process.env.NODE_ENV != "production") {
  dotenv.config();
}

import { App, GenericMessageEvent } from "@slack/bolt";
import cron from "node-cron";

import {
  getSetting,
  setSetting,
  getChannel,
  getAllChannels,
  channels,
} from "./db";
import { processMessage } from "./wit";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

cron.schedule("0 * * * *", async () => {
  const all_channels = await getAllChannels();

  const channel =
    all_channels[Math.floor(Math.random() * all_channels.length)].fields["ID"];
  console.log(`selected channel ${channel}`);

  const old_channel = await getSetting("Current Channel");

  await setSetting("Current Channel", channel);

  await app.client.conversations.join({
    token: process.env.SLACK_BOT_TOKEN,
    channel,
  });

  await app.client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    channel,
    text:
      "MOOOOOO!!! :cow2: I get to spend an hour hanging out in your channel, so let's talk! :cow:",
  });

  if (old_channel != null) {
    await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: old_channel,
      text:
        "I'm MOOOving on to a different pasture, so see ya later! :wave: It was fun hanging out! :cow:",
    });
  }
});

app.command("/allow-cow", async ({ ack, say, command }) => {
  if (!command.channel_id.startsWith("C")) {
    await ack({
      text: "Sorry, this only works in public channels!",
    });
    return;
  }

  if (await getChannel(command.channel_id)) {
    await ack({
      text: "MOOO!!! This channel is already on my visit list!",
    });
    return;
  }

  try {
    await channels.create({
      ID: command.channel_id,
    });
  } catch (e) {
    await ack({
      response_type: "ephemeral",
      text: `Something went wrong: \`${e}\``,
    });
    return;
  }

  await ack({
    response_type: "in_channel",
    text: `MOO!!! I'll be visiting <#${command.channel_id}> sometime soon :cow:\nType \`/bye-cow\` to remove this channel from my list! :cow2:`,
  });
});

app.command("/bye-cow", async ({ ack, command }) => {
  try {
    const channel = await getChannel(command.channel_id);
    if (channel) {
      await channels.destroy(channel.id);
    }

    await ack({
      text: "Success!",
    });
  } catch (e) {
    await ack({
      response_type: "ephemeral",
      text: `Something went wrong: \`${e}\``,
    });
    return;
  }
});

app.command("/cow", async ({ ack }) => {
  const channel_count = (await channels.select().all()).length;
  const current_channel = await getSetting("Current Channel");

  await ack({
    text: `Howdy there! I'm your friendly neighborhood cow, here to visit channels and hang out! :cow:\nRight now I'm chillin' in <#${current_channel}>!\nRun \`/allow-cow\` in your personal channel to add it to my visit list! I've got ${channel_count} channels on the list already!\nSee ya later! :cow2:`,
  });
});

app.message(async ({ message, say }) => {
  message = message as GenericMessageEvent;

  if (message.channel == (await getSetting("Current Channel"))) {
    try {
      await say(
        await processMessage({
          text: message.text as string,
          user: message.user,
          channel: message.channel,
        })
      );
    } catch (e) {
      console.log(e);
    }
  }
});

(async () => {
  await app.start(parseInt(process.env.PORT as string) || 3000);
  console.log("app started");
})();
