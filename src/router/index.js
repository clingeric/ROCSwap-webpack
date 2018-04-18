import Vue from "vue";
import Router from "vue-router";
import HelloWorld from "@/components/HelloWorld";
import Swap from "@/components/Swap";
import Login from "@/components/Login";
import Account from "@/components/Account";
import About from "@/components/About";
import RegisterUser from "@/components/RegisterUser";

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login
    },
    {
      path: "/HelloWorld",
      name: "HelloWorld",
      component: HelloWorld
    },
    {
      path: "/swap",
      name: "Swap",
      component: Swap
    },
    {
      path: "/about",
      name: "About",
      component: About
    },
    {
      path: "/account",
      name: "Account",
      component: Account
    },
    {
      path: "/register",
      name: "RegisterUser",
      component: RegisterUser
    }
  ]
});
