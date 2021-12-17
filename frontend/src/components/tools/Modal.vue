<template>
  <div>
        <!-- Modal -->
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content rounded-4 shadow">
                    <div class="modal-body p-4 text-center">
                        <!-- Titre de la modal -->
                        <h5 class="mb-0">
                            <slot name="title">
                            Titre par défaut
                            </slot>
                        </h5>
                        <!-- Texte de la modal -->
                        <p class="mb-0">
                            <slot name="texte">
                            Texte par défaut
                            </slot>
                        </p>
                    </div>
                    <div class="modal-footer flex-nowrap p-0">
                        <!-- Bouton d'action de la modal -->
                        <button type="button" class="btn btn-lg btn-link fs-6 text-decoration-none text-danger col-6 m-0 rounded-0 border-right" data-bs-dismiss="modal" @click.prevent="action">
                            <slot name="action-button">
                            <strong>Action par defaut</strong>
                            </slot>
                        </button>
                        <!-- Bouton de fermeture de la modal -->
                        <button type="button" class="btn btn-lg btn-link fs-6 text-decoration-none col-6 m-0 rounded-0" data-bs-dismiss="modal">
                            <slot name="close-button">
                            Fermeture modal
                            </slot>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Modal',
    data() {
        return {
            
        }
    },
    methods: {
        action() {
            this.$emit('action')
        }
    }
}
</script>

<style scoped>
.border-right { border-right: 1px solid #eee; }
</style>