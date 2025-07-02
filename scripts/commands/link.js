const axios = require("axios");

module.exports.config = {
  name: "link",
  version: "1.0.0",
  permission: 0,
  credits: "Joy Ahmed",
  description: "Get UID from Facebook profile link",
  prefix: true,
  category: "utility",
  usages: "[Facebook profile link]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
  const link = args[0];

  if (!link || !link.includes("facebook.com")) {
    return api.sendMessage("❌ একটি সঠিক ফেসবুক প্রোফাইল লিংক দিন।\nউদাহরণ: facebook.com/zuck", event.threadID, event.messageID);
  }

  try {
    const res = await axios.get(`https://graph.facebook.com/v17.0/?id=${encodeURIComponent(link)}&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`);
    
    if (res.data && res.data.id) {
      return api.sendMessage(`✅ UID: ${res.data.id}`, event.threadID, event.messageID);
    } else {
      return api.sendMessage("❌ UID খুঁজে পাওয়া যায়নি, লিংকটি সঠিক কিনা চেক করুন।", event.threadID, event.messageID);
    }
  } catch (e) {
    console.error(e);
    return api.sendMessage("❌ কিছু ভুল হয়েছে। আবার চেষ্টা করুন।", event.threadID, event.messageID);
  }
};
