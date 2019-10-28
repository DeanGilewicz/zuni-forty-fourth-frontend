<template>
  <div class="neighbors">
    <h2>NEIGHBORS</h2>
    <div class="container-img">
      <img src="@/assets/zuni44-sitemap.jpg" alt="a sitemap of Zuni Forty Fourth" class="image" />
    </div>
    <div v-if="filteredProperties">
      <ul class="container-neighbors">
        <li v-for="property in filteredProperties" :key="property.id" class="container-neighbor">
          <h3>{{property.streetAddress}}</h3>
          <ul v-if="property.users" class="container-details">
            <li v-for="user in property.users" :key="user.id" class="details">
              <div class="container-image-profile">
                <div
                  class="image"
                  :style="`background-image: url('${cloudinaryOptimizedImage(user.image)}')`"
                ></div>
              </div>
              <h4>{{user.firstName}} {{user.lastName}}</h4>
              <p @click="onUserProfileModal(user)">...</p>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <transition name="fade">
      <div v-if="modalUser" class="modal-profile-user">
        <div class="modal-content">
          <div @click="resetUserProfileModal" class="modal-close">
            <button>&times;</button>
          </div>
          <div class="modal-wrapper">
            <div class="modal-image">
              <div
                class="image"
                :style="`background-image: url('${cloudinaryOptimizedImage(modalUser.image)}')`"
              ></div>
            </div>
            <div class="modal-details">
              <h5>{{modalUser.firstName}} {{modalUser.lastName}}</h5>
              <p>
                <a
                  :href="`mailto:${modalUser.emailAddress}`"
                  class="modal-email"
                >{{modalUser.emailAddress}}</a>
              </p>
              <p>
                <a
                  :href="`tel:${modalUser.phoneNumber}`"
                  class="modal-phone"
                >{{phoneNumberFormatted(modalUser.phoneNumber)}}</a>
              </p>
            </div>
          </div>
          <div v-if="modalUser.interests && modalUser.interests.length > 0" class="modal-interests">
            <p>Interests:</p>
            <ul>
              <li
                v-for="(interest, index) in modalUser.interests"
                :key="index"
              >{{interest.interest}}</li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import EventBus from "../eventBus";
import HandleError from "../utils/handleError";
import { formatPhoneNumber } from "../utils/formatters";
import axios from "axios";

export default {
  name: "neighbors",
  data() {
    return {
      properties: [],
      modalUser: null
    };
  },
  mounted() {
    this.bodyEl = document.querySelector("body");
  },
  beforeDestroy() {
    this.bodyEl = null;
  },
  created() {
    const url = "/api/properties/all";
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
  computed: {
    filteredProperties() {
      if( this.properties ) {
        return this.properties.map( property => {
          if( property.users ) {
            property.users = property.users.filter(user => user.userStatusId === 2);
          }
          return property;
        });
      }
    }
  },
  methods: {
    phoneNumberFormatted(phoneNumber) {
      return formatPhoneNumber(phoneNumber);
    },
    onUserProfileModal(user) {
      // stop scroll on body
      if (this.bodyEl) this.bodyEl.classList.add("no-scroll");
      // set modal user
      this.modalUser = user;
    },
    resetUserProfileModal() {
      // reset scroll on body
      if (this.bodyEl) this.bodyEl.classList.remove("no-scroll");
      // reset modal user
      this.modalUser = null;
    },
    cloudinaryOptimizedImage(image) {
      if( image ) {
        const cloudinaryUploadUrl = "https://res.cloudinary.com/cloudassets/image/upload/";
        let optimizedUrl = image.split(cloudinaryUploadUrl);
        // add cloudinary optimizations
        optimizedUrl[0] = cloudinaryUploadUrl + "q_auto,f_auto/";
        return optimizedUrl.join('');
      } else {
        return "https://res.cloudinary.com/cloudassets/image/upload/q_auto,f_auto/v1565501442/zuni44/profile-placeholder.png";
      }
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.neighbors {
  @media only screen and (min-width: $tablet) {
    padding-left: 50px;
    padding-right: 50px;
  }
}

.container-neighbors {
  padding-bottom: 10px;
}

.container-neighbor {
  border-top: 1px solid $white-off;
  padding-top: 20px;
  padding-bottom: 20px;

  h3 {
    margin-top: 20px;
    margin-bottom: 30px;
    font-size: 1.1rem;

    @media only screen and (min-width: $tablet) {
      margin-top: 30px;
      margin-bottom: 40px;
      font-size: 1.2rem;
    }
  }
}

.container-details {
  text-align: center;

  @media only screen and (min-width: $mobile-landscape) {
    display: flex;
    flex-wrap: wrap;
  }

  @media only screen and (min-width: $tablet) {
    justify-content: center;
  }
}

.details {
  padding-top: 10px;
  padding-bottom: 10px;

  @media only screen and (min-width: $mobile-landscape) {
    flex-basis: 50%;
  }

  @media only screen and (min-width: $tablet) {
    flex-basis: 33.33%;
  }

  h4 {
    margin-bottom: 5px;
  }

  p {
    margin-top: 5px;
    margin-bottom: 5px;
    cursor: pointer;
  }

  a {
    text-decoration: none;
  }
}

.container-image-profile,
.modal-image {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  border-radius: 10px;

  @media only screen and (min-width: $tablet) {
    width: 120px;
    height: 120px;
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
}

.modal-image {
  margin: 0;
}

h3 {
  text-align: center;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.container-img {
  max-width: 80%;
  margin: 0 auto;
  padding-top: 10px;
  padding-bottom: 30px;

  @media only screen and (min-width: $tablet) {
    max-width: 600px;
  }

  @media only screen and (min-width: $desktop) {
  }

  .image {
    border-radius: 10px;
  }
}

.modal-profile-user {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);

  .modal-close {
    margin-bottom: 20px;
    text-align: right;

    button {
      padding: 3px 8px 6px;
      line-height: 1;
      font-size: 20px;
    }
  }

  .modal-content {
    width: 90%;
    max-width: 500px;
    max-height: 94%;
    padding: 20px 10px;
    overflow-y: scroll;
    background-color: $yellow-dark;

    @media only screen and (min-width: $tablet) {
      padding: 20px;
    }
  }

  .modal-wrapper {
    @media only screen and (min-width: $tablet) {
      display: flex;
      justify-content: flex-start;
    }
  }

  .modal-details {
    text-align: center;

    @media only screen and (min-width: $tablet) {
      margin: 0 auto;
      padding-left: 20px;
    }

    h5 {
      margin: 20px 0 0;
      font-size: 1rem;
      color: $blue-grey-very-dark;

      @media only screen and (min-width: $tablet) {
        font-size: 1.5rem;
      }
    }

    a {
      text-decoration: none;
      color: $white-off;
    }

    .modal-email {
      font-size: 0.9rem;

      @media only screen and (min-width: $tablet) {
        font-size: 1.1rem;
      }
    }
  }

  .modal-interests {
    margin-top: 30px;
    border-top: 1px solid $white-off;

    p {
      text-transform: uppercase;
      font-weight: 700;
      color: $blue-grey-very-dark;
      text-align: center;
    }

    ul {
      list-style-type: circle;
      margin: 0 0 0 20px;
    }

    li {
      margin-bottom: 10px;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>