<template>
  <div v-if="showConfirmationModal" class="confirmation-modal">
    <div class="modal-content">
      <h2>Please Confirm</h2>
      <p>{{confirmationMessage}}</p>
      <div class="modal-actions">
        <button @click="onCancel">Cancel</button>
        <button @click="onConfirm">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "confirmationModal",
  props: {
    showConfirmationModal: Boolean,
    confirmationMessage: String
  },
  methods: {
    onCancel() {
      this.$emit("onInvokeModalCancelFn");
      this.$emit("onCloseConfirmationModal");
    },
    onConfirm() {
      this.$emit("onInvokeModalConfirmFn");
      this.$emit("onCloseConfirmationModal");
    }
  }
};
</script>

<style lang="scss" scoped>
.confirmation-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
}

.modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  width: 80%;
  max-width: 500px;
  border-radius: 10px;
  padding: 20px 10px;
  transform: translate(-50%, -50%);
  background-color: $yellow-dark;

  @media only screen and (min-width: $tablet) {
    padding: 30px 50px;
  }

  h2 {
    margin: 0 0 20px;
    color: $blue-grey-very-dark;
    text-align: left;
  }

  p {
    margin: 20px 0;
    line-height: 1.5;
    color: $blue-grey-very-dark;
  }

  .modal-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
  }
}
</style>
