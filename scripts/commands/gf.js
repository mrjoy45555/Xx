const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
    name: "gf",
    version: "1.0.0",
    permission: 0,
    credits: "JOY",
    description: "Pair up with mentioned person",
    prefix: true,
    category: "fun",
    cooldowns: 5,
};

module.exports.onLoad = async () => {
    const dir = path.join(__dirname, "cache", "canvas");
    const imgPath = path.join(dir, "arr2.png");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(imgPath)) {
        const res = await axios.get("https://i.imgur.com/iaOiAXe.jpeg", { responseType: "arraybuffer" });
        fs.writeFileSync(imgPath, Buffer.from(res.data, "utf-8"));
    }
};

async function circle(imagePath) {
    const img = await jimp.read(imagePath);
    img.circle();
    return await img.getBufferAsync(jimp.MIME_PNG);
}

async function makeImage({ one, two }) {
    const __root = path.join(__dirname, "cache", "canvas");
    const background = await jimp.read(path.join(__root, "arr2.png"));
    const pathImg = path.join(__root, `gf_${one}_${two}.png`);
    const avatarOnePath = path.join(__root, `avt_${one}.png`);
    const avatarTwoPath = path.join(__root, `avt_${two}.png`);

    const avatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(avatarOnePath, Buffer.from(avatarOne, "utf-8"));

    const avatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(avatarTwoPath, Buffer.from(avatarTwo, "utf-8"));

    const circleOne = await jimp.read(await circle(avatarOnePath));
    const circleTwo = await jimp.read(await circle(avatarTwoPath));

    background
        .composite(circleOne.resize(200, 200), 70, 110)
        .composite(circleTwo.resize(200, 200), 465, 110);

    const rawImg = await background.getBufferAsync(jimp.MIME_PNG);
    fs.writeFileSync(pathImg, rawImg);

    fs.unlinkSync(avatarOnePath);
    fs.unlinkSync(avatarTwoPath);

    return pathImg;
}

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID, senderID, mentions } = event;
    const mention = Object.keys(mentions);

    if (!mention[0]) {
        return api.sendMessage("⚠️ অনুগ্রহ করে ১ জনকে ট্যাগ কর।", threadID, messageID);
    }

    const one = senderID;
    const two = mention[0];

    try {
        const imagePath = await makeImage({ one, two });
        return api.sendMessage({
            body: "✿┈┈┈┈┈┈༺♡༻┈┈┈┈┈┈✿\n      জোড়া লাগানো সম্পূর্ণ!\n✿┈┈┈┈┈┈༺♡༻┈┈┈┈┈┈✿\n\n💑 এই নে তোর কাইল্লা বোউরে।\nকালকে দেখছিলাম আরেক বেড়ার লগে পার্কের চিপায়।",
            attachment: fs.createReadStream(imagePath)
        }, threadID, () => fs.unlinkSync(imagePath), messageID);
    } catch (err) {
        console.error(err);
        return api.sendMessage("❌ ইমেজ তৈরি করতে সমস্যা হয়েছে।", threadID, messageID);
    }
};
