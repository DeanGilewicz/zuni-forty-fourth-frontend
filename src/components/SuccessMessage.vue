<template>
  <div class="system-message alert alert-success" role="alert">
    <p>{{ message }}</p>
    <button class="close" @click.stop="$emit('clearMessage')">&times;</button>
  </div>
</template>

<script>
export default {
  name: "SuccessMessage",
  props: ["message"],
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}

button {
  align-self: flex-start;
  border: none;
  background-color: transparent;
  line-height: 1;
  font-size: 24px;
}
</style>
