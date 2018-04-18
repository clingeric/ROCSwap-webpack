import Vue from "vue";
import Vuex from "vuex";

import axios from "axios";

Vue.use(Vuex);

const getAuthHeader = () => {
  return { headers: { Authorization: localStorage.getItem("token") } };
};

export default new Vuex.Store({
  // Initialize //

  state: {
    user: {},
    token: "",
    loginError: "",
    registerError: ""
  },
  getters: {
    user: state => state.user,
    loginError: state => state.loginError,
    registerError: state => state.registerError,
    getToken: state => state.token,
    loggedIn: state => {
      if (state.token === "") {
        return false;
      }
      return true;
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setLoginError(state, message) {
      state.loginError = message;
    },
    setRegisterError(state, message) {
      state.registerError = message;
    },
    setToken(state, token) {
      state.token = token;
      if (token === '') {
        localStorage.removeItem("token");
      } else {
        localStorage.setItem("token", token);
      }
    }
  },
  actions: {
    register(context, user) {
      axios
        .post("/api/users", user)
        .then(response => {
          context.commit("setUser", response.data.user);
          context.commit("setToken", response.data.token);
          context.commit("setRegisterError", "");
          context.commit("setLoginError", "");
        })
        .catch(error => {
          context.commit("setLoginError", "");
          context.commit("setUser", {});
          context.commit("setToken", "");
          if (error.response) {
            if (error.response.status === 403)
              context.commit(
                "setRegisterError",
                "That email address already has an account."
              );
            else if (error.response.status === 409)
              context.commit(
                "setRegisterError",
                "That user name is already taken."
              );
            return;
          }
          context.commit(
            "setRegisterError",
            "Sorry, your request failed. We will look into it."
          );
        });
    },
    initialize(context) {
      let token = localStorage.getItem("token");
      if (token) {
        // see if we can use the token to get my user account
        axios
          .get("/api/me", getAuthHeader())
          .then(response => {
            context.commit("setToken", token);
            context.commit("setUser", response.data.user);
          })
          .catch(err => {
            // remove token and user from state
            localStorage.removeItem("token");
            context.commit("setUser", {});
            context.commit("setToken", "");
          });
      }
    },
    login(context, user) {
      axios
        .post("/api/login", user)
        .then(response => {
          console.log(response.data.user.fname);
          console.log(response.data.user.email);
          context.commit("setUser", response.data.user);
          context.commit("setToken", response.data.token);
          context.commit("setRegisterError", "");
          context.commit("setLoginError", "");
        })
        .catch(error => {
          context.commit("setRegisterError", "");
          if (error.response) {
            if (error.response.status === 403 || error.response.status === 400)
              context.commit("setLoginError", "Invalid login.");
            context.commit("setRegisterError", "");
            context.commit("setUser", {});
            context.commit("setToken", "");
            return;
          }
          context.commit(
            "setLoginError",
            "Sorry, your request failed. We will look into it."
          );
        });
    },
    logout(context, user) {
      context.commit("setUser", {});
      context.commit("setToken", "");
    }
  }
});
