<template>
  <div class="neighbors">
    <h2>NEIGHBORS</h2>
    <div class="container-img">
      <img src="@/assets/zuni44-sitemap.jpg" alt="a sitemap of Zuni Forty Fourth" class="image" />
    </div>
    <div v-if="properties">
      <ul class="container-neighbors">
        <li v-for="property in properties" :key="property.id" class="container-neighbor">
          <h3>{{property.streetAddress}}</h3>
          <ul v-if="property.users" class="container-details">
            <li v-for="user in property.users" :key="user.id" class="details">
              <div class="container-image-profile">
                <img :src="user.image" alt="profile" class="image" />
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
              <img :src="modalUser.image" alt="proile" class="image" />
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
    axios
      .post(url, {}, axiosConfig)
      .then(response => {
        this.properties = response.data;
      })
      .catch(error => HandleError(error));
  },
  computed: {},
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

.container-image-profile {
  max-width: 120px;
  margin: 0 auto;

  .image {
    border-radius: 10px;
  }
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

  .modal-image {
    max-width: 100px;
    margin: 0 auto;

    @media only screen and (min-width: $tablet) {
      max-width: 120px;
      margin: 0;
    }

    .image {
      border-radius: 10px;
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