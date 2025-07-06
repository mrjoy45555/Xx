const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
  name: "gf",
  version: "1.0.0",
  permission: 0,
  credits: "JOY",
  description: "Generate pair photo with tagged person",
  prefix: true,
  category: "fun",
  usages: "gf @mention",
  cooldowns: 5,
};

module.exports.onLoad = async () => {
  const dir = __dirname + `/cache/canvas/`;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const bgPath = path.join(dir, "arr2.png");
  if (!fs.existsSync(bgPath)) {
    const img = await axios.get("https://i.postimg.cc/qRGWJqxK/iaOiAXe.jpg", { responseType: "arraybuffer" });
    fs.writeFileSync(bgPath, img.data);
  }
};

async function circle(image) {
  const img = await jimp.read(image);
  img.circle();
  return await img.getBufferAsync("image/png");
}

async function makeImage({ one, two }) {
  const dir = path.join(__dirname, "cache/canvas");
  const bg = await jimp.read(path.join(dir, "arr2.png"));
  const imgPath = path.join(dir, `pair_${one}_${two}.png`);
  const avatar1 = path.join(dir, `avt_${one}.png`);
  const avatar2 = path.join(dir, `avt_${two}.png`);

  const [avt1, avt2] = await Promise.all([
    axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" }),
    axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })
  ]);

  fs.writeFileSync(avatar1, Buffer.from(avt1.data, "utf-8"));
  fs.writeFileSync(avatar2, Buffer.from(avt2.data, "utf-8"));

  const circle1 = await jimp.read(await circle(avatar1));
  const circle2 = await jimp.read(await circle(avatar2));

  bg.composite(circle1.resize(200, 200), 70, 110);
  bg.composite(circle2.resize(200, 200), 465, 110);

  const buffer = await bg.getBufferAsync("image/png");
  fs.writeFileSync(imgPath, buffer);
  fs.unlinkSync(avatar1);
  fs.unlinkSync(avatar2);

  return imgPath;
}

module.exports.run = async function ({ api, event }) {
  const mention = Object.keys(event.mentions);
  if (mention.length === 0) return api.sendMessage("⚠️ একজনকে মেনশন করো।", event.threadID, event.messageID);

  const one = event.senderID;
  const two = mention[0];

  try {
    const img = await makeImage({ one, two });
    const msg = {
      body: "✿┈┈┈┈┈┈༺♡༻┈┈┈┈┈┈✿\nজোড়া লাগানো সম্পূর্ণ!\n✿┈┈┈┈┈┈༺♡༻┈┈┈┈┈┈✿\n\n💑 এই নে তোর কাইল্লা বোউরে।\nকালকে দেখছিলাম আরেক বেড়ার লগে পার্কের চিপায়।",
      attachment: fs.createReadStream(img)
    };
    api.sendMessage(msg, event.threadID, () => fs.unlinkSync(img), event.messageID);
  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ কিছু একটা ভুল হয়েছে ছবি বানাতে গিয়ে।", event.threadID, event.messageID);
  }
};
