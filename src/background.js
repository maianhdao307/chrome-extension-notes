console.log("Hello from the background");

let timers = [];

function notifyNotes(notes) {
  if (!notes) {
    return;
  }
  timers = [];
  notes.forEach(note => {
    if (!note.isRemind || !note.remindDate || !note.remindTime) {
      return;
    }

    const notifyTime = new Date(
      note.remindDate + "T" + note.remindTime + "+07:00"
    );

    const now = new Date();
    const diff = notifyTime.getTime() - now.getTime();
    if (isNaN(diff) || diff < 0 || diff > 8 * 3600 * 1000) {
      return;
    }

    const newTimer = setTimeout(() => {
      var notifOptions = {
        type: "basic",
        iconUrl: "icons/48.png",
        title: "Attention!!!",
        message: note.content
      };
      chrome.notifications.create(note.id, notifOptions);
    }, diff);
    timers.push(newTimer);
  });
}

chrome.storage.sync.get("notes", result => {
  notifyNotes(result.notes);
});

chrome.storage.onChanged.addListener(function(result) {
  timers.forEach(timer => {
    clearTimeout(timer);
  });
  notifyNotes(result.notes.newValue);
});
