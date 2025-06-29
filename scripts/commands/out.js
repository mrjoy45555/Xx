module.exports = {
  config: {
    name: "out",
    version: "1.0.0",
    credits: "Joy",
    description: "Bot leaves the group",
    usage: "[threadID (optional)]",
    cooldowns: 5,
    permissions: 2, // Admin only
    prefix: true,
    category: "admin"
  },

  start: async function ({ api, event, args }) {
    const threadID = args[0] || event.threadID;

    // Thread info check (is group and sender is admin)
    const info = await api.getThreadInfo(threadID);
    const isGroup = info.isGroup;
    const isAdmin = info.adminIDs.some(admin => admin.id === event.senderID);

    if (!isGroup)
      return api.sendMessage("❌ এই কমান্ডটি শুধুমাত্র গ্রুপে ব্যবহার করা যাবে।", event.threadID);
    if (!isAdmin)
      return api.sendMessage("❌ কেবলমাত্র গ্রুপ অ্যাডমিনরা এই কমান্ডটি ব্যবহার করতে পারবেন।", event.threadID);

    api.sendMessage("👋 ঠিক আছে, আমি এই গ্রুপ থেকে চলে যাচ্ছি...", threadID, () => {
      api.removeUserFromGroup(api.getCurrentUserID(), threadID);
    });
  }
};
