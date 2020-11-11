<template>
  <div class="container">
    <h3>Add note</h3>
    <note-form @submit="addNote"></note-form>
  </div>
</template>

<script>
import NoteForm from "@/components/NoteForm";

export default {
  name: "Popup",
  methods: {
    addNote(newNote) {
      chrome.storage.sync.get("notes", result => {
        let newNotes;
        if (result.notes) {
          newNotes = [...result.notes, newNote];
        } else {
          newNotes = [newNote];
        }
        chrome.storage.sync.set({ notes: newNotes }, () => {
          var notifOptions = {
            type: "basic",
            iconUrl: "icons/48.png",
            title: "Added note successfully",
            message: newNote.content
          };
          chrome.notifications.create("addNote", notifOptions);
        });
      });
    }
  },
  components: {
    NoteForm
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
  min-width: 400px;
}
</style>
