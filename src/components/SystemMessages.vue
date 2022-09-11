<template>
  <div>
    <slot></slot>
    <div class="system-messages">
      <transition name="slide">
        <error-message
          v-for="(error, index) in errors"
          :key="index"
          :error="error"
          @clearMessage="onClearError(index)"
        ></error-message>
        <success-message
          v-for="(message, index) in messages"
          :key="index"
          :message="message"
          @clearMessage="onClearMessage(index)"
        ></success-message>
      </transition>
    </div>
    <transition name="fade">
      <ConfirmationModal
        v-if="showConfirmationModal"
        :show-confirmation-modal="showConfirmationModal"
        :confirmation-message="modalMessage"
        @onCloseConfirmationModal="onCloseConfirmationModal"
        @onInvokeModalConfirmFn="onInvokeModalConfirmFn"
        @onInvokeModalCancelFn="onInvokeModalCancelFn"
      />
    </transition>
    <transition name="fade">
      <Loader :is-loading="isLoading" />
    </transition>
  </div>
</template>

<script>
import EventBus from "../eventBus";
import ErrorMessage from "./ErrorMessage.vue";
import SuccessMessage from "./SuccessMessage.vue";
import ConfirmationModal from "./ConfirmationModal";
import Loader from "./Loader";

export default {
  name: "SystemMessages",
  components: {
    ErrorMessage,
    SuccessMessage,
    ConfirmationModal,
    Loader,
  },
  data() {
    return {
      errors: [],
      messages: [],
      showConfirmationModal: false,
      modalMessage: "",
      confirmFnToInvoke: null,
      cancelFnToInvoke: null,
      isLoading: false,
    };
  },
  mounted() {
    EventBus.$on("ERROR", (error) => {
      this.onStopLoading();
      this.onClearMessages();
      this.onClearErrors();
      if (Array.isArray(error.result)) {
        error.result.forEach((error) => {
          this.errors.push(error.msg);
        });
      } else if (error.result != "Auth token is not supplied") {
        this.errors.push(error);
      } else {
        this.$router.push("/");
      }
    });
    EventBus.$on("RESET_ERRORS", () => {
      this.onClearErrors();
    });
    EventBus.$on("SUCCESS", (message) => {
      this.onStopLoading();
      this.onClearErrors();
      this.onClearMessages();
      this.messages.push(message);
    });
    EventBus.$on("RESET_MESSAGES", () => {
      this.onClearMessages();
    });
    EventBus.$on(
      "OPEN_CONFIRMATION_MODAL",
      ({ message, confirmFn, cancelFn }) => {
        this.modalMessage = message;
        this.confirmFnToInvoke = confirmFn;
        this.cancelFnToInvoke = cancelFn;
        this.showConfirmationModal = true;
      }
    );
    EventBus.$on("CLOSE_CONFIRMATION_MODAL", () => {
      this.onCloseConfirmationModal();
    });
    EventBus.$on("RESET_ERRORS_MESSAGES_MODAL", () => {
      this.resetErrorsMessagesModal();
    });
    EventBus.$on("START_LOADING", () => {
      this.onStartLoading();
    });
    EventBus.$on("STOP_LOADING", () => {
      this.onStopLoading();
    });
  },
  methods: {
    onStartLoading() {
      this.isLoading = true;
    },
    onStopLoading() {
      this.isLoading = false;
    },
    onClearError(index) {
      if (this.errors.length >= index) {
        const copiedErrorsArr = [...this.errors];
        copiedErrorsArr.splice(index, 1);
        this.errors = copiedErrorsArr;
      }
    },
    onClearErrors() {
      this.errors = [];
    },
    onClearMessage(index) {
      if (this.messages.length >= index) {
        const copiedMessagesArr = [...this.messages];
        copiedMessagesArr.splice(index, 1);
        this.messages = copiedMessagesArr;
      }
    },
    onClearMessages() {
      this.messages = [];
    },
    onInvokeModalCancelFn() {
      if (this.cancelFnToInvoke) {
        this.cancelFnToInvoke();
      }
    },
    onInvokeModalConfirmFn() {
      if (this.confirmFnToInvoke) {
        this.confirmFnToInvoke();
      }
    },
    onCloseConfirmationModal() {
      this.showConfirmationModal = false;
      this.modalMessage = "";
      this.confirmFnToInvoke = null;
      this.cancelFnToInvoke = null;
    },
    resetErrorsMessagesModal() {
      this.onClearErrors();
      this.onClearMessages();
      this.onCloseConfirmationModal();
    },
  },
};
</script>

<style lang="scss" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s, opacity 0.4s;
}

.slide-enter-to,
.slide-leave {
  transform: translateX(0);
  opacity: 1;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
