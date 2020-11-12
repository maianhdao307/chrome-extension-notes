<template>
  <div
    class="note-item d-flex align-items-center p-3"
    :class="{ isDone: note.isDone }"
  >
    <b-checkbox
      v-model="note.isDone"
      @change="toggleDone(note.createdAt, $event)"
    ></b-checkbox>
    <span class="note-content d-flex align-items-center flex-grow-1 px-2">
      <span>{{ note.content }}</span>
      <span
        class="text-muted ml-auto flex-shrink-0"
        v-show="note.remindDate && note.remindTime"
        >{{ note.remindDate + " " + note.remindTime.slice(0, 5) }}</span
      >
    </span>
    <b-icon
      icon="pencil"
      class="action-icon mx-4"
      variant="info"
      @click="editNote(note)"
    ></b-icon>
    <b-icon
      icon="trash"
      class="action-icon"
      variant="danger"
      @click="deleteNote(index)"
    ></b-icon>
  </div>
</template>

<script>
export default {
  name: "Options",
  mounted() {
    chrome.storage.sync.get("notes", result => {
      this.notes = result.notes ?? [];
    });
  },
  props: ["note"],
  data() {
    return {
      notes: [],
      isModalOpen: false,
      curNote: null
    };
  },
  emits: ["toggle-done", "delete-note", "edit-note"],
  methods: {
    toggleDone: function(id, isDone) {
      this.$emit("toggle-done", id, isDone);
    },
    deleteNote: function(noteIndex) {
      this.$emit("delete-note", noteIndex);
    },
    editNote: function(note) {
      this.$emit("edit-note", note);
    }
  }
};
</script>

<style scoped>
.note-item {
  border-bottom: 1px dashed #ddd;
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
