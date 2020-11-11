<template>
  <b-container class="py-4 container">
    <h3>Notes</h3>
    <p v-if="!notes.length">No notes!</p>
    <div v-else>
      <div
        v-for="(note, index) in notes"
        :key="index"
        class="note-item d-flex align-items-center p-3"
        :class="{ isDone: note.isDone }"
      >
        <b-checkbox
          v-model="note.isDone"
          @change="toggleDone(note.createdAt, $event)"
        ></b-checkbox>
        <span class="note-content">{{ note.content }}</span>
        <b-icon
          icon="pencil"
          class="action-icon ml-auto mr-4"
          v-b-modal.my-modal
          @click="openModal(note)"
        ></b-icon>
        <b-icon
          icon="trash"
          class="action-icon"
          @click="deleteNote(index)"
        ></b-icon>
      </div>
    </div>
    <b-modal id="my-modal" hide-footer v-model="isModalOpen">
      <note-form
        :initial-value="transformNote()"
        @submit="updateNote"
      ></note-form>
    </b-modal>
  </b-container>
</template>

<script>
import NoteForm from "@/components/NoteForm";

export default {
  name: "Options",
  mounted() {
    chrome.storage.sync.get("notes", result => {
      this.notes = result.notes ?? [];
      console.log(result.notes);
    });
  },

  data() {
    return {
      notes: [],
      isModalOpen: false,
      curNote: null
    };
  },
  methods: {
    toggleDone: function(createdAt, isDone) {
      const newNotes = this.notes.map(note => {
        if (note.createdAt === createdAt) {
          console.log(note.createdAt, createdAt);

          return {
            ...note,
            isDone
          };
        }
        return note;
      });
      chrome.storage.sync.set({ notes: newNotes });
    },
    deleteNote: function(noteIndex) {
      const newNotes = [...this.notes];
      newNotes.splice(noteIndex, 1);
      this.notes = newNotes;
      chrome.storage.sync.set({ notes: newNotes });
    },
    transformNote: function() {
      if (!this.curNote) {
        return null;
      }
      return {
        content: this.curNote.content,
        isRemind: this.curNote.isRemind,
        remindDate: this.curNote.remindDate,
        remindTime: this.curNote.remindTime
      };
    },
    updateNote: function(updatedNote) {
      const newNotes = this.notes.map(note => {
        if (note.id === this.curNote.id) {
          return {
            ...this.curNote,
            ...updatedNote
          };
        }
        return note;
      });
      this.isModalOpen = false;
      this.notes = newNotes;
      chrome.storage.sync.set({ notes: newNotes });
    },
    openModal: function(note) {
      this.curNote = note;
      this.isModalOpen = true;
    }
  },

  components: {
    NoteForm
  }
};
</script>

<style scoped>
.container {
  max-width: 1000px;
}
.note-item:hover {
  background: #eee;
}
.note-item.isDone .note-content {
  text-decoration: line-through;
}
.action-icon {
  font-size: 1.2rem;
  cursor: pointer;
}
</style>
