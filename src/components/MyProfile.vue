<template>
  <div>
    <h2>MY PROFILE</h2>
    <router-link class="a-link" to="/app/profile/edit">Edit My Profile</router-link>
    <router-link class="a-link last-link" to="/app/profile/change-password">Change Password</router-link>
    <div v-if="user" class="current__user">
      <div class="container-image">
        <img :src="user.image" alt="profile" class="image" />
      </div>
      <p>
        <span>Name :</span>
        {{user.firstName}} {{user.lastName}}
      </p>
      <p>
        <span>Email :</span>
        {{user.emailAddress}}
      </p>
      <p>
        <span>Phone # :</span>
        {{phoneNumberFormatted(user.phoneNumber)}}
      </p>
      <p>
        Interests :
        <template v-for="(interest, index) in user.interests">
          <span v-if="interest.interest && index < (user.interests.length - 1)" :key="index">
            {{interest.interest}},
            <!---->
          </span>
          <span v-else-if="interest.interest" :key="index">{{interest.interest}}</span>
        </template>
      </p>
    </div>
  </div>
</template>

<script>
import HandleError from "../utils/handleError";
import axios from "axios";
import { formatPhoneNumber } from "../utils/formatters";

export default {
  name: "myProfile",
  data() {
    return {
      user: {}
    };
  },
  created() {
    const url = "/api/user/current";
    const axiosData = {};
    const axiosConfig = {
      crossDomain: true,
      withCredentials: true
    };
    axios
      .post(url, axiosData, axiosConfig)
      .then(response => {
        this.user = response.data.result;
      })
      .catch(error => HandleError(error));
  },
  methods: {
    phoneNumberFormatted(phoneNumber) {
      return formatPhoneNumber(phoneNumber);
    }
  }
};
</script>

<style lang="scss" scoped>
.a-link {
  display: inline-block;
  margin-top: 10px;
  margin-right: 30px;
  margin-bottom: 50px;
  border: none;
  background-color: transparent;
  text-transform: none;
  text-decoration: underline;
  color: $yellow-dark;

  &.last-link {
    margin-right: 0;
  }
}

h2 {
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 1.5rem;
  text-align: center;

  @media only screen and (min-width: $tablet) {
    margin-top: 30px;
    margin-bottom: 30px;
  }
}

.current__user {
  max-width: 400px;
  margin: 0 auto;

  @media only screen and (min-width: $tablet) {
    max-width: none;
    margin: 0;
  }

  p {
    font-size: 1rem;

    &:first-of-type {
      text-transform: capitalize;
    }
  }
}

.container-image {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
  border-radius: 10px;

  .image {
    border-radius: 10px;
  }
}
</style>
