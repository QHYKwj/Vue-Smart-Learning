<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title>Login</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="email"
              :error-messages="emailErrors"
              label="Email"
              required
              :rules="emailRules"
              type="email"
            />
            <v-text-field
              v-model="password"
              :error-messages="passwordErrors"
              label="Password"
              required
              :rules="passwordRules"
              type="password"
            />
            <v-checkbox
              v-model="checkbox"
              label="Do you agree?"
              required
              :rules="[v => !!v || 'You must agree to continue!']"
            />
            <v-btn style="margin-bottom: 10px" type="submit" @click="login">Login</v-btn>
            <v-spacer />
            <v-btn color="primary" href="/forgot-password" style="margin-bottom: 10px">
              Forgot Password?
            </v-btn>
            <v-spacer />
            <v-btn color="primary" href="/register">
              Register
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
    }),
    computed: {
      emailErrors () {
        return this.emailRules.filter(rule => !rule(this.email)).map(rule => rule(this.email));
      },
      passwordErrors () {
        return this.passwordRules.filter(rule => !rule(this.password)).map(rule => rule(this.password));
      },
    },
    methods: {
      login () {
        if (this.$refs.form.validate()) {
          if (!this.email || !this.password || !this.checkbox) {
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
