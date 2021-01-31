export function randomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)];
}

export default {
  greeting: (user: string, channel: string) => {
    return randomResponse([
      `Hi there <@${user}>!`,
      "MOOOO!!! Hey there! :cow:",
      `What's up <@${user}>?`,
      "Hiiiii!!! :wave:",
    ]);
  },
  evil: (user: string, channel: string) => {
    return randomResponse([
      "Well _that_ wasn't nice :(",
      "I have feelings, you know :pensivecowboy:",
      "I'm crying inside :sob:",
      "Take that back please :sadge:",
    ]);
  },
  feelings_request: (user: string, channel: string) => {
    return randomResponse([
      "I'm doing great! :cow2: (or MOOing great hehe)",
      "I'm doing great, thanks for asking!",
      "Not bad, for a talking cow :cow2:",
      "Life's good! :sunglasses:",
    ]);
  },
  identity_request: (user: string, channel: string) => {
    return randomResponse([
      "I'm the Hack Club Cow, your friendly neighborhood cow! MOOOOO :cow:",
      "I'm just a traveling cow, passing through the lands of Hack Club!",
      "MOOOOOO :cow2:",
      "I'm just your local cow! :cow2:",
    ]);
  },
  projects_request: (user: string, channel: string) => {
    return randomResponse([
      "Hmm... right now I'm inventing a new grass planter!",
      "I'm building the latest and greatest barn!",
      "I'm working on the latest Pro Tractor™! :tractor:",
      "Hmm... I'm not working on any cool projects right now.",
    ]);
  },
  affirmation: (user: string, channel: string) => {
    return randomResponse([
      "Aww thanks! :heart:",
      "Wow thanks a lot! :sparkling_heart:",
      "You're not too bad yourself! :cow:",
      "Thanks!",
    ]);
  },
  moo: (user: string, channel: string) => {
    return randomResponse(["MOOOOOO :cow2:", "Mooo ??", ":cow:", ":cow2:"]);
  },
  interest_request: (user: string, channel: string) => {
    return randomResponse([
      "Hmm... I like mooing!",
      "I really like grazing in channels (like this one!) :cow2:",
      "Gnawing on grass is kinda my thing.",
      "I love hanging out with other animals, and humans too!",
      `Right now I like hanging out in <#${channel}>! :wink:`,
    ]);
  },
  goodbye: (user: string, channel: string) => {
    return randomResponse([
      `See ya later, <@${user}>! :wave:`,
      "See you soon! :cow2:",
      "Byeeee!!",
      "See you later! :cow:",
      "Bye! See you later!",
    ]);
  },
} as {
  [key: string]: (user: string, channel: string) => string;
};
