<template>
  <b-form @submit.stop.prevent class="container">
    <h3>Add note</h3>
    <b-form-input
      v-model="noteInput"
      placeholder="Type note"
      class="my-3"
    ></b-form-input>
    <b-form-checkbox v-model="isRemind" switch class="my-3 ml-auto">
      Remind
    </b-form-checkbox>
    <b-form-datepicker v-model="remindDate" v-if="isRemind"></b-form-datepicker>
    <b-form-timepicker v-model="remindTime" v-if="isRemind"></b-form-timepicker>
    <b-button @click="submitNote" class="my-3">Submit</b-button>
  </b-form>
</template>

<script>
function initData() {
  return {
    noteInput: "",
    isRemind: false,
    remindDate: null,
    remindTime: null
  };
}

export default {
  name: "Popup",
  data() {
    return initData();
  },
  methods: {
    submitNote() {
      const newNote = {
        content: this.noteInput,
        isRemind: this.isRemind,
        time:
          this.remindDate && this.remindTime
            ? new Date(
                this.remindDate + "T" + this.remindTime + "+07:00"
              ).toString()
            : null
      };

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
          Object.assign(this.$data, initData());
        });
      });
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
  min-width: 400px;
}
</style>
