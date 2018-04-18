<template>
                <div>
        <h1 id="readable_center">
            Sign Up
        </h1>
        <!-- Check entered info against a GET request from the API -->
        <div id="readable_center">
            <form v-on:submit.prevent="register">
                <div class="form_breathing_room">
                    <div>
                        <p class="error">{{registerError}}</p>
                    </div>
                    <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="fname">First Name:</label>
                                    <input required v-model="addedFName" autocomplete='given-name' type="text" class="form-control" id="fname" placeholder="First Name">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="lname">Last Name:</label>
                                    <input required v-model="addedLName" autocomplete='family-name' type="text" class="form-control" id="lname" placeholder="Last Name">
                                </div>
                            </div>
                        <div class="form-row">
                                <div class="form-group col-md-12">
                                    <label for="phone">Phone:</label>
                                    <input required v-model="addedPhone" autocomplete='tel-national' type="text" class="form-control" id="phone" placeholder="Phone Number">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-12">
                                    <label for="email">Email:</label>
                                    <input required v-model="addedEmail" autocomplete='email' type="email" class="form-control" id="email" placeholder="Email Address">
                                    <small class="form-text text-muted">Why BYU.EDU? This helps to make sure that ROCExchange is limited to BYU students only.
                                        For more information on how to get a BYU.EDU email address,
                                        <a href="https://eam.byu.edu/eam/">visit this site.</a>
                                    </small>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="password">Password:</label>
                                    <input required v-model="addedPassword" autocomplete='password' type="password" class="form-control" id="password" placeholder="Password">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="password2">Password Confirmation:</label>
                                    <input required v-model="addedPassword2" type="password" class="form-control" id="password2" placeholder="Password">
                                </div>
                            </div>
                        <button id="signup_button" type="submit" class="btn btn-primary">Sign Up</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
export default {
  name: 'Register',
  data () {
      return {
        addedFName: "",
        addedLName: "",
        addedPhone: "",
        addedEmail: "",
        addedPassword: "",
        addedPassword2: "" 
      }
  },
  created: function() {
      if (this.$store.getters.loggedIn) {
          router.push('/swap');
      }
  }, 
  computed: {
      registerError: function() {
          return this.$store.getters.registerError;
      },
  },
  methods: {
      register: function() {
          this.$store.dispatch('register', {
              email: this.addedEmail,
              password: this.addedPassword,
              fname: this.addedFName,
              lname: this.addedLName,
              phone: this.addedPhone,
          });
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
</style>
