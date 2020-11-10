<template>
  <div>
    <h1>Notes</h1>
    <ul>
      <li v-for="(note, index) in notes" :key="index">{{ note }}</li>
    </ul>
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
  data() {
    return {
      notes: []
    };
  }
};
</script>

<style scoped></style>
