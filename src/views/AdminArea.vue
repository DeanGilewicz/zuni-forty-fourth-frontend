<template>
  <div class>
    <button
      v-if="showComponent !== 'showAllProperties'"
      @click="showAllProperties"
      class="btn-link"
    >All Properties</button>
    <button
      v-if="showComponent !== 'showAddOwner'"
      @click="showAddOwner"
      class="btn-link"
    >Add Owner</button>
    <button
      v-if="showComponent !== 'showAddUser'"
      @click="showAddUser"
      class="btn-link last"
    >Add User</button>
    <AllProperties
      v-if="showComponent === 'showAllProperties'"
      @editOwner="editOwner"
      @deleteOwner="deleteOwnerConfirmationModal"
      @editUser="editUser"
      @deleteUser="deleteUserConfirmationModal"
      :properties="properties"
    />
    <AddOwner v-if="showComponent === 'showAddOwner'" @addOwner="addOwner" />
    <EditOwner
      v-if="showComponent === 'showEditOwner'"
      :userId="userId"
      :propertyId="propertyId"
      @changeOwner="changeOwner"
      @updateOwner="updateOwner"
    />
    <AddUser v-if="showComponent === 'showAddUser'" @addUser="addUser" />
    <EditUser
      v-if="showComponent === 'showEditUser'"
      :userId="userId"
      :propertyId="propertyId"
      @updateUser="updateUser"
    />
  </div>
</template>

<script>
import EventBus from "../eventBus";
import HandleError from "../utils/handleError";
import HandleSuccess from "../utils/handleSuccess";
import axios from "axios";
import AllProperties from "@/components/AllProperties.vue";
import AddOwner from "@/components/AddOwner.vue";
import EditOwner from "@/components/EditOwner.vue";
import AddUser from "@/components/AddUser.vue";
import EditUser from "@/components/EditUser.vue";

export default {
  name: "adminArea",
  data() {
    return {
      properties: [],
      propertyId: null,
      userId: null,
      showComponent: "showAllProperties"
    };
  },
  created() {
    const url = "/api/properties";
    const axiosConfig = {
      crossDomain: true,
      withCredentials: true
    };
    // Start Loader
    EventBus.$emit("START_LOADING");
    axios
      .post(url, {}, axiosConfig)
      .then(response => {
        // Stop Loader
        EventBus.$emit("STOP_LOADING");
        this.properties = response.data;
      })
      .catch(error => HandleError(error));
  },
  methods: {
    deleteOwnerConfirmationModal(ownerId, message) {
      EventBus.$emit("OPEN_CONFIRMATION_MODAL", {
        message,
        confirmFn: this.deleteOwner.bind(this, ownerId)
      });
    },
    deleteUserConfirmationModal(userId, message) {
      EventBus.$emit("OPEN_CONFIRMATION_MODAL", {
        message,
        confirmFn: this.deleteUser.bind(this, userId)
      });
    },
    showAllProperties() {
      EventBus.$emit("RESET_ERRORS_MESSAGES_MODAL");
      this.showComponent = "showAllProperties";
    },
    showAddOwner() {
      EventBus.$emit("RESET_ERRORS_MESSAGES_MODAL");
      this.showComponent = "showAddOwner";
    },
    showAddUser() {
      EventBus.$emit("RESET_ERRORS_MESSAGES_MODAL");
      this.showComponent = "showAddUser";
    },
    addOwner(addedOwner, thePropertyId) {
      if (this.properties.length === 0) {
        return;
      }
      /* polyfill needed for updatedProperty fn to work in IE */
      const propertyIndex = this.properties.findIndex(
        property => property.id === thePropertyId
      );
      this.properties[propertyIndex].users.push(addedOwner);
    },
    addUser(addedUser, thePropertyId) {
      if (this.properties.length === 0) {
        return;
      }
      /* polyfill needed for updatedProperty fn to work in IE */
      const propertyIndex = this.properties.findIndex(
        property => property.id === thePropertyId
      );
      this.properties[propertyIndex].users.push(addedUser);
    },
    editOwner(userId, propertyId) {
      EventBus.$emit("RESET_ERRORS_MESSAGES_MODAL");
      this.userId = userId;
      this.propertyId = propertyId;
      this.showComponent = "showEditOwner";
    },
    editUser(userId, propertyId) {
      EventBus.$emit("RESET_ERRORS_MESSAGES_MODAL");
      this.userId = userId;
      this.propertyId = propertyId;
      this.showComponent = "showEditUser";
    },
    deleteOwner(ownerId) {
      if (typeof ownerId !== "undefined") {
        const url = "/api/owner/delete";
        const axiosData = { ownerId };
        const axiosConfig = {
          crossDomain: true,
          withCredentials: true
        };
        // Start Loader
        EventBus.$emit("START_LOADING");
        axios
          .post(url, axiosData, axiosConfig)
          .then(response => {
            const deletedOwnerId = response.data.result.id;
            let propertyIndex;
            this.properties.forEach((property, propIndex) => {
              if (property.ownerId === ownerId) {
                propertyIndex = propIndex;
              }
            });
            // reset property to reflect deleted users
            this.properties[propertyIndex].owner = null;
            this.properties[propertyIndex].ownerId = null;
            this.properties[propertyIndex].users = [];
            // success message UI
            HandleSuccess(
              `${response.data.result.firstName} ${response.data.result.lastName} has been deleted`
            );
          })
          .catch(error => HandleError(error));
      } else {
        HandleError({ message: "Owner not able to be deleted" });
      }
    },
    deleteUser(userId) {
      if (typeof userId !== "undefined") {
        const url = "/api/user/delete";
        const axiosData = { userId };
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
            let propertyIndex;
            let deletedUserIndex;
            this.properties.forEach((property, propIndex) => {
              if (property.users.length > 0) {
                property.users.forEach((user, userIndex) => {
                  if (user.id === deletedUserId) {
                    deletedUserIndex = userIndex;
                    propertyIndex = propIndex;
                  }
                });
              }
            });
            const users = this.properties[propertyIndex].users
              .slice(0, deletedUserIndex)
              .concat(
                this.properties[propertyIndex].users.slice(
                  deletedUserIndex + 1,
                  this.properties[propertyIndex].users.length
                )
              );
            this.properties[propertyIndex].users = users; // const beforeDeletedUser = this.properties[propertyIndex].users.slice(0, deletedUserIndex);
            // success message UI
            HandleSuccess(
              `${response.data.result.firstName} ${response.data.result.lastName} has been deleted`
            );
          })
          .catch(error => HandleError(error));
      } else {
        HandleError({ message: "User not able to be deleted" });
      }
    },
    changeOwner(updatedProperty) {
      if (this.properties.length === 0) {
        return;
      }
      const propertyIndex = this.properties.findIndex(
        property => property.id === updatedProperty.id
      );
      /* polyfill needed for updatedProperty fn to work in IE */
      this.properties[propertyIndex] = updatedProperty;
      HandleSuccess("Owner has been updated");
    },
    updateOwner(updatedOwner, theProperty) {
      if (this.properties.length === 0) {
        return;
      }
      const propertyIndex = this.properties.findIndex(
        property => property.id === theProperty.id
      );
      const ownerIndex = this.properties[propertyIndex].users.findIndex(
        user => user.id === updatedOwner.id
      );
      /* polyfill needed for updatedProperty fn to work in IE */
      this.properties[propertyIndex].owner = updatedOwner;
      this.properties[propertyIndex].users[ownerIndex] = updatedOwner;
      HandleSuccess(
        `${updatedOwner.firstName} ${updatedOwner.lastName} has been updated`
      );
    },
    updateUser(updatedUser) {
      if (this.properties.length === 0) {
        return;
      }
      const thePropertyId = this.propertyId;
      const propertyIndex = this.properties.findIndex(
        property => property.id === thePropertyId
      );
      const userIndex = this.properties[propertyIndex].users.findIndex(
        user => user.id === updatedUser.id
      );
      /* polyfill needed for findIndex fn to work in IE */
      this.properties[propertyIndex].users[userIndex] = updatedUser;
      HandleSuccess(
        `${updatedUser.firstName} ${updatedUser.lastName} has been updated`
      );
    }
  },
  components: {
    AllProperties,
    AddOwner,
    EditOwner,
    AddUser,
    EditUser
  }
};
</script>

<style lang="scss" scoped>
.btn-link {
  margin-top: 20px;
  margin-bottom: 10px;
  margin-right: 30px;
  border: none;
  padding: 0;
  background-color: transparent;
  text-transform: none;
  text-decoration: underline;
  color: $yellow-dark;

  &.last {
    margin-right: 0;
  }
}
</style>