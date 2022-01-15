<template>
  <div>
    <router-view />
    <CookieBanner />
  </div>
</template>

<script>
import CookieBanner from '@/components/tools/CookieBanner.vue'
export default {
  data() {
    return {

    }
  },
  components: {
    CookieBanner
  }
}
</script>

<style>
</style>
