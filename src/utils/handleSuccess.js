import EventBus from "../eventBus";

export default (message) => {
  EventBus.$emit("SUCCESS", message);
};
