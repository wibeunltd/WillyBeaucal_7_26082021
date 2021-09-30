<template>
  <div class="px-4 py-5 my-5 text-center">
    <h1 class="display-5 fw-bold">Accueil</h1>
    <div class="col-lg-6 mx-auto">
      <p class="lead mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores exercitationem provident sequi at in quasi veritatis illum non ullam.</p>
      <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
          <router-link to='/register'>
              <button type="button" class="btn btn-primary btn-lg px-4 gap-3">Créer un compte</button>
          </router-link>
        <router-link to='/login'>
            <button type="button" class="btn btn-outline-secondary btn-lg px-4">Se connecter à son compte</button>
        </router-link>
        
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>