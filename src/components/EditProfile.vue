<template>
  <div>
    <h2>EDIT PROFILE</h2>
    <router-link class="a-link" to="/app/profile">My Profile</router-link>
    <div class="container-form">
      <div>
        <form
          action
          method="POST"
          @submit.prevent="onUploadImage"
          class="container-image-upload"
          encrypt="multipart/form-data"
        >
          <div class="container-image">
            <div
              v-if="this.selectedFilePreview"
              class="image"
              :style="`background-image: url('${selectedFilePreview}')`"
            ></div>
            <div
              v-else
              class="image"
              :style="`background-image: url('${cloudinaryOptimizedImage}')`"
            ></div>
          </div>
          <div class="container-image-trigger">
            <input
              type="file"
              name="image"
              accept="image/*"
              @change="onFileSelected"
              style="display:none"
              ref="fileInput"
            />
            <div v-if="this.selectedFile" class="image-name">
              <span>{{this.selectedFile.name}}</span>
            </div>
            <button type="button" @click="$refs.fileInput.click()">Choose File</button>
          </div>
          <div class="container-image-save">
            <div v-if="this.selectedFile" class="image-clear">
              <span @click="onRemoveImage">Clear Selection</span>
            </div>
            <button type="submit" :disabled="(!this.selectedFile) ? true : false">Upload</button>
          </div>
          <div
            v-if="user.image && user.image.indexOf('profile-placeholder') === -1"
            class="container-image-reset"
          >
            <button type="button" @click="onResetImage">Reset</button>
          </div>
        </form>
      </div>
      <form
        action
        method="post"
        @submit.prevent="updateUserProfileConfirmationModal"
        class="form_edit_profile"
      >
        <div class="field">
          <input v-model="user.firstName" type="text" id="fname" name="first_name" required />
          <label for="fname" :class="{ active: isFirstName }">
            First Name
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input v-model="user.lastName" type="text" id="lname" name="last_name" required />
          <label for="lname" :class="{ active: isLastName }">
            Last Name
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input
            v-model="user.phoneNumber"
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
        <template v-if="user.userRoleId === 2 || user.userRoleId === 3">
          <template v-for="(interest, index) in user.interests">
            <div class="field" :key="index">
              <input v-model="interest.interest" :id="`interest-${index}`" name="interest" />
              <label
                :for="`interest-${index}`"
                :class="{ active: (interest.interest !== '') ? true : false }"
              >Interest</label>
            </div>
          </template>
          <template v-if="user.interests && user.interests.length < 6">
            <div class="field">
              <input
                v-model="additionalInterest"
                id="interest-additional"
                name="interest_additional"
              />
              <label
                for="interest-additional"
                :class="{ active: (this.additionalInterest !== '') ? true : false }"
              >Interest</label>
            </div>
          </template>
        </template>
        <div class="field submit">
          <input type="submit" class="btn" value="Update User" />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import EventBus from "../eventBus";
import HandleError from "../utils/handleError";
import HandleSuccess from "../utils/handleSuccess";
import axios from "axios";
import { capitalizeFirstLetter } from "../utils/formatters";
export default {
  name: "editProfile",
  data() {
    return {
      user: {},
      rollbackUser: {},
      additionalInterest: "",
      selectedFile: null,
      selectedFilePreview: null
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
        this.rollbackUser = { ...response.data.result };
      })
      .catch(error => HandleError(error));
  },
  computed: {
    isFirstName() {
      if (this.user.firstName !== "") {
        return true;
      }
      return false;
    },
    isLastName() {
      if (this.user.lastName !== "") {
        return true;
      }
      return false;
    },
    isPhoneNumber() {
      if (this.user.phoneNumber !== "") {
        return true;
      }
      return false;
    },
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
    updateUserProfileConfirmationModal() {
      if (
        this.user.firstName !== "" &&
        this.user.lastName !== "" &&
        this.user.phoneNumber !== ""
      ) {
        const message = `Are you sure you want to update ${capitalizeFirstLetter(
          this.rollbackUser.firstName
        )} ${capitalizeFirstLetter(this.rollbackUser.lastName)}`;
        EventBus.$emit("OPEN_CONFIRMATION_MODAL", {
          message,
          confirmFn: this.updateUser.bind(this),
          cancelFn: this.resetUser.bind(this)
        });
      } else {
        // handle UI validation messages
        HandleError({ message: "Please complete all fields." });
      }
    },
    onFileSelected(event) {
      const reader = new FileReader();
      reader.onload = e => {
        this.selectedFilePreview = e.target.result;
      };
      if (event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]);
        this.selectedFile = event.target.files[0];
      }
    },
    onRemoveImage() {
      this.selectedFilePreview = null;
      this.selectedFile = null;
      this.$refs.fileInput.value = "";
    },
    onUploadImage() {
      // exit if no image selected
      if (!this.selectedFile) {
        return;
      }
      const fd = new FormData();
      fd.append("image", this.selectedFile);
      // for (var pair of fd.entries()) {
      //   console.log(pair[0]+ ', ' + pair[1]);
      // }
      const url = "/api/user/current/profile-image";
      const axiosData = fd;
      const axiosConfig = {
        crossDomain: true,
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
        // onUploadProgress: uploadEvent => {
        //   console.log('upload progress' + Math.round(uploadEvent.loaded / uploadEvent.total * 100) + '%')
        // }
      };
      // Start Loader
      EventBus.$emit("START_LOADING");
      axios
        .post(url, axiosData, axiosConfig)
        .then(response => {
          this.user = response.data.result;
          // clear file
          this.onRemoveImage();
          HandleSuccess(
            `${response.data.result.firstName} ${response.data.result.lastName} profile picture has been updated`
          );
        })
        .catch(error => HandleError(error));
    },
    onResetImage() {
      // show reset if not using placeholder image
      const url = "/api/user/current/profile-image/reset";
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
          this.user = response.data.result;
          // clear file
          this.onRemoveImage();
          HandleSuccess(
            `${response.data.result.firstName} ${response.data.result.lastName} profile picture has been reset`
          );
        })
        .catch(error => HandleError(error));
    },
    updateUser() {
      const url = "/api/user/current/update";
      let axiosData = this.user;
      // send additional interest
      if (this.user.interests.length < 6 && this.additionalInterest !== "") {
        axiosData.additionalInterest = { interest: this.additionalInterest };
      }
      const axiosConfig = {
        crossDomain: true,
        withCredentials: true
      };
      // Start Loader
      EventBus.$emit("START_LOADING");
      axios
        .put(url, axiosData, axiosConfig)
        .then(response => {
          this.user = response.data.result;
          // clear additional interest
          this.additionalInterest = "";
          HandleSuccess(
            `${response.data.result.firstName} ${response.data.result.lastName} has been updated`
          );
        })
        .catch(error => HandleError(error));
    },
    resetUser() {
      this.user = { ...this.rollbackUser };
    }
  }
};
</script>

<style lang="scss" scoped>
.a-link {
  display: inline-block;
  margin-top: 10px;
  margin-bottom: 50px;
  border: none;
  background-color: transparent;
  text-transform: none;
  font-weight: 400 !important;
  text-decoration: underline;
  color: $yellow-dark !important;
}

.container-form {
  @media only screen and (min-width: $tablet) {
    max-width: none;
    margin: 0;
  }
}

.form_edit_profile {
  @media only screen and (min-width: $tablet) {
    display: flex;
    flex-wrap: wrap;
  }
}

.container-image-upload {
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;

  @media only screen and (min-width: $tablet) {
    flex-direction: row;
    align-items: flex-end;
    margin: 0 3% 40px;
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

.container-image-trigger,
.container-image-save,
.container-image-reset {
  padding-top: 20px;

  @media only screen and (min-width: $tablet) {
    padding-top: 0;
    padding-left: 40px;
    padding-right: 40px;
  }
}

.container-image-save {
  @media only screen and (min-width: $tablet) {
    flex-basis: 200px;
  }
}

.image-name,
.image-clear {
  padding-bottom: 10px;
}

.image-clear {
  cursor: pointer;
}
</style>