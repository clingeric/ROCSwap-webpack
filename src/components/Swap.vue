<template>
    <div>
        <div id="banner">
            <img class="image-fluid" id="cover" src="/static/img/cover.jpg">
            <button type="button" class="btn btn-primary btn-block" data-toggle="modal" data-target="#share-modal">
                <h3>Share Pass</h3>
            </button>
        </div>
        <div id="readable-center">
            <div id="app3">
                <div id="splash">
                    <h2 class="text-center">Welcome {{ currentUser.fname }}!</h2>
                    <hr>
                </div>
                <div id="no_pass" v-if="passes.length === 0">
                    <h3>It looks like there are no passes to swap :(</h3>
                    <h4>But we'd love for you to share one!</h4>
                </div>
                <!-- <div v-else class="text-center">
                    <div class="filters">
                        <label for="price-filters">
                            <h4>Sort By Price:</h4>
                        </label>
                        <br>
                        <div id="price-filters" class="btn-group" role="group">
                            <a @click="priceLow">
                                <button type="button" class="btn btn-primary"> Low to High </button>
                            </a>
                            <a @click="priceHigh">
                                <button type="button" class="btn btn-primary"> High to Low </button>
                            </a>
                        </div>
                    </div>
                </div> -->
                <div class="row">
                    <div class="col-lg-4 col-md-3 card_div" v-for="pass in passes" :key="pass.id">
                        <div>
                            <a data-toggle="modal" :data-target="'#modal' + pass.id">
                                <div class="borrow_card">
                                    <img class="borrow_image" src="/static/img/pass.JPG">
                                </div>
                            </a>
                            <div class="borrow_body text-center">
                                <h4>{{ pass.availableFrom | formatDate }} - {{ pass.availableTo | formatDate }}</h4>
                                <h5>${{ pass.price }}</h5>
                            </div>
                        </div>
                        <div v-show="currentUser.email === pass.email" @click="removePass(pass.id)" class="remove_card">
                            <span>&times;</span>
                        </div>
                    </div>
                </div>
                <div v-for="pass in passes" :key="pass.id">
                    <div class="modal fade text-center" :id="'modal' + pass.id" tabindex="-1" role="dialog">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="modalTitleOne">Borrow Details</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <h2>Name: {{ pass.fname }} {{ pass.lname }}</h2>
                                    <h3>Phone: {{ pass.phone }}</h3>
                                    <h3>Email: {{ pass.email }}</h3>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade text-center" id="share-modal" tabindex="-1" role="dialog">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div children="modal-header">
                                <h5 class="modal-title" id="shareModalTitle">Swap Pass</h5>
                            </div>
                            <div class="modal-body">
                                <form v-if="!submitted" @submit.prevent="addPass">
                                    <div class="share_form">
                                        <div class="form-row">
                                            <div class="form-group col-md-6">
                                                <label for="startDate">Start Date (YYYY-MM-DD Format):</label>
                                                <input required v-model="addedAvailableFrom" type="text" class="form-control" id="startDate" placeholder="Start Date" />
                                            </div>
                                            <div class="form-group col-md-6">
                                                <label for="endDate">End Date (YYYY-MM-DD Format):</label>
                                                <input required v-model="addedAvailableTo" type="text" class="form-control" id="endDate" placeholder="End Date" />
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="form-group col-md-12">
                                                <label for="price">Price:</label>
                                                <input required v-model="addedPrice" type="text" class="form-control" id="price" placeholder="$ Price" />
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="form-group col-md-12">
                                                <button @click="getPasses" class="btn btn-primary">Submit</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <div v-else>
                                    <h4>Thanks for posting your pass!</h4>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" @click="resetForm" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
        </div>
    </div>
</template>
<script>
import BorrowModal from './BorrowModal';
import axios from "axios";
import moment from 'moment'

const getAuthHeader = () => {
  return { headers: { Authorization: localStorage.getItem("token") } };
};

export default {
    components: { BorrowModal },
    data () {
        return {
            passes: [],
            addedAvailableFrom: "",
            addedAvailableTo: "",
            addedPrice: "",
            submitted: false,
            show: ""
        }
    },
    filters: {
        formatDate: function(value) {
            if (value) {
                return value.substr(0, 10);
            }
        }
    },
    created: function() {
        this.getPasses();
    },
    mounted: function() {
        this.isLoggedIn();
        this.getPasses();
    },
    computed: {
        currentUser: function() {
            return this.$store.getters.user;
        },
        // filteredPasses: function() {
        //     if (this.show === "dateLow")
        //         return this.passes.sort(function(pass1, pass2) {
        //             return pass1.availableFrom - pass2.availableFrom;
        //         });
        //     if (this.show === "dateHigh")
        //         return this.passes.sort(function(pass1, pass2) {
        //             return pass2.availableFrom - pass1.availableFrom;
        //         });
        //     if (this.show === "priceLow")
        //         return this.passes.sort(function(pass1, pass2) {
        //             return parseInt(pass1.price) - parseInt(pass2.price);
        //         });
        //     if (this.show === "priceHigh")
        //         return this.passes.sort(function(pass1, pass2) {
        //             return parseInt(pass2.price) - parseInt(pass1.price);
        //         });
        //     return this.passes;   
        // },
    },
    methods: {
        // priceHigh: function() {
        //     this.show = "priceHigh";
        // },
        // priceLow: function() {
        //     this.show = "priceLow";
        // },
        // dateHigh: function() {
        //     this.show = "dateHigh";
        // },
        // dateLow: function() {
        //     this.show = "dateLow";
        // },
        isLoggedIn: function() {
            if(this.$store.getters.loggedIn === false) {
                this.$router.replace('/');
            }
        },
        addPass: function() {
            axios
                .post("api/passes/" + this.currentUser.id, {
                    availableFrom: this.addedAvailableFrom,
                    availableTo: this.addedAvailableTo,
                    price: this.addedPrice
                },getAuthHeader())
                .then(response => {
                    this.addedAvailableFrom = "";
                    this.addedAvailableTo = "";
                    this.addedPrice = "";
                    this.submitted = true;
                    this.getPasses();
                })
                .catch(err => {});
                this.getPasses();
        },
        getPasses: function() {
            axios.get('api/passes').then(response => {
                this.passes = response.data.passes;
            });
        },
        resetForm: function() {
            this.submitted = false;
        },  
        removePass: function(id) {
            axios
                .delete("/api/passes/" + id, getAuthHeader())
                .then(response => {
                    this.getPasses();
                    return true;
                })
                .catch(err => {});
                this.getPasses();
        }
    }
}
</script>

<style scoped>
.borrow_card {
    margin: 1rem;
    border-radius: 10px; 
    box-shadow: 5px 10px 8px #888888;
}

.borrow_body {
    line-height: 50%;
    
}

.borrow_body h5 {
    font-weight: bold;
}
.borrow_image {
    width: 100%;
    text-align: center;
    border-radius: 10px;
}

.remove_card {
    background-color: black;
    color: white;
    height: 30px;
    width: 30px;
    position: absolute;
    top: 0;
    right: 10;
    border-radius: 15px;
    border-color: white;
    border-width: 3px;
    border-style: solid;
    text-align: center;
    font-weight: bold;
}

.card_div {
    position: relative;
}

.filters {
    display: inline-block;
}

.flex-container {
    padding: 0;
    margin: 0;
    list-style: none;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: center;
}
.flex-item {
    padding: 5px;
    width: 200px;
    height: 150px;
    margin: 10px;
    line-height: 150px;
}

.flex-item-photo {
    width: 200px;
    height: 150px;
    
}
body {
    font-family: 'Inconsolata', monospace;
    padding-bottom: 10rem;
}

html, body {
    max-width: 100%;
    overflow-x: hidden;
}

#banner {
    text-align: center;
    background-color: lightgrey;
    max-width: 100%;
    height: auto;
    margin-bottom: 1rem;
    margin-top: 1rem;   
}

#cover {
    max-width: 60%; 
    height: auto;
}

#foot {
    margin-top: 2rem;
    padding-top: 2rem;
    margin-bottom: -2rem;
    text-align: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 100px;
    background-color: #E9ECEF;
}

#foot_content {
    padding-top: 1rem;
}

.menu_item {
    margin: .5rem;
}

#active {
    background-color: #007BFF;
    color: white;
}

.share_form {
    margin-right: 3rem;
    margin-left: 3rem;
    margin-bottom: 3rem;
}

.form_breathing_room {
    margin: 2rem;
}

.flex-container {
    padding: 0;
    margin: 0;
    list-style: none;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: center;
}
.flex-item {
    padding: 5px;
    width: 200px;
    height: 150px;
    margin: 10px;
    line-height: 150px;
}

.flex-item-photo {
    width: 200px;
    height: 150px;
    
}

.borrow_card {
    margin: 1rem;
    border-radius: 10px; 
    box-shadow: 5px 10px 8px #888888;
}

.borrow_body {
    line-height: 50%;
    
}

.borrow_body h5 {
    font-weight: bold;
}
.borrow_image {
    width: 100%;
    text-align: center;
    border-radius: 10px;
}

#splash_image {
    width: 60%;
    margin-top: 2rem;
}


.grid_container {
    display: grid;
    grid-template-areas: 
        "share borrow"
        "photo photo"
        "photo photo";
    grid-template-columns: auto;
    grid-template-rows: auto;
    grid-row-gap: 50px;
    justify-items: center;
}

#share {
    grid-area: share;
    width: 50%;
}

#borrow {
    grid-area: borrow;
    width: 50%;
}

#twitter {
    grid-area: twitter;
    
}

#photo {
    grid-area: photo;
}

#brand {
    color: #007BFF;
    font-family: 'Inconsolata', monospace;
    padding-left: 2rem;
    padding-right: 1rem;
}

#responsiveNav {
    background-color: #007BFF;
}

#readable_center {
    margin: 5rem;
    text-align: center;
}

#no_pass {
    text-align: center;
    margin: 2rem;
}

.modal-subtitle {
    text-align: center;
    margin: 1rem;
    font-size: 1.5rem;
}

.remove_card {
    background-color: black;
    color: white;
    height: 30px;
    width: 30px;
    position: absolute;
    top: 0;
    right: 10;
    border-radius: 15px;
    border-color: white;
    border-width: 3px;
    border-style: solid;
    text-align: center;
    font-weight: bold;
}

.card_div {
    position: relative;
}

#beta-warning {
    background-color: red;
    color: white;
    text-align: center;
}

.filters {
    display: inline-block;
}
</style>
