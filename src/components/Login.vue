<template>
    <div>
        <h1 id="readable_center">
            Login
        </h1>
        <!-- Check entered info against a GET request from the API -->
        <div id="readable_center">
            <form v-on:submit.prevent="login" id="app6">
                <div class="form_breathing_room">
                    <div>
                        <p class="error">{{loginError}}</p>
                    </div>
                    <div v-if="this.$store.getters.loggedIn" id="success_alert" class="text-center alert alert-success">
                        <h4><strong>Success!</strong></h4>
                        <hr>
                        <h5>Successfully Logged In</h5>
                        <p>Click <router-link to="/swap">Here</router-link> to continue</p>
                </div>
                    <div class="form-group">
                        <label for="email">Email address</label>
                        <input required type="email" v-model="addedEmail" class="form-control" id="email" placeholder="Email">
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input required type="password" v-model='addedPassword' class="form-control" id="password" placeholder="Password">
                    </div>
                    <div class="form-group">
                        <button type="submit" class="btn btn-large btn-primary">Login</button>
                    </div>
                </div>
            </form>
            <div class="text-center">
                <p>Don't have an account?<router-link to="/register"> Sign up for free.</router-link></p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'login',
    data () {
        return {
            addedEmail: "",
            addedPassword: "",
            successMessage: "",
            inUsers: true,
        }
    }, 
    computed: {
        user: function() {
            return this.$store.getters.user;
        },
        loggedIn: function() {
            return this.$store.getters.loggedIn;
        },
        loginError: function() {
            return this.$store.getters.loginError;
        },
    },
    methods: {
        login: function() {
            this.$store.dispatch('login',{
                email: this.addedEmail,
                password: this.addedPassword,
            }).then(user => {
	            this.addedEmail = '';
                this.addedPassword = '';            
            });
            
        },
        logout: function() {
            this.$store.dispatch('logout');
        }
    }
}
</script>

<style scoped>
    .error {
        color: red;
        font-weight: bold;
        font-size: 1rem;
        font-style: italic;
    }
    .success {
        color: rgb(0, 90, 0);
        font-weight: bold;
        font-size: 1rem;
        font-style: italic;
    }
</style>
