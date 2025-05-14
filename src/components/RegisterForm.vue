<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title>Register</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              label="Name"
              type="name"
              v-model="name"
              :rules="nameRules"
              :error-messages="nameErrors"
              :counter="10"
              required
            />
            <v-text-field
              label="Email"
              type="email"
              v-model="email"
              :rules="emailRules"
              :error-messages="emailErrors"
              required
            />
            <v-text-field
              label="Password"
              type="password"
              v-model="password"
              :rules="passwordRules"
              :error-messages="passwordErrors"
              required
            />
            <v-text-field
              label="Password2"
              type="password2"
              v-model="password2"
              :rules="password2Rules"
              :error-messages="password2Errors"
              required
            />
            <v-btn type="submit" @click="register" style="margin-bottom: 10px">register</v-btn>
            <v-spacer></v-spacer>
            <v-spacer> </v-spacer>
            Already have an account?
            <v-btn href="/login" color="primary" style ="margin-left: 10px">
              login
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data: () => ({
    valid: true,
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    password: '',
    passwordRules: [
      v => !!v || 'Password is required',
    ],
    checkbox: false,
    password2: '',
    password2Rules: [
      v => !!v || 'Password is required',
      v => v === this.password || 'Passwords must match',
    ],
    name: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(v) || 'Name must contain only letters',
    ],
  }),
  computed: {
    nameErrors() {
      return this.nameRules.filter(rule => !rule(this.name)).map(rule => rule(this.name));
    },
    emailErrors () {
      return this.emailRules.filter(rule => !rule(this.email)).map(rule => rule(this.email));
    },
    passwordErrors () {
      return this.passwordRules.filter(rule => !rule(this.password)).map(rule => rule(this.password));
    },
  },
  methods: {
    register () {
      if (this.$refs.form.validate()) {
        if (!this.email || !this.password || !this.password2 || !this.name) {
          alert('Login failed. Please check your email, password, and agree to the terms.');
        } else {
          console.log('Logging in with email:', this.email);
          // TODO: Implement login functionality
        }
      } else {
        alert('Login failed. Please check your email, password, and agree to the terms.');
      }
    },
  },
}
</script>
