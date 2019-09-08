<template>
  <div>
    <h2>EDIT OWNER</h2>
    <div class="container-form">
      <form
        action
        method="post"
        @submit.prevent="updateOwnerConfirmationModal"
        class="form__edit-owner"
      >
        <div class="field">
          <input v-model="owner.firstName" type="text" id="fname" name="first_name" required />
          <label for="fname" :class="{ active: isFirstName }">
            First Name
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input v-model="owner.lastName" type="text" id="lname" name="last_name" required />
          <label for="lname" :class="{ active: isLastName }">
            Last Name
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input
            v-model="owner.phoneNumber"
            type="tel"
            id="phoneNumber"
            name="phone_number"
            required
          />
          <label for="phoneNumber" :class="{ active: isPhoneNumber }">
            Phone Number
            <sup>*</sup>
          </label>
        </div>
        <div class="field submit">
          <input type="submit" class="btn" value="Update Owner" />
        </div>
      </form>
    </div>
    <h2>CHANGE OWNER</h2>
    <div class="container-form">
      <form
        action
        method="post"
        @submit.prevent="changeOwnerConfirmationModal(newPropertyOwnerId)"
        class="form__change-owner"
      >
        <div class="field">
          <select
            v-model="newPropertyOwnerId"
            name="newPropertyOwnerId"
            @change="handleDisableSubmit"
          >
            <option value="default" selected>- Select a User -</option>
            <option
              v-for="user in propertyUsersNoOwners"
              :key="user.id"
              :value="user.id"
            >{{user.firstName}} {{user.lastName}}</option>
          </select>
        </div>
        <div class="field submit">
          <input type="submit" class="btn" value="Change owner" :disabled="disableSubmit" />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import EventBus from "../eventBus";
import HandleError from "../utils/handleError";
import axios from "axios";
import { capitalizeFirstLetter } from "../utils/formatters";
export default {
  name: "editOwner",
  props: {
    userId: Number,
    propertyId: Number
  },
  data() {
    return {
      owner: {},
      rollbackOwner: {},
      property: null,
      newPropertyOwnerId: "default",
      disableSubmit: true
    };
  },
  computed: {
    propertyUsersNoOwners() {
      if (this.property && this.property.users) {
        const ownerId = this.property.ownerId;
        return this.property.users.filter(user => user.id !== ownerId);
      }
      return [];
    },
    isFirstName() {
      if (this.owner.firstName !== "") {
        return true;
      }
      return false;
    },
    isLastName() {
      if (this.owner.lastName !== "") {
        return true;
      }
      return false;
    },
    isPhoneNumber() {
      if (this.owner.phoneNumber !== "") {
        return true;
      }
      return false;
    }
  },
  created() {
    const url = "/api/user";
    const axiosData = {
      userId: this.userId
    };
    const axiosConfig = {
      crossDomain: true,
      withCredentials: true
    };
    axios
      .post(url, axiosData, axiosConfig)
      .then(response => {
        this.owner = response.data.result;
        this.rollbackOwner = { ...response.data.result };
      })
      .catch(error => HandleError(error));
    const allUsersUrl = "/api/property/users";
    const axiosData2 = {
      propertyId: this.propertyId
    };
    const axiosConfig2 = {
      crossDomain: true,
      withCredentials: true
    };
    axios
      .post(allUsersUrl, axiosData2, axiosConfig2)
      .then(response => {
        this.property = response.data;
      })
      .catch(error => HandleError(error));
  },
  methods: {
    updateOwnerConfirmationModal() {
      if (
        this.owner.firstName !== "" &&
        this.owner.lastName !== "" &&
        this.owner.phoneNumber !== ""
      ) {
        const message = `Are you sure you want to update ${capitalizeFirstLetter(
          this.rollbackOwner.firstName
        )} ${capitalizeFirstLetter(this.rollbackOwner.lastName)}`;
        EventBus.$emit("OPEN_CONFIRMATION_MODAL", {
          message,
          confirmFn: this.updateOwner.bind(this),
          cancelFn: this.resetOwner.bind(this)
        });
      } else {
        // handle UI validation messages
        HandleError({ message: "Please complete all fields." });
      }
    },
    changeOwnerConfirmationModal(newPropertyOwnerId) {
      if (this.newPropertyOwnerId !== "default") {
        const message =
          "Are you sure you want to change the owner of this property?";
        EventBus.$emit("OPEN_CONFIRMATION_MODAL", {
          message,
          confirmFn: this.changeOwner.bind(this, newPropertyOwnerId),
          cancelFn: () => {
            this.newPropertyOwnerId = "default";
          }
        });
      } else {
        // handle UI validation messages
        HandleError({ message: "Please select a user." });
      }
    },
    updateOwner() {
      const url = "/api/owner/update";
      const axiosData = {
        owner: this.owner
      };
      const axiosConfig = {
        crossDomain: true,
        withCredentials: true
      };
      // Start Loader
      EventBus.$emit("START_LOADING");
      axios
        .put(url, axiosData, axiosConfig)
        .then(response => {
          this.owner = response.data.result;
          this.$emit("updateOwner", response.data.result, this.property);
        })
        .catch(error => HandleError(error));
    },
    resetOwner() {
      this.owner = { ...this.rollbackOwner };
    },
    handleDisableSubmit() {
      if (this.newPropertyOwnerId !== "default") {
        // remove disable on button
        this.disableSubmit = false;
      } else {
        // set disable on button
        this.disableSubmit = true;
      }
    },
    changeOwner(userId) {
      if (userId === "default") {
        // throw new Error('No user selected');
        return;
      }
      const url = "/api/property/changeOwner";
      const axiosData = {
        propertyId: this.property.id,
        userId: parseInt(userId, 10)
      };
      const axiosConfig = {
        crossDomain: true,
        withCredentials: true
      };
      // Start Loader
      EventBus.$emit("START_LOADING");
      axios
        .put(url, axiosData, axiosConfig)
        .then(response => {
          const ownerId = response.data.ownerId;
          const matchedOwner = response.data.users.filter(
            user => user.id === ownerId
          );
          this.owner = matchedOwner[0];
          this.property = response.data;

          this.newPropertyOwnerId = "default";
          this.disableSubmit = true;

          this.$emit("changeOwner", response.data);
        })
        .catch(error => HandleError(error));
    }
  }
};
</script>

<style lang="scss" scoped>
h2 {
  margin-top: 10px;
}

.form__edit-owner,
.form__change-owner {
  @media only screen and (min-width: $tablet) {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
