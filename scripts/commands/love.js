const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports.config = {
  name: "love",
  version: "2.0.0",
  permssion: 0,
  credits: "Joy Ahmed",
  description: "Create a love frame image with mentioned person",
  prefix: true,
  category: "Love",
  usages: "[tag]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "path": "",
    "jimp": ""
  }
};

module.exports.onLoad = async () => {
  const cacheDir = path.join(__dirname, "cache", "canvas");
  const framePath = path.join(cacheDir, "love_frame.png");

  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
  if (!fs.existsSync(framePath)) {
    await global.utils.downloadFile(
      "https://i.postimg.cc/LXnmhGNv/joyahmed404.png", // 🔁 Replace with your love frame URL
      framePath
    );
  }
};

async function circle(imagePath) {
  const img = await jimp.read(imagePath);
  img.circle();
  return await img.getBufferAsync("image/png");
}

async function makeImage({ one, two }) {
  const cacheDir = path.join(__dirname, "cache", "canvas");
  const framePath = path.join(cacheDir, "love_frame.png");
  const pathA = path.join(cacheDir, `avt_${one}.png`);
  const pathB = path.join(cacheDir, `avt_${two}.png`);
  const outputPath = path.join(cacheDir, `love_${one}_${two}.png`);

  const getAvatar = async (uid, pathSave) => {
    const url = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const res = await axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(pathSave, Buffer.from(res.data, "utf-8"));
  };

  await getAvatar(one, pathA);
  await getAvatar(two, pathB);

  const base = await jimp.read(framePath);
  const imgA = await jimp.read(await circle(pathA));
  const imgB = await jimp.read(await circle(pathB));

  base
    .composite(imgA.resize(196, 196), 98, 141)
    .composite(imgB.resize(193, 193), 427, 143);

  const buffer = await base.getBufferAsync("image/png");
  fs.writeFileSync(outputPath, buffer);

  fs.unlinkSync(pathA);
  fs.unlinkSync(pathB);

  return outputPath;
}

module.exports.run = async function ({ event, api }) {
  const { threadID, messageID, senderID, mentions } = event;
  const mentionIDs = Object.keys(mentions);

  if (!mentionIDs.length) {
    return api.sendMessage("🥀 যার সাথে ফ্রেম বানাতে চান তাকে মেনশন করুন!", threadID, messageID);
  }

  const taggedID = mentionIDs[0];

  try {
    const imagePath = await makeImage({ one: senderID, two: taggedID });
    const msg = {
      body: "•🦋💛🌸\n\nবাধিয়ে রেখে লাভ নেই\nউড়িয়ে দিয়ে দেখো...\nদিন শেষে যদি ফিরে আসে,\nতখনি আগলে রেখো 🥀\n\n𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ━➢ 𝐉𝐨𝐲 𝐀𝐡𝐦𝐞𝐝",
      attachment: fs.createReadStream(imagePath)
    };
    api.sendMessage(msg, threadID, () => fs.unlinkSync(imagePath), messageID);
  } catch (err) {
    console.error(err);
    api.sendMessage("⛔ ছবি তৈরিতে সমস্যা হয়েছে!", threadID, messageID);
  }
};
