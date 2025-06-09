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
          </v-form>
          <!--            <v-checkbox-->
          <!--              v-model="checkbox"-->
          <!--              label="Do you agree?"-->
          <!--              required-->
          <!--              :rules="[v => !!v || 'You must agree to continue!']"-->
          <!--            />-->
          <v-btn style="margin-bottom: 10px" type="submit" @click="login">Login</v-btn>
          <v-spacer />
          <v-btn color="primary" href="/forgot-password" style="margin-bottom: 10px">
            Forgot Password?
          </v-btn>
          <v-spacer />
          <v-btn color="primary" href="/register">
            Register
          </v-btn>

        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
      import API from '@/config/api';
  export default {
    data: () => ({
      currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
      ws: null,
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
      async login () {
        if (!this.$refs.form.validate()) {
          alert('请检查输入是否正确');
          return;
        }

        try {

          // 修改fetch调用
          const response = await fetch(API.LOGIN, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: this.email, password: this.password }),
          });

          const data = await response.json();
          if (response.ok) {
            this.currentUser = data.user;
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            alert('登录成功！');
            // location.reload();
            console.log(data);
            // 先跳转再初始化WebSocket
            this.$router.push({ name: 'main' }).then(() => {
              this.initWebSocket();
            }).catch(err => {
              console.error('路由跳转失败:', err);
            });

            //移除updateUserInfo调用，除非确实需要
          } else {
            alert(data.detail);
          }
        } catch (error) {
          console.error('登录失败:', error);
          alert('登录失败，请稍后重试');
        }
      },

      initWebSocket () {
        const currentUser = this.currentUser;
        if (!currentUser) {
          console.error('无法初始化WebSocket: 无当前用户');
          return;
        }

        // 修改WebSocket连接
        this.ws = new WebSocket(API.WS_CHAT(currentUser.email));

        this.ws.onopen = () => {
          console.log('WebSocket连接已建立');
        };

        this.ws.onmessage = event => {
          const message = JSON.parse(event.data);
          this.displayMessage(message);
        };

        this.ws.onclose = () => {
          console.log('WebSocket连接已关闭');
          setTimeout(this.initWebSocket, 3000); // 自动重连
        };

        this.ws.onerror = error => {
          console.error('WebSocket错误:', error);
        };
      },

      displayMessage (message) {
        const isSelf = message.username === this.currentUser?.username;
        const messagesContainer = document.querySelector('.messages-container');
        const messageHtml = `
        <div class="message ${isSelf ? 'sent' : 'received'} mb-3">
          <div class="message-header">
            <img src="${message.avatar}" class="rounded-circle" alt="用户头像">
            <span class="sender-name">${message.username}</span>
            <span class="message-time">${message.time}</span>
            <span class="debug-info">[Debug: ${new Date().toLocaleTimeString()}]</span>
          </div>
          <div class="message-content p-2 bg-light rounded">
            ${message.content}
          </div>
        </div>
      `;
        messagesContainer.insertAdjacentHTML('beforeend', messageHtml);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      },

      updateUserInfo () {
        if (this.currentUser) {
          const usernameInput = document.getElementById('username');
          const emailInput = document.getElementById('email');
          if (usernameInput) usernameInput.value = this.currentUser.username;
          if (emailInput) emailInput.value = this.currentUser.email;
        }
      },
    },
  };
</script>
