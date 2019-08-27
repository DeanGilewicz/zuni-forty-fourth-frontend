import EventBus from "../eventBus";

export default error => {
	if (error.response) {
		// The request was made and the server responded with a status code that falls out of the range of 2xx
		// console.log(error.response.data);
		// console.log(error.response.status);
		// console.log(error.response.headers);
		// this.$emit("onAddError", error.response.data.result);
		EventBus.$emit("ERROR", error.response.data);
	} else if (error.request) {
		// The request was made but no response was received
		// `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js
		// console.log(error.request);
		// this.$emit("onAddError", error.request);
		EventBus.$emit("ERROR", error.request);
	} else {
		// Something happened in setting up the request that triggered an Error
		// console.log("Error", error.message);
		// this.$emit("onAddError", error.message);
		EventBus.$emit("ERROR", error.message);
	}
	// console.log(error.config);
};
