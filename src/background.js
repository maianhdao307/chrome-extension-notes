browser.runtime.onMessage.addListener(function() {
  console.log("Hello from the background");
  chrome.storage.sync.get("notes", result => {
    if (!result.notes) {
      return;
    }
    result.notes.forEach(note => {
      if (!note.isRemind || !note.remindDate || !note.remindTime) {
        return;
      }

      const notifyTime = new Date(
        this.remindDate + "T" + this.remindTime + "+07:00"
      );

      const now = new Date();
      const diff = notifyTime.getTime() - now.getTime();
      if (isNaN(diff) || diff < 0 || diff > 8 * 3600 * 1000) {
        return;
      }
      setTimeout(() => {
        var notifOptions = {
          type: "basic",
          iconUrl: "icons/48.png",
          title: "Attention!!!",
          message: note.content
        };
        chrome.notifications.create(note.time.toString(), notifOptions);
      }, diff);
    });
  });
});
