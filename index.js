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
    all_channels[Math.floor(Math.random() * all_channels.length)]["ID"];
  console.log(`selected channel ${channel}`);

  app.client.chat.postMessage({
    channel,
    text: "MOOOOOO!! I have visited you!",
  });
});

app.command("/cow-allow", async ({ ack, say, command }) => {
  try {
    await channels.create({
      ID: command.channel_id,
    });
  } catch (e) {
    await ack({
      response_type: "ephemeral",
      text: `Something went wrong: \`${e}\``,
    });
  }

  await ack({
    response_type: "in_channel",
    text: "MOO!!! I'll be visiting this channel sometime soon :cow:",
  });
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("app started");
})();
