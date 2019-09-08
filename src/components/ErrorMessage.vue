<template>
  <div class="system-message alert alert-danger" role="alert">
    <ul>
      <li v-if="error.result">{{ error.result }}</li>
      <li v-else-if="error">{{ error }}</li>
    </ul>
    <button @click.stop="$emit('clearMessage')" class="close">&times;</button>
  </div>
</template>

<script>
export default {
  name: "errorMessage",
  props: ["error"]
};
</script>

<style lang="scss" scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 10px 30px 0 0;
  font-size: 0.9rem;
}

li {
  line-height: 1.5;
}

button {
  align-self: flex-start;
  border: none;
  background-color: transparent;
  line-height: 1;
  font-size: 24px;
}
</style>