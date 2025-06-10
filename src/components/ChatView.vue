<template>
  <v-card id="chatPage" class="content-container">
    <!-- 聊天头部 -->
    <v-card-title class="chat-header border-bottom pa-3 mb-3">
      <div class="d-flex justify-space-between align-center">
        <h2>团队聊天室</h2>
        <v-menu offset-y>
          <template #activator="{ on, attrs }">
            <v-btn class="btn btn-secondary" v-bind="attrs" v-on="on">
              <v-icon left>mdi-cog</v-icon> 设置
            </v-btn>
          </template>
          <v-list>
            <v-list-item href="#">
              <v-list-item-title>查看聊天记录</v-list-item-title>
            </v-list-item>
            <v-list-item href="#">
              <v-list-item-title>清空聊天窗口</v-list-item-title>
            </v-list-item>
            <v-list-item href="#">
              <v-list-item-title>通知设置</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-card-title>

    <!-- 成员列表 -->
    <v-card-text class="members-list mt-2 d-flex flex-wrap">
      <v-avatar class="member-item me-2" size="40">
        <span class="white--text text-h5" >VV</span>
      </v-avatar>
      <v-icon class="online-status online">mdi-checkbox-marked-circle</v-icon>
      <span class="member-name text-h5">张三</span>
      <!-- 更多成员... -->
    </v-card-text>

    <!-- 聊天主体区域 -->
    <v-card-text class="chat-container">
      <!-- 搜索栏 -->
      <v-text-field class="search-bar mb-3" outlined placeholder="搜索聊天记录..." />

      <!-- 消息列表区域 -->
      <v-container class="messages-container mb-3" style="height: 400px; overflow-y: auto;" ref="messagesContainer">
        <v-card v-for="(message, index) in messages" :key="index"
               :class="['message mb-3', message.username === currentUser?.username ? 'sent' : 'received']"
               outlined>
          <v-card-title class="message-header">
            <v-avatar size="30">
              <span class="white--text text-h5">{{ message.username.substring(0, 2).toUpperCase() }}</span>
            </v-avatar>
            <span class="sender-name ml-4">{{ message.username }}</span>
            <span class="message-time">{{ message.time }}</span>
          </v-card-title>
          <v-card-text class="message-content pa-2 d-flex justify-end">
            {{ message.content }}
            <v-spacer />
            <v-icon small>mdi-check-circle</v-icon>
            <span class="read-status grey--text">已读</span>
          </v-card-text>
        </v-card>
      </v-container>

      <!-- 输入区域 -->
      <v-card-text class="input-area border-top pa-3">
        <v-card-actions class="toolbar mb-2">
          <v-btn class="me-2" icon title="表情">
            <v-icon>mdi-emoticon</v-icon>
          </v-btn>
          <v-btn class="me-2" icon title="上传文件">
            <v-icon>mdi-paperclip</v-icon>
          </v-btn>
          <v-btn class="me-2" icon title="语音消息">
            <v-icon>mdi-microphone</v-icon>
          </v-btn>
          <v-btn class="me-2" icon title="视频通话">
            <v-icon>mdi-video</v-icon>
          </v-btn>
        </v-card-actions>
        <v-textarea class="mb-2" outlined placeholder="输入消息..." rows="2" v-model="messageInput" @keypress.enter.prevent="sendMessage" />
        <v-btn class="btn btn-primary" color="primary" @click="sendMessage">
          <v-icon left>mdi-send</v-icon> 发送
        </v-btn>
      </v-card-text>
    </v-card-text>
  </v-card>
</template>

<script>
  import API from '@/config/api';
  export default {
    name: 'ChatView',
    data() {
      return {
        ws: null,
        currentUser: null,
        messages: [],
        messageInput: ''
      }
    },
    mounted() {
      // 从 localStorage 获取当前用户信息
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
        this.initWebSocket();
      }
    },
    beforeDestroy() {
      // 组件销毁前关闭 WebSocket 连接
      if (this.ws) {
        this.ws.close();
      }
    },
    methods: {
      initWebSocket() {
        if (!this.currentUser) return;



        // 修改WebSocket连接
        this.ws = new WebSocket(API.WS_CHAT(this.currentUser.email));

        this.ws.onopen = () => {
          console.log('WebSocket连接已建立');
        };

        this.ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          this.displayMessage(message);
        };

        this.ws.onclose = () => {
          console.log('WebSocket连接已关闭');
          setTimeout(() => this.initWebSocket(), 3000);
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket错误:', error);
        };
      },
      displayMessage(message) {
        this.messages.push(message);
        // 滚动到底部
        this.$nextTick(() => {
          if (this.$refs.messagesContainer) {
            this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
          }
        });
      },
      sendMessage() {
        if (!this.currentUser) {
          alert('请先登录');
          return;
        }

        const content = this.messageInput.trim();
        if (!content) return;

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          console.log('发送消息:', content);
          const message = {
            username: this.currentUser.username,
            content: content
          };
          this.ws.send(JSON.stringify(message));
          this.messageInput = '';
        } else {
          alert('WebSocket 连接已断开，请刷新页面重试');
        }
      }
    }
  }
</script>

<style scoped>
.border-bottom {
  border-bottom: 1px solid #ccc;
}
.border-top {
  border-top: 1px solid #ccc;
}
.online-status.online {
  color: green;
}
.message.sent {
  margin-left: auto;
  margin-right: 0;
}
.message.received {
  margin-right: auto;
  margin-left: 0;
}
.message {
  max-width: 80%;
}
.message-content {
  position: relative;
}
.read-status {
  font-size: 0.8em;
  color: #6c757d;
}
</style>
