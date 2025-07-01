const os = require("os");
const pidusage = require("pidusage");
const moment = require("moment");
const axios = require("axios");

module.exports.config = {
  name: "uptime",
  version: "1.0.0",
  permission: 0,
  credits: "Joy Ahmed",
  description: "Show bot status with system info",
  prefix: true,
  category: "System",
  usages: "uptime",
  cooldowns: 5,
};

// RAM converter
function byte2mb(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

// Alternative getStreamFromURL for Merai bot
async function getStreamFromURL(url) {
  const res = await axios({
    method: "GET",
    url,
    responseType: "stream"
  });
  return res.data;
}

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID } = event;
  const timeStart = Date.now();

  try {
    const uptimeSeconds = process.uptime();
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);

    const usage = await pidusage(process.pid);
    const cpu = usage.cpu.toFixed(1);
    const ram = byte2mb(usage.memory);
    const ping = Date.now() - timeStart;
    const timeNow = moment().format("YYYY-MM-DD HH:mm:ss");

    const botName = global.config.BOTNAME || "MeraiBot";
    const prefix = global.config.PREFIX || ".";
    const totalUsers = global.data?.allUserID?.length || 0;
    const totalThreads = global.data?.allThreadID?.length || 0;
    const commandCount = global.client?.commands?.size || 0;

    const id = senderID;

    const msg = `👤 ======{ 𝐔𝐏𝐓𝐈𝐌𝐄 𝐑𝐎𝐁𝐎𝐓 }======┃

→ Bot worked  ${hours} hours ${minutes} minutes ${seconds} seconds 
•━━━━━━━━━━━━━━━━━━━━━━━━•
➠ 𝐉𝐎𝐘 𝐀𝐇𝐌𝐄𝐃
➠ Bo𝐭 Name: ${botName}
➠ Bot Prefix: ${prefix}
➠ Commands count: ${commandCount}
➠ Total Users: ${totalUsers}
➠ Total thread: ${totalThreads}
➠ CPU in use:: ${cpu}%
➠ RAM: ${ram}
➠ Ping: ${ping}ms
➠ Character ID𝐭: ${id}
•━━━━━━━━━━━━━━━━━━━━━━━━•
[ ${timeNow} ]`;

    const imgurLink = "https://i.imgur.com/PnuciON.jpeg"; // 🔁 এখানে তোমার ভিডিও/ছবি লিংক দাও

    return api.sendMessage({
      body: msg,
      attachment: await getStreamFromURL(imgurLink)
    }, threadID, messageID);

  } catch (err) {
    console.log("Uptime command error:", err);
    return api.sendMessage("❌ Error fetching bot status.", threadID, messageID);
  }
};
