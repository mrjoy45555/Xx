module.exports = {
  config: {
    name: "out",
    version: "1.0.0",
    permission: 2, // শুধুমাত্র অ্যাডমিন পারবে
    credits: "Joy",
    description: "বটকে গ্রুপ থেকে রিমুভ করে",
    prefix: true,
  },

  start: async function ({ api, event }) {
    const threadID = event.threadID;

    try {
      await api.sendMessage("👋 ঠিক আছে, আমি এই গ্রুপ থেকে বের হয়ে যাচ্ছি...", threadID);
      await api.removeUserFromGroup(api.getCurrentUserID(), threadID);
    } catch (err) {
      await api.sendMessage(`❌ আমি গ্রুপ ছাড়তে পারিনি: ${err.message}`, threadID);
    }
  },
};
