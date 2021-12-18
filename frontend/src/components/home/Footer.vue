<template>
<!-- Footer - Start -->
    <footer class="container pt-3">
        <!-- Liens -->
        <div class="row">
            <div class="col-lg-6 col-sm-12">
                <ul class="nav flex-column">
                    <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-dark">À propos</a></li>
                    <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-dark">Conditions générales d'utilisation</a></li>
                    <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-dark">Politique de protection des données</a></li>
                    <li class="nav-item mb-2"><a href="#" class="nav-link p-0 text-dark">Aide</a></li>
                </ul>
            </div>
            <!-- Newsletter -->
            <div class="col-lg-4 offset-lg-1 col-sm-12">
                <form>
                    <h2 class="fs-4">Abonnez-vous à notre newsletter</h2>
                    <p>Un résumé mensuel de ce qui est nouveau et de vos meilleurs Moments.</p>
                    <div class="d-flex w-100 gap-2">
                        <label for="newsletter1" class="visually-hidden">Adresse email</label>
                        <input id="newsletter1" type="text" class="form-control" placeholder="exemple@groupomania.fr">
                        <button class="btn btn-primary" type="button">S'abonner</button>
                    </div>
                </form>
            </div>
        </div>
        <div class="d-flex justify-content-between pt-4 mt-4 border-top">
            <p>&copy; {{ copyright }} &middot; Inc. Tous droits réservés.</p>
            <p>Made with
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-suit-heart-fill love" viewBox="0 0 16 16">
                    <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z"/>
                </svg>
                by an <a class="oc" :href="urlOC">OpenClassrooms</a> <a class="text-dark" :href="studentGitUrl" :title="studentIdentity">student</a>.
            </p>
        </div>
    </footer>
<!-- Footer - End -->
</template>

<script>
export default {
    name: 'Footer',
    data() {
        return {
            companyName: 'Groupomania',
            studentGitUrl: 'https://github.com/wibeunltd',
            studentIdentity: 'Willy Beaucal',
            urlOC: 'https://openclassrooms.com/fr/'
        }
    },
    computed: {
        copyright() {
            const currentYear = new Date().getFullYear()
            return `${currentYear} ${this.companyName}`
        }
    }
}
</script>

<style scoped>
.featurette-divider {
  margin: 3rem 0;
}

.love {
    color: rgba(255, 82, 82, 1);
    animation: breathing 3s infinite;
    margin: 0 .2rem .2rem .2rem
}

@keyframes breathing{
    0%{transform:scale(1)}
    50%{transform:scale(1.3)}
    100%{transform:scale(1)}
}

.oc{
    color: #7451eb;
}
</style>