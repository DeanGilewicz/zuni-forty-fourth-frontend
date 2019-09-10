<template>
  <div>
    <div v-if="showComponent === 'showManageUsers'">
      <h2>MANAGE USERS</h2>
      <div v-if="property" class="property__owner">
        <p class="property-name">{{property.streetAddress}}</p>
      </div>
      <button v-if="showComponent !== 'showAddUser'" @click="showAddUser" class="btn-link">Add User</button>
      <div v-if="property && property.users">
        <p class="user-primary">{{owner.firstName}} {{owner.lastName}}</p>
        <div v-for="user in users" :key="user.id" class="property-user">
          <p class="user-secondary">
            {{user.firstName}} {{user.lastName}}
            <span
              v-if="user.userStatusId === 1"
            >(requested access)</span>
          </p>
          <button @click="deleteUserConfirmationModal(user)">Delete User</button>
        </div>
      </div>
    </div>
    <AddUserByOwner
      v-if="showComponent === 'showAddUser'"
      @showManageUsers="showManageUsers"
      @addUser="addUser"
      :property="property"
    />
  </div>
</template>

<script>
import EventBus from "../eventBus";
import HandleError from "../utils/handleError";
import HandleSuccess from "../utils/handleSuccess";
import axios from "axios";
import AddUserByOwner from "@/components/AddUserByOwner.vue";
import Cookie from "js-cookie";
import jwtDecode from "../utils/jwtDecode";
import { capitalizeFirstLetter } from "../utils/formatters";
export default {
  name: "manageUsers",
  data() {
    return {
      currentUserId: jwtDecode(Cookie.get("token")).userId,
      property: null,
      showComponent: "showManageUsers"
    };
  },
  created() {
    // get property by owner
    const url = "/api/property/owner";
    const axiosData = {
      ownerId: this.currentUserId
    };
    const axiosConfig = {
      crossDomain: true,
      withCredentials: true
    };
    axios
      .post(url, axiosData, axiosConfig)
      .then(response => {
        this.property = response.data;
      })
      .catch(error => HandleError(error));
  },
  computed: {
    owner() {
      if (this.property && this.property.users) {
        return this.property.users.filter(
          user => user.id === this.property.ownerId
        )[0];
      }
    },
    users() {
      if (this.property && this.property.users) {
        return this.property.users.filter(
          user => user.id !== this.property.ownerId
        );
      }
    }
  },
  methods: {
    showManageUsers() {
      EventBus.$emit("RESET_ERRORS_MESSAGES_MODAL");
      this.showComponent = "showManageUsers";
    },
    showAddUser() {
      EventBus.$emit("RESET_ERRORS_MESSAGES_MODAL");
      this.showComponent = "showAddUser";
    },
    deleteUserConfirmationModal(user) {
      const message = `Are you sure you want to delete ${capitalizeFirstLetter(
        user.firstName
      )} ${capitalizeFirstLetter(user.lastName)}`;
      EventBus.$emit("OPEN_CONFIRMATION_MODAL", {
        message,
        confirmFn: this.deleteUser.bind(this, user.id)
      });
    },
    addUser(addedUser) {
      if (!this.property ) {
        return;
      }
      this.property.users.push(addedUser);
    },
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
          if (this.property.users.length > 0) {
            const deletedUserId = response.data.result.id;
            const updatedUserArray = this.property.users.filter(user => {
              if (user.id !== deletedUserId) {
                return user;
              }
            });
            // update property users
            this.property.users = updatedUserArray;
            // success message UI
            HandleSuccess(
              `${response.data.result.firstName} ${response.data.result.lastName} has been deleted`
            );
          }
        })
        .catch(error => HandleError(error));
    }
  },
  components: {
    AddUserByOwner
  }
};
</script>

<style lang="scss" scoped>
.btn-link {
  margin-top: 20px;
  margin-bottom: 10px;
  border: none;
  padding: 0;
  background-color: transparent;
  text-transform: none;
  text-decoration: underline;
  color: $yellow-dark;
}

.property-name {
  font-size: 1.2rem;
  text-align: center;
}

.user-primary,
.user-secondary {
  text-transform: capitalize;
}

.property-user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.user-primary {
  margin-top: 30px;
  margin-bottom: 30px;
}
</style>
