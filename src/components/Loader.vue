<template>
  <div v-if="isLoading" class="container-loader">
    <div class="loader">Loading...</div>
  </div>
</template>

<script>
export default {
  name: "loader",
  props: {
    isLoading: Boolean
  }
};
</script>

<style lang="scss" scoped>
.container-loader {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
}

.loader,
.loader:before,
.loader:after {
  width: 2.5em;
  height: 2.5em;
  border-radius: 50%;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation: loader 1.8s infinite ease-in-out;
  animation: loader 1.8s infinite ease-in-out;
}
.loader {
  position: relative;
  margin: 80px auto;
  font-size: 10px;
  color: #ccc;
  text-indent: -9999em;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}
.loader:before,
.loader:after {
  content: "";
  position: absolute;
  top: 0;
}
.loader:before {
  left: -3.5em;
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}
.loader:after {
  left: 3.5em;
}
@-webkit-keyframes loader {
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}
@keyframes loader {
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}
</style>
