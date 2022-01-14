<template>
  <div class="alert alert-primary text-center fixed-bottom mb-0 alert-dismissible fade show" role="alert" :class="display">
    Ce site utilise des cookies pour vous fournir la meilleure expérience de navigation possible. En continuant sur ce site, vous acceptez l'utilisation des cookies.
    <button type="button" class="btn btn-primary btn-sm ms-3 close" data-bs-dismiss="alert" aria-label="Close" @click.prevent="hideCookie">Accepter</button>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: 'CookieBanner',
  data() {
    return {
      display: '',
    }
  },
  created() {
    if (Cookies.get('moments') === undefined || Cookies.get('moments') === 'rejected') {
      Cookies.set('moments', 'rejected', { sameSite: 'strict'})
      this.display = 'd-block'
    } else {
      this.display = 'd-none'
    }
  },
  methods: {
    hideCookie() {
      Cookies.set('moments', 'accepted', { sameSite: 'strict'})
    }
  }
}
</script>

<style scoped>
</style>