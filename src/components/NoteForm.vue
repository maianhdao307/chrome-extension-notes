<template>
  <b-form @submit.stop.prevent @submit="submitNote">
    <b-form-textarea
      v-model="content"
      placeholder="Type note"
      class="mb-3 mt-2"
      required
    ></b-form-textarea>
    <b-form-checkbox v-model="isRemind" switch class="my-3">
      Remind
    </b-form-checkbox>
    <b-form-datepicker v-model="remindDate" v-if="isRemind"></b-form-datepicker>
    <b-form-timepicker v-model="remindTime" v-if="isRemind"></b-form-timepicker>
    <b-button
      class="mt-3 mb-2 d-block mx-auto"
      variant="primary"
      type="submit"
      >{{ submitButtonLabel }}</b-button
    >
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
  props: ["initialValue", "submitButtonLabel"],
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
