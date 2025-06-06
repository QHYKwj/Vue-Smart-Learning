<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title>Settings</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="name"
              :counter="10"
              :error-messages="nameErrors"
              label="Name"
              required
              :rules="nameRules"
              type="name"
            />
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
              label="New Password"
              required
              :rules="passwordRules"
              type="password"
            />
            <v-btn style="margin-bottom: 10px" type="submit" @click="register">Save</v-btn>
            <v-spacer />
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
      email: '123@123.com',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      password: '',
      checkbox: false,
      name: 'zhangsan',
      nameRules: [
        v => !!v || 'Name is required',
        v => /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(v) || 'Name must contain only letters',
      ],
    }),
    computed: {
      nameErrors () {
        return this.nameRules.filter(rule => !rule(this.name)).map(rule => rule(this.name));
      },
      emailErrors () {
        return this.emailRules.filter(rule => !rule(this.email)).map(rule => rule(this.email));
      },
    },
    methods: {
      register () {
        if (this.$refs.form.validate()) {
          if (!this.email || !this.password || !this.name) {
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
