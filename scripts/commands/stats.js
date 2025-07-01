const os = require("os");
const pidusage = require("pidusage");
const moment = require("moment");

module.exports.config = {
  name: "stats",
  version: "1.0.0",
  permission: 0,
  credits: "Joy",
  description: "Showing the status of the bot",
  prefix: true,
  category: "System",
  usages: "stats",
  cooldowns: 9,
};

function byte2mb(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

module.exports.run = async function ({ api, event, args, Users, Threads, Currencies, commands }) {
  const { threadID, messageID } = event;
  const startTime = Date.now();

  // Send "loading" message
  const tempMsg = await api.sendMessage("Loading data...", threadID, messageID);

  // Get system info
  const uptimeSeconds = process.uptime();
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);

  const usage = await pidusage(process.pid);

  const cpu = usage.cpu.toFixed(1);
  const ram = byte2mb(usage.memory);
  const ping = Date.now() - startTime;
  const timeNow = moment().format("YYYY-MM-DD HH:mm:ss");

  const botName = global.config.BOTNAME || "Bot";
  const prefix = global.config.PREFIX || "!";
  const totalUsers = global.data.allUserID.length;
  const totalThreads = global.data.allThreadID.length;
  const totalCommands = commands.size;
  const osInfo = `${os.type()} ${os.release()} (${os.arch()})`;

  const stats = 
`👤 ======『 𝗨𝗣𝗧𝗜𝗠𝗘 𝗦𝗧𝗔𝗧𝗦 』====== 👤

⏰ Uptime: ${hours}h ${minutes}m ${seconds}s
🤖 Bot Name: ${botName}
📌 Prefix: ${prefix}
📚 Total Commands: ${totalCommands}
👥 Users: ${totalUsers}
💬 Threads: ${totalThreads}
🧠 CPU: ${cpu}%
💾 RAM: ${ram}
📡 Ping: ${ping}ms
🖥️ OS: ${osInfo}

⏱️ Time Now: ${timeNow}
━━━━━━━━━━━━━━━━━━━━━━━`;

  // Edit previous message with final stats
  api.editMessage(stats, tempMsg.messageID, threadID);
};
