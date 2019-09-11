<template>
  <div>
    <h2>MY PROFILE</h2>
    <router-link class="a-link" to="/app/profile/edit">Edit My Profile</router-link>
    <router-link class="a-link last-link" to="/app/profile/change-password">Change Password</router-link>
    <div v-if="user" class="current__user">
      <div class="container-image">
        <div
          class="image"
          :style="`background-image: url('${cloudinaryOptimizedImage}')`"
        ></div>
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
import EventBus from "../eventBus";
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
    // Start Loader
    EventBus.$emit("START_LOADING");
    axios
      .post(url, axiosData, axiosConfig)
      .then(response => {
        // Stop Loader
        EventBus.$emit("STOP_LOADING");
        this.user = response.data.result;
      })
      .catch(error => HandleError(error));
  },
  computed: {
    cloudinaryOptimizedImage() {
      if( this.user.image ) {
        const cloudinaryUploadUrl = "https://res.cloudinary.com/cloudassets/image/upload/";
        let optimizedUrl = this.user.image.split(cloudinaryUploadUrl);
        // add cloudinary optimizations
        optimizedUrl[0] = cloudinaryUploadUrl + "q_auto,f_auto/";
        return optimizedUrl.join('');
      } else {
        return "https://res.cloudinary.com/cloudassets/image/upload/q_auto,f_auto/v1565501442/zuni44/profile-placeholder.png";
      }
    }
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

.current__user {
  max-width: 400px;
  margin: 0 auto;

  @media only screen and (min-width: $tablet) {
    max-width: none;
    margin: 0 3% 40px;
  }

  p {
    font-size: 1rem;

    &:first-of-type {
      text-transform: capitalize;
    }
  }
}

.container-image {
  width: 100px;
  height: 100px;
  border-radius: 10px;

  @media only screen and (min-width: $tablet) {
    width: 120px;
    height: 120px;
  }
}

.image {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;

  @media only screen and (min-width: $tablet) {
    width: 120px;
    height: 120px;
  }
}
</style>
