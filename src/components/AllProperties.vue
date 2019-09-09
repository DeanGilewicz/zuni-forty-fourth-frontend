<template>
  <div>
    <h2>ALL PROPERTIES</h2>
    <ul class="container-properties">
      <li v-for="property in properties" :key="property.id" class="container-property">
        <div class="property-name">
          <h3>{{property.streetAddress}}</h3>
        </div>
        <div v-if="property.owner" class="container-property-owner">
          <div class="property-owner">
            <p>Owner: {{property.owner.firstName}}</p>
          </div>
          <div class="property-owner-triggers">
            <p>
              <button @click="editOwner(property.ownerId, property.id)">Edit Owner</button>
            </p>
            <p>
              <button
                @click="deleteOwner(property.ownerId, `Are you sure you want to delete ${capitalizeFirstLetter(property.owner.firstName)} ${capitalizeFirstLetter(property.owner.lastName)}`)"
                class="btn-delete"
              >Delete Owner</button>
            </p>
          </div>
        </div>
        <div
          v-for="user in propertyUsersNoOwners(property.id)"
          :key="user.id"
          class="container-property-user"
        >
          <div class="property-user">
            <p>
              <template v-if="user.userRoleId === 2">
                Owner: {{user.firstName}}
              </template>
              <template v-else>
                User: {{user.firstName}}
              </template>
              <span v-if="user.userStatusId === 1">(requested)</span>
              <span v-if="user.userStatusId === 2">(approved)</span>
              <span v-if="user.userStatusId === 3">(password)</span>
            </p>
          </div>
          <div class="property-user-triggers">
            <p>
              <button @click="editUser(user.id, property.id)">Edit User</button>
            </p>
            <p>
              <button
                @click="deleteUser(user.id, `Are you sure you want to delete ${capitalizeFirstLetter(user.firstName)} ${capitalizeFirstLetter(user.lastName)}`)"
                class="btn-delete"
              >Delete User</button>
            </p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { capitalizeFirstLetter } from "../utils/formatters";
export default {
  name: "allProperties",
  props: {
    properties: Array
  },
  data() {
    return {
      displayView: "allProperties" // show which component to render -> all properties / add owner / add user / edit owner / edit user
    };
  },
  methods: {
    capitalizeFirstLetter(str) {
      return capitalizeFirstLetter(str);
    },
    propertyUsersNoOwners(propertyId) {
      const propertyPos = this.properties
        .map(property => property.id)
        .indexOf(propertyId);
      const property = this.properties[propertyPos];
      if (property.users) {
        return property.users.filter(user => user.id !== property.ownerId);
      }
      return [];
    },
    editOwner(userId, propertyId) {
      this.$emit("editOwner", userId, propertyId);
    },
    deleteOwner(ownerId, message) {
      this.$emit("deleteOwner", ownerId, message);
    },
    editUser(userId, propertyId) {
      this.$emit("editUser", userId, propertyId);
    },
    deleteUser(userId, message) {
      this.$emit("deleteUser", userId, message);
    }
  }
};
</script>

<style lang="scss" scoped>
.container-properties {
  list-style-type: none;
  margin: 0;
  padding: 0 0 40px;
}

.container-property {
  display: flex;
  flex-direction: column;
  border-top: 1px solid $white-off;
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;

  @media only screen and (min-width: $tablet) {
    justify-content: center;
    text-align: left;
  }

  .property-name {
    font-size: 1.1rem;
    text-align: center;

    @media only screen and (min-width: $tablet) {
      margin-top: 10px;
      margin-bottom: 30px;
    }
  }

  .container-property-owner,
  .container-property-user {
    margin-top: 20px;
    margin-bottom: 20px;

    @media only screen and (min-width: $tablet) {
      display: flex;
      justify-content: space-between;
    }
  }

  .property-owner,
  .property-user {
    margin-bottom: 20px;

    p {
      text-transform: capitalize;
      font-size: 1.1rem;
    }
  }

  .property-owner-triggers,
  .property-user-triggers {
    display: flex;
    justify-content: space-between;

    button {
      margin-right: 30px;
    }

    button.btn-delete {
      margin-right: 0;
    }
  }

  h3,
  p {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
}
</style>
