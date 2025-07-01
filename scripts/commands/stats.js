const fs = require("fs");
const os = require("os");

module.exports.config = {
  name: "stats",
  version: "1.0.0",
  permission: 0,
  credits: "Jonell Magallanes",
  description: "Showing The Status of Bot",
    prefix: true,
  category: "System",
  usages: "stats",
  cooldowns: 9,
};

module.exports.run = async function ({ api, event, Users, Threads }) {
  const threadID = event.threadID;
  const messageID = event.messageID;


  const startTime = Date.now();

  const uptimeSeconds = process.uptime();
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);
  const uptime = `${hours} hours, ${minutes} minutes, ${seconds} seconds`;

  const osDetails = `${os.type()} ${os.release()} (${os.arch()})`;

  const latencyMessage = await api.sendMessage("Loading Data.......", threadID, messageID);
  const latency = Date.now() - startTime;

  const data = `👤 ======{ 𝐔𝐏𝐓𝐈𝐌𝐄 𝐑𝐎𝐁𝐎𝐓 }======┃\n\n→ Bot worked  ${hours} hours ${minutes} minutes ${seconds} seconds \n•━━━━━━━━━━━━━━━━━━━━━━━━•\n➠ 𝐉𝐎𝐘 𝐀𝐇𝐌𝐄𝐃\n➠ Bo𝐭 Name: ${global.config.BOTNAME}\n➠ Bot Prefix: ${global.config.PREFIX}\n➠ Commands count: ${commands.size}\n➠ Total Users: ${global.data.allUserID.length}\n➠ Total thread: ${global.data.allThreadID.length}\n➠ CPU in use:: ${pidusage.cpu.toFixed(1)}%\n➠ RAM: ${byte2mb(pidusage.memory)}\n➠ Ping: ${Date.now() - timeStart}ms\n➠ Character ID𝐭: ${id}\n•━━━━━━━━━━━━━━━━━━━━━━━━•\n[ ${timeNow} ]`;

  api.editMessage(`𝗕𝗼𝘁 𝗗𝗮𝘁𝗮 𝗦𝘁𝗮𝘁𝘀\n${global.line}\n${data}`, latencyMessage.messageID, threadID);
};
