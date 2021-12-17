<template>
    <main class="container col-xxl-10 px-4 py-lg-4 py-sm-2">
        <div class="row flex-lg-row-reverse align-items-center py-4">
            <!-- Illustration -->
            <div class="col-sm-12 col-lg-6">
                <img :src="require('../../assets/images/heroes/messaging.svg')" class="mx-md-auto img-fluid" alt="woman have fun when messaging"  loading="lazy">
            </div>
            <!-- Présentation -->
            <div class="col-lg-6">
                <h1 class="display-3 fw-bold lh-2 mb-3">Publier. Commenter. Aimer.</h1>
                <p class="lead">Après s'être spécialisée dans la grande distribution et avec plus de 600 collaborateurs à ce jour, aujourd'hui nous souhaitons vous proposer une autre façon d'échanger.</p>
                <p class="lead">Afin de favoriser la cohésion d'entreprise, l'harmonie avec soi-même et avec les autres.</p>
                <p class="lead">Découvrez, <span>Moments</span>, notre réseau social interne.</p>
            </div>
        </div>
    </main>
</template>

<script>
export default {
    name: 'Heroes',
}
</script>

<style scoped>
span {
    font-family: 'Montserrat', sans-serif;
    font-weight: 800;
}

@media (max-width: 767px) {
  img {
    display: none;
  }
}

@media (min-width: 768px) {
  img {
    display: block;
  }
}
</style>