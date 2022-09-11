import Vue from "vue";
import VueRouter from "vue-router";
import Cookie from "js-cookie";

import NotFound from "./views/NotFound.vue";
import Login from "./views/Login.vue";
import ForgotPassword from "./views/ForgotPassword.vue";
import ForgotPasswordReset from "./views/ForgotPasswordReset.vue";
import AdminArea from "./views/AdminArea.vue";
import ManageUsers from "./views/ManageUsers.vue";
import Profile from "./views/Profile.vue";
import Home from "./views/Home.vue";
import Neighbors from "./views/Neighbors.vue";
import Events from "./views/Events.vue";
import Contacts from "./views/Contacts.vue";

import jwtDecode from "./utils/jwtDecode";

import Default from "./components/Default.vue";
import MyProfile from "./components/MyProfile.vue";
import EditProfile from "./components/EditProfile.vue";
import ChangePassword from "./components/ChangePassword.vue";
import OwnerRegistrationConfirmation from "./components/OwnerRegistrationConfirmation.vue";
import UserRegistrationConfirmation from "./components/UserRegistrationConfirmation.vue";

// EVENT BUS so can use for error and success messages
import EventBus from "./eventBus";

Vue.use(VueRouter);

let router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      name: "login",
      path: "/",
      component: Login,
    },
    {
      name: "forgotPassword",
      path: "/forgot-password",
      component: ForgotPassword,
    },
    {
      name: "forgotPasswordReset",
      path: "/forgot-password-reset",
      component: ForgotPasswordReset,
    },
    {
      name: "ownerRegistrationConfirmation",
      path: "/owner-registration-confirmation",
      component: OwnerRegistrationConfirmation,
    },
    {
      name: "userRegistrationConfirmation",
      path: "/user-registration-confirmation",
      component: UserRegistrationConfirmation,
    },
    {
      // name: "home", do not name parent route
      path: "/app",
      component: Home,
      meta: {
        authLevel: "User",
      },
      children: [
        {
          // name: "default", do not name parent route
          path: "", // will render inside of router-view for Home component (view)
          meta: {
            authLevel: "User",
          },
          component: Default,
          children: [
            {
              name: "neighbors",
              path: "neighbors",
              meta: {
                authLevel: "User",
              },
              component: Neighbors,
            },
            {
              name: "events",
              path: "events",
              meta: {
                authLevel: "User",
              },
              component: Events,
            },
            {
              name: "Contacts",
              path: "contacts",
              meta: {
                authLevel: "User",
              },
              component: Contacts,
            },
          ],
        },
        {
          name: "admin",
          path: "admin",
          meta: {
            authLevel: "Admin",
          },
          component: AdminArea,
        },
        {
          name: "manageUsers",
          path: "manage-users",
          meta: {
            authLevel: "Owner",
          },
          component: ManageUsers,
        },
        {
          // name: "profile", do not name parent route
          path: "profile",
          meta: {
            authLevel: "User",
          },
          component: Profile,
          children: [
            {
              name: "profileDefault",
              path: "", // will render inside of router-view for Profile component (view)
              meta: {
                authLevel: "User",
              },
              component: MyProfile,
            },
            {
              name: "editProfile",
              path: "edit",
              meta: {
                authLevel: "User",
              },
              component: EditProfile,
            },
            {
              name: "changePassword",
              path: "change-password",
              meta: {
                authLevel: "User",
              },
              component: ChangePassword,
            },
          ],
        },
      ],
    },
    {
      name: "notFound",
      path: "/404",
      component: NotFound,
    },
    {
      name: "catchAll",
      path: "*",
      redirect: "/404",
    },
  ],
});

router.beforeEach((to, from, next) => {
  // console.log(EventBus);
  // reset errors on entry into route
  EventBus.$emit("RESET_ERRORS");
  // reset messages on entry into route
  EventBus.$emit("RESET_MESSAGES");
  // define routes that should be honored when not logged in
  if (
    to.path === "/404" ||
    to.path === "/forgot-password" ||
    to.path === "/forgot-password-reset" ||
    to.path === "/owner-registration-confirmation" ||
    to.path === "/user-registration-confirmation"
  ) {
    return next();
  }

  // check for token cookie (use Cookie library)
  const token = Cookie.get("token");
  if (typeof token === "undefined") {
    // if not already on the home page then redirect
    if (to.path !== "/") {
      return next({
        path: "/",
        // query: { error: "access-denied" }
        // params: { nextUrl: to.fullPath }
      });
    } else {
      return next();
    }
  }
  // decode token cookie and check payload for role
  const jwtPayload = jwtDecode(token);
  if (!jwtPayload || !jwtPayload.role) {
    // if not already on the home page then redirect
    if (to.path !== "/") {
      return next({ path: "/" });
    } else {
      return next();
    }
  }
  // check route authorization level
  if (to.matched.some((record) => record.meta.authLevel)) {
    const authLevel = to.meta.authLevel;
    if (authLevel === "Admin" && jwtPayload.role !== "Admin") {
      // return user to current route (no access to "to" route)
      return next({ path: from.path });
    }
    if (
      authLevel === "Owner" &&
      jwtPayload.role !== "Admin" &&
      jwtPayload.role !== "Owner"
    ) {
      // return user to current route (no access to "to" route)
      return next({ path: from.path });
    }
    // allow access to protected route
    next();
  } else {
    // if logged in but happen to land on login page (such as from 404)
    if (to.name === "login" && token && jwtPayload) {
      return next({ path: "/app" });
    }
    // allow access to unprotected route
    next();
  }
});

export default router;
