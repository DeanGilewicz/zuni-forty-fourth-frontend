<template>
  <div>
    <h1>ALL USERS</h1>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{user.firstName}} {{user.propertyId}}
        <span
          v-if="user.property"
        >{{user.property.streetAddress}}</span>
        <button v-on:click="deleteUser(user.id)">DELETE USER</button>
      </li>
    </ul>
  </div>
</template>

<script>
import HandleError from "../utils/handleError";
import axios from "axios";
export default {
  name: "allUsers",
  data() {
    return {
      users: []
    };
  },
  created() {
    const allUsersUrl = "/api/users";
    const axiosData = {};
    const axiosConfig = {
      crossDomain: true,
      withCredentials: true
    };
    axios
      .post(url, axiosData, axiosConfig)
      .then(response => {
        this.users = response.data.result;
      })
      .catch(error => HandleError(error));
  },
  methods: {
    deleteUser(userId) {
      const url = "/api/user/delete";
      const axiosData = { userId: userId };
      const axiosConfig = {
        crossDomain: true,
        withCredentials: true
      };
      // Start Loader
      EventBus.$emit("START_LOADING");
      axios
        .post(url, axiosData, axiosConfig)
        .then(response => {
          const deletedUserId = response.data.result.id;
          const userPos = this.$data.users
            .map(user => user.id)
            .indexOf(deletedUserId);
          const beforeDeletedUser = this.$data.users.slice(0, userPos);
          const afterDeletedUser = this.$data.users.slice(userPos + 1);
          this.users = [...beforeDeletedUser, ...afterDeletedUser];
        })
        .catch(error => HandleError(error));
    }
  }
};
</script>
