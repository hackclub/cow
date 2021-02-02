import airtable from "airtable";

const base = airtable.base("appbUtsm8wdAUT22N");
const channels = base("Channels");
const data = base("Data");

export { channels };

export async function getChannel(id: string) {
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

export async function getAllChannels(except?: string) {
  let formula = "";
  if (except != null) {
    formula = `ID != "${except}"`;
  }
  return await channels.select({ filterByFormula: formula }).all();
}

export async function getSetting(key: string): Promise<string | undefined> {
  try {
    const matching_data = await data
      .select({
        maxRecords: 1,
        filterByFormula: `Key = "${key}"`,
      })
      .all();

    if (matching_data.length >= 1) {
      return matching_data[0].fields["Value"];
    } else {
      return undefined;
    }
  } catch (e) {
    return key;
  }
}

export async function setSetting(key: string, value: string) {
  const id = (
    await data
      .select({ maxRecords: 1, filterByFormula: `Key = "${key}"` })
      .all()
  )[0].id;

  await data.update([
    {
      id,
      fields: {
        Value: value,
      },
    },
  ]);
}
