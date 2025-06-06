<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title>Register</v-card-title>
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
              label="Password"
              required
              :rules="passwordRules"
              type="password"
            />
            <v-text-field
              v-model="password2"
              :error-messages="password2Errors"
              label="Password2"
              required
              :rules="password2Rules"
              type="password2"
            />
            <v-btn style="margin-bottom: 10px" type="submit" @click="register">register</v-btn>
            <v-spacer />
            <v-spacer />
            Already have an account?
            <v-btn color="primary" href="/login" style="margin-left: 10px">
              login
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
  function displayMessage (message) {
    const currentUser = this.currentUser;
    console.log('显示消息被调用:', message); // 添加调试日志
    const messagesContainer = document.querySelector('.messages-container');
    // 判断是否是自己发送的消息
    const isSelf = message.username === currentUser?.username;
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
  }
  function showPage (page) {
    this.$router.push({ name: page });
  }
  function initWebSocket () {
    const currentUser = this.currentUser;
    let ws=this.ws;
    if (!currentUser) return;

    ws = new WebSocket(`ws://localhost:8082/ws/chat/?user_email=${currentUser.email}`);

    ws.onopen = function () {
      console.log('WebSocket连接已建立');
    };

    ws.onmessage = function (event) {
      const message = JSON.parse(event.data);
      displayMessage(message);
    };

    ws.onclose = function () {
      console.log('WebSocket连接已关闭');
      setTimeout(initWebSocket, 3000);
    };

    ws.onerror = function (error) {
      console.error('WebSocket错误:', error);
    };
  }
  function updateUserInfo () {
    const currentUser = this.currentUser;
    if (currentUser) {
      document.getElementById('username').value = currentUser.username;
      document.getElementById('email').value = currentUser.email;
    }
  }
  export default {
    data: () => ({
      currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
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
      nameErrors () {
        return this.nameRules.filter(rule => !rule(this.name)).map(rule => rule(this.name));
      },
      emailErrors () {
        return this.emailRules.filter(rule => !rule(this.email)).map(rule => rule(this.email));
      },
      passwordErrors () {
        return this.passwordRules.filter(rule => !rule(this.password)).map(rule => rule(this.password));
      },
    },
    // mounted () {
    //   const savedUser = localStorage.getItem('currentUser');
    //   if (savedUser) {
    //     this.currentUser = JSON.parse(savedUser);
    //     updateUserInfo.call(this);
    //     showPage.call(this, 'mainPage');
    //     initWebSocket.call(this);
    //   }
    //   document.querySelector('#registerPage form').addEventListener('submit', function (e) {
    //     e.preventDefault();
    //     this.register();
    //   }.bind(this));
    // },
    methods: {
      async register () {
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
        try {
          const response = await fetch('http://localhost:8082/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: this.username, email: this.email, password: this.password }),
          });

          const data = await response.json();
          if (response.ok) {
            alert('注册成功！');
            // 使用 router 跳转到登录页面
            this.$router.push({ name: 'login' });
          } else {
            alert(data.detail);
          }
        } catch (error) {
          console.error('注册失败:', error);
          alert('注册失败，请稍后重试');
        }
      },
    },
  }
</script>
