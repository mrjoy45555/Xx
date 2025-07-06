const axios = require("axios");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "prefix",
    version: "2.0",
    permission: 0,
    credits: "Joy Ahmed",
    description: "Show bot prefix and information",
    prefix: false,
    category: "system",
    cooldowns: 5
  },

  onStart: async function () {},

  onChat: async function ({ message, event }) {
    const { body } = event;
    const input = body?.toLowerCase();

    if (input !== "prefix") return;

    const prefix = global.config.PREFIX;
    const time = moment.tz("Asia/Dhaka").format("hh:mm:ss || D/MM/YYYY");

    const dayConvert = {
      Sunday: "রবিবার",
      Monday: "সোমবার",
      Tuesday: "মঙ্গলবার",
      Wednesday: "বুধবার",
      Thursday: "বৃহস্পতিবার",
      Friday: "শুক্রবার",
      Saturday: "শনিবার"
    };

    const today = moment.tz("Asia/Dhaka").format("dddd");
    const day = dayConvert[today] || today;

    try {
      const res = await axios.get("https://imran-api.onrender.com/video/crush");
      const videoUrl = res.data.data;
      const videoStream = (await axios.get(videoUrl, { responseType: "stream" })).data;

      const msg = `💐 ====『 𝗣𝗥𝗘𝗙𝗜𝗫 』==== 💐
━━━━━━━━━━━━━━━━━━━
[⏰] → তারিখ ও সময়: ${time} (${day})
[❤️] → বট Prefix: [ ${prefix} ]
━━━━━━━━━━━━━━━━━━━
[💥] → মোট কমান্ড: ${global.client.commands.size}
[👥] → মোট ইউজার: ${global.data.allUserID.length}
[🏘️] → মোট গ্রুপ: ${global.data.allThreadID.length}
━━━━━━━━━━━━━━━━━━━
[👉] → কমান্ড লিস্ট দেখতে লিখুন: ${prefix}help`;

      return message.reply({
        body: msg,
        attachment: videoStream
      });

    } catch (err) {
      console.error("❌ Prefix Command Error:", err.message);
      return message.reply("⚠️ ভিডিও আনতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।");
    }
  }
};
