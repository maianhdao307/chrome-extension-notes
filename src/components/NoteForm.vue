<template>
  <b-form @submit.stop.prevent @submit="submitNote">
    <b-form-input
      v-model="content"
      placeholder="Type note"
      class="my-3"
      required
    ></b-form-input>
    <b-form-checkbox v-model="isRemind" switch class="my-3">
      Remind
    </b-form-checkbox>
    <b-form-datepicker v-model="remindDate" v-if="isRemind"></b-form-datepicker>
    <b-form-timepicker v-model="remindTime" v-if="isRemind"></b-form-timepicker>
    <b-button class="my-3 d-block mx-auto" type="submit">Submit</b-button>
  </b-form>
</template>

<script>
function initData() {
  return {
    content: "",
    isRemind: false,
    remindDate: "",
    remindTime: ""
  };
}

export default {
  name: "NoteForm",
  data() {
    if (this.initialValue) {
      return this.initialValue;
    } else {
      return initData();
    }
  },
  props: ["initialValue"],
  emits: ["submit"],
  methods: {
    submitNote() {
      const createdAt = new Date().toString();
      const newNote = {
        content: this.content,
        isRemind: this.isRemind,
        remindDate: this.remindDate,
        remindTime: this.remindTime,
        id: createdAt,
        createdAt
      };
      this.$emit("submit", newNote);
      Object.assign(this.$data, initData());
    }
  }
};
</script>
