<template>
  <header class="bg-light shadow-sm" :class="isLoggedIn ? 'p-2' : 'p-3' ">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-between">
        <!-- Logo et nom du réseau social -->
        <router-link to="/">
          <img :src="require('../../assets/images/logo/moments_logo.svg')" alt="logo du réseau social Moments" width="40" height="40" class="me-3" title="Bienvenue sur Moments, le réseau social interne de Groupomania" role="img">
          <a class="navbar-brand text-dark text-logo" v-if="!isLoggedIn">Moments <span class="owner">from Groupomania</span></a>
        </router-link>

        <!-- Menu pour un utilisateur authentifié -->
        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0" v-if="isLoggedIn">
          <router-link to="/feed"><li><a class="nav-link px-2 text-dark" title="Consulter le fil d'actualité"><img src="../../assets/icons/navbar/journal-richtext.svg" alt="journal rich text" class="me-2" role="img">Fil d'actualité</a></li></router-link>
          <router-link to="/profile"><li><a class="nav-link px-2 text-dark" title="Voir votre profil"><img src="../../assets/icons/navbar/person-circle.svg" alt="person in circle" class="me-2" role="img">Profil</a></li></router-link>
          <li v-if="isAdmin"><a class="nav-link px-2 text-dark">Administration</a></li>
        </ul>

        <!-- Inscription ou Connexion : utilisateur non authentifié -->
        <div class="justify-content-center-sm d-flex text-end" v-if="!isLoggedIn">
          <router-link to="/register"><button type="button" class="btn btn-primary me-3">S'inscrire gratuitement</button></router-link>
          <router-link to="/login"><button type="button" class="btn btn-outline-dark">Se connecter</button></router-link>
        </div>

        <!-- Avatar et menu : utilisateur authentifié -->
        <Avatar />
      </div>
    </div>
  </header>
</template>

<script>
import Avatar from '../user/Avatar.vue'

export default { 
  name: 'NavBar',
  data() {
    return {
      isLoggedIn: '',
    }
  },
  async created() {
    if(this.$store.getters.isLoggedIn) {
      this.isLoggedIn = this.$store.getters.isLoggedIn
      this.isAdmin = this.$store.getters.getUser.isAdmin
    }
  },
  components: {
    Avatar,
  }
}
</script>

<style scoped>
@media (max-width: 767px) {
  img {
    display: none;
  }
}

@media (min-width: 768px) {
  img {
    display: inline-block;
  }
}
</style>