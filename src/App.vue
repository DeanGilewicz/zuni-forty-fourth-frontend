<template>
  <SystemMessages>
    <div id="app">
      <router-view/>
    </div>
  </SystemMessages>
</template>

<script>
import SystemMessages from "./components/SystemMessages.vue";
export default {
  name: "app",
  components: {
    SystemMessages
  }
};
</script>

<style lang="scss">
/* needs to exist to transfer styles */
</style>
