<template>
    <div>
    <h1>Créer un compte</h1>
    <input type="text" placeholder="Prénom" v-model="firstName" />
    <input type="text" placeholder="Nom" v-model="lastName" />
    <input type="text" placeholder="Email" v-model="email" />
    <input type="text" placeholder="Mot de passe" v-model="password" />
    <input
      type="text"
      placeholder="Confirmation mot de passe"
      v-model="pwdConfirm"
    />
    <input type="button" @click="signUp" value="Créer un compte" />
    <p v-if="msg">{{ msg }}</p>
  </div>
</template>

<script>
import auth from '../services/auth'

export default {
    data() {
        return {
            firstName:'',
            lastName:'',
            email:'',
            password:'',
            pwdConfirm:'',
            msg:''
        }
    },
    methods: {
        async signUp() {
        try {
            const credentials = {
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                password: this.password,
                pwdConfirm: this.pwdConfirm
            };
            const response = await auth.signUp(credentials);
            this.msg = response.msg;
        } catch (error) {
            console.log(error);
        }
        }
    }
}
</script>

<style>

</style>