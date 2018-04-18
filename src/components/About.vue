<template>
  <main>
        <div id="banner">
            <img class="image-fluid" id="cover" src="static/img/cover.jpg">
        </div>
        <h1 class="text-center">
            FAQs
        </h1>
        <hr>
        <div id="readable_center">
            <div id='app4'>
                <div id="accordion">
                    <div v-for="entry in qa" class="card" :key="entry.id">
                        <div class="card-header" :id="'heading' + entry.id">
                            <h5 class="mb-0">
                                <button class="btn btn-link collapsed" data-toggle="collapse" :data-target="'#collapse' + entry.id" aria-expanded="false"
                                    aria-controls="collapseFour">
                                    {{ entry.question }}
                                </button>
                            </h5>
                        </div>
                        <div :id="'collapse' + entry.id" class="collapse" aria-labelledby="'heading' + entry.id" data-parent="#accordion">
                            <div class="card-body">
                                {{ entry.answer }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<script>
export default {
  data () {
        return {
            qa: [
            {
                id: 0,
                question: "Do I have to pay to use the ROCSwap?",
                answer:
                    "No. ROCSwap is a free service available for all BYU students to enjoy BYU sports. If there is a cost associated with a pass, that is to be paid to the student letting you borrow his or her pass, not to the ROCSwap website."
            },
            {
                id: 1,
                question: "Why did you start ROCSwap?",
                answer:
                    "I think BYU sports are fun, and that everyone should be able to go to as many BYU events as they'd like to. But sometimes the cost of the ROC pass and busy schedules get in the way of being able to go to as many events as you'd like. So if you're in the group of those who can't afford a ROC pass, you can borrow one for a low cost or free. If you're in the group of those who can't attend a game because you're busy, then you can share your pass for a cost or free. This way everyone can get full use out of everyone's ROC passes."
            },
            {
                id: 2,
                question: "Is the ROCSwap associated with BYU?",
                answer:
                    "No. This is a personal project that has absolutely no connection to BYU, BYU Athletics, or any official BYU organization."
            },
            {
                id: 3,
                question: "How do I borrow a pass?",
                answer:
                    "After creating an account on the ROCSwap website, you will select a pass that you'd like to borrow from the list of available passes. After you've selected a pass, you can then contact the poster and arrange for payment and pick-up of the pass with your own discretion. ROCSwap is not responsible for any damages, losses, or problems associated with purchasing, picking-up, or using ROC passes."
            }
        ]
        }
    },
}
</script>

<style scoped>

</style>
