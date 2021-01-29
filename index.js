if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const { App } = require("@slack/bolt");
const cron = require("node-cron");

const channels = require("airtable").base("appbUtsm8wdAUT22N")("Channels");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

cron.schedule("*/30 * * * *", async () => {
  const all_channels = await channels.select().all();

  const channel =
    all_channels[Math.floor(Math.random() * all_channels.length)].fields["ID"];
  console.log(`selected channel ${channel}`);

  app.client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    channel,
    text:
      "MOOOOOO!!! :cow2: I get to spend 30 minutes hanging out in your channel! How's it going? :cow:",
  });
});

app.command("/allow-cow", async ({ ack, say, command }) => {
  if (await getRecordByChannelId(command.channel_id)) {
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
    text: `MOO!!! I'll be visiting <#${command.channel_id}> sometime soon :cow:\nType \`/bye-cow\` to remove this channel from my list!`,
  });
});

app.command("/bye-cow", async ({ ack, command }) => {
  try {
    const channel = await getRecordByChannelId(command.channel_id);
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

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("app started");
})();

async function getRecordByChannelId(id) {
  try {
    const matched_channels = await channels
      .select({ maxRecords: 1, filterByFormula: `ID = "${id}"` })
      .all();
    if (matched_channels.length == 0) {
      return null;
    }

    return matched_channels[0];
  } catch (e) {
    console.log(e);
    return null;
  }
}
