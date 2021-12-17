<template>
  <div>
    <NavBar />
    <Heroes />
    <Footer />
  </div>
</template>

<script>
import NavBar from '@/components/home/NavBar.vue'
import Heroes from '@/components/home/Heroes.vue'
import Footer from '@/components/home/Footer.vue'

export default {
  name: 'App',
  data() {
    return {
      
    }
  },
  methods: {
    
  },
  components: {
    NavBar,
    Heroes,
    Footer
  }
}
</script>

<style scoped>
p {
  font-family: 'Volkhov', serif;
  font-weight: 700;
  font-size: 3.125rem;
  color: #181E4B;
  margin: 0;
}

.author {
  font-style: italic;
  font-weight: 300;
  color: #181E4B;
}
</style>