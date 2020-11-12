<template>
  <b-container class="py-4 container">
    <div class="d-flex align-items-center mb-3">
      <h3>Notes</h3>
      <b-button @click="exportFile" class="ml-auto mr-3" variant="light"
        >Export</b-button
      >
      <b-button @click="clickImport" variant="light">Import</b-button>
      <input
        type="file"
        @change="importFile"
        accept=".json"
        ref="importFile"
        v-show="false"
      />
    </div>

    <p v-if="!notes.length">No notes!</p>
    <Container
      v-else
      @drop="onDrop"
      drag-class="opacity-ghost"
      drop-class="opacity-ghost-drop"
    >
      <Draggable v-for="(note, index) in notes" :key="index">
        <note-item
          :note="note"
          @toggle-done="toggleDone"
          @delete-note="deleteNote"
          @edit-note="editNote"
        ></note-item>
      </Draggable>
    </Container>
    <b-modal id="updateNoteModal" hide-footer v-model="isModalOpen">
      <note-form
        submit-button-label="Update"
        :initial-value="transformNote()"
        @submit="updateNote"
      ></note-form>
    </b-modal>
  </b-container>
</template>

<script>
import NoteForm from "@/components/NoteForm";
import NoteItem from "@/components/NoteItem";
import { Container, Draggable } from "vue-smooth-dnd";

export default {
  name: "Options",
  mounted() {
    chrome.storage.sync.get("notes", result => {
      this.notes = result.notes ?? [];
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
    editNote: function(note) {
      this.curNote = note;
      this.isModalOpen = true;
    },
    exportFile: function() {
      function download(filename, text) {
        var element = document.createElement("a");
        element.setAttribute(
          "href",
          "data:json/plain;charset=utf-8," + encodeURIComponent(text)
        );
        element.setAttribute("download", filename);

        element.style.display = "none";
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
      }

      download("notes.json", JSON.stringify(this.notes));
    },
    importFile: function(event) {
      const reader = new FileReader();
      reader.onload = event => {
        const fileContent = event.target.result;
        try {
          const importedNotes = JSON.parse(fileContent);
          const newNotes = [...this.notes];
          let importedCount = 0;
          importedNotes.forEach(note => {
            if (this.notes.find(n => n.id === note.id)) {
              return;
            }
            newNotes.push(note);
            importedCount++;
          });
          this.notes = newNotes;

          chrome.storage.sync.set({ notes: newNotes }, () => {
            alert(`Imported ${importedCount} notes successfully`);
          });
        } catch (err) {
          alert("Invalid File");
          console.log(err);
        }
      };
      reader.readAsText(event.target.files[0]); // you could also
    },
    clickImport: function() {
      this.$refs.importFile.click();
    },
    onDrop(dropResult) {
      const { addedIndex, removedIndex } = dropResult;
      const newNotes = [...this.notes];
      const dragNote = newNotes.splice(removedIndex, 1)[0];
      newNotes.splice(addedIndex, 0, dragNote);

      this.notes = newNotes;
      chrome.storage.sync.set({ notes: newNotes });
    }
  },

  components: {
    NoteForm,
    NoteItem,
    Container,
    Draggable
  }
};
</script>

<style scoped>
.container {
  max-width: 1000px;
}

.opacity-ghost {
  transition: all 0.18s ease;
  opacity: 0.8;
  /* transform: rotateZ(5deg); */
  background-color: cornflowerblue;
  box-shadow: 3px 3px 10px 3px rgba(0, 0, 0, 0.3);
}

.opacity-ghost-drop {
  opacity: 1;
  /* transform: rotateZ(0deg); */
  background-color: white;
  box-shadow: 3px 3px 10px 3px rgba(0, 0, 0, 0);
}
</style>
