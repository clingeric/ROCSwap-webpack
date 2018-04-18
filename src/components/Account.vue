<template>
  <main>
        <div id="banner">
            <img class="image-fluid" id="cover" src="static/img/cover.jpg">
        </div>
        <h1 class="text-center">
            Edit Account Details
        </h1>
        <hr>
        <div id="readable_center">
            <div>
                <p class="error">{{ errorMessage }}</p>
            </div>
            <form id="app5" v-on:submit.prevent="editUser">
                <div class="form-row form_breathing_room">
                    <div class="col-md-6">
                        <label for="firstName">Enter First Name:</label>
                        <input required v-model="addedFName" autocomplete="given-name" type="text" class="form-control" id="firstName" placeholder="First Name">
                    </div>
                    <div class="col-md-6">
                        <label for="lastName">Enter Last Name:</label>
                        <input required v-model="addedLName" autocomplete="family-name" type="text" class="form-control" id="lastName" placeholder="Last Name">
                    </div>
                </div>
                <div class="form-row form_breathing_room">
                    <div class="col-md-12">
                        <label for="email">Enter BYU.EDU Email Address:</label>
                        <input required v-model="addedEmail" autocomplete="email" type="email" class="form-control" id="email" placeholder="Email Address">
                        <small id="emailInfo" class="form-text text-muted">Why BYU.EDU? This helps to make sure that ROCExchange is limited to BYU students only. More information
                            on how to get a BYU.EDU email address,
                            <a href="https://eam.byu.edu/eam/">visit this site.</a>
                        </small>
                    </div>
                </div>
                <div class="form-row form_breathing_room">
                    <div class="col-md-12">
                        <label for="phone">Enter Phone Number:</label>
                        <input required v-model="addedPhone" autocomplete="phone" type="text" class="form-control" id="phone" placeholder="Phone Number">
                    </div>
                </div>
                <div class="form-row form_breathing_room">
                    <div class="col-md-6">
                        <label for="password">Enter Password:</label>
                        <input required v-model="addedPassword" autocomplete="new-password" type="password" class="form-control" id="password" placeholder="Password">
                    </div>
                    <div class="col-md-6">
                        <label for="confirmPassword">Re-enter Password:</label>
                        <input required v-model="addedPassword2" autocomplete="new-password" type="password" class="form-control" id="confirmPassword"
                            placeholder="Password">
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
    </main>
</template>
<script>
import axios from 'axios';

const getAuthHeader = () => {
  return { headers: { Authorization: localStorage.getItem("token") } };
};


export default {
  name: 'Account',
  data () {
    return {
      addedFName: "",
      addedLName: "",
      addedPhone: "",
      addedEmail: "",
      addedPassword: "",
      addedPassword2: "",  
      errorMessage: "",
    }
  },
  created: function () {
      this.$store.dispatch('initialize');
      
  },
  mounted: function() {
    this.isLoggedIn();
  },
  methods: {
    editUser: function() {
      axios.put('api/users/' + this.$store.getters.user.id, {
        fname: this.addedFName,
        lname: this.addedLName,
        phone: this.addedPhone,
        email: this.addedEmail,
        password: this.addedPassword,
      }, getAuthHeader()).catch(err => {
         this.errorMessage = "Our servers are overwhelmed at the moment. Please try again later.";
      });
        this.addedFName = "";
        this.addedLName = "";
        this.addedPhone = "";
        this.addedEmail = "";
        this.addedPassword = "";
        this.addedPassword2 = "";
        this.errorMessage = "Our servers are overwhelmed at the moment. Please try again later.";
        axios
          .get("/api/me", getAuthHeader())
          .then(response => {
            this.$store.commit("setUser", response.data.user);
          });
    },
    isLoggedIn: function() {
            if(this.$store.getters.loggedIn === false) {
                this.$router.replace('/');
            }
        },
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
</style>
