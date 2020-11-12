import Vue from "vue";
import Popup from "./Popup.vue";
import { BootstrapVue } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// Install BootstrapVue
Vue.use(BootstrapVue);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(Popup)
});
