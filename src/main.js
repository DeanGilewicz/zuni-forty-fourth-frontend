import Vue from "vue";
import router from "./router";

import App from "./App.vue";

import "./registerServiceWorker";

Vue.config.productionTip = false;

// Vue.config.url = "http://localhost";
// console.log(Vue.config);

// global error handler
window.onerror = function (msg, src, linenum, colnum, error) {
	// eslint-disable-next-line no-console
	console.error("GLOBAL ERROR HANDLER", msg, src, linenum, colnum, error);
};

new Vue({
	router,
	render: (h) => h(App),
}).$mount("#app");
