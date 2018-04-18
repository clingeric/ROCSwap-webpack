<template>
    <ul class="nav nav-tabs navbar-dark navbar-expand-md justify-content-between">
        <a id="brand" class="navbar-brand"><router-link to='/swap'>ROCSwap</router-link></a>
        <button id="responsiveNav" class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContent">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarContent">
            <li v-for="item in navItems" :key='item.id' class="nav-item">
                <router-link class="nav-link" :to="item.link">{{ item.text }}</router-link>
            </li>
            <li v-if="this.$store.getters.loggedIn" class="nav-item">
                <router-link to='/' class="nav-link"><a @click="logout">LOG OUT</a></router-link>
            </li>
        </div>
    </ul>
</template>
<script>
export default {
  data () {
      return {
          navItems: [
            { id: 0, text: "SWAP", link: "/swap" },
            { id: 1, text: "ACCOUNT", link: "/account" },
            { id: 2, text: "ABOUT", link: "/about" }
        ],
        currentURL: window.location.pathname
      }
    },
    computed: {
        currentUser: function() {
            return this.$store.getters.user;
        }
    },
    methods: {
        logout: function() {
            this.$store.dispatch('logout');
        }
    }
}
</script>

<style scoped>
    #responsiveNav {
        background-color: #007BFF;
    }
    #brand {
        color: #007BFF;
        font-family: 'Inconsolata', monospace;
        padding-left: 2rem;
        padding-right: 1rem;
    }
</style>
