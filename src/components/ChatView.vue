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
      <v-container class="messages-container mb-3" style="height: 400px; overflow-y: auto;">
        <v-card class="message received mb-3" outlined>
          <v-card-title class="message-header">
            <v-avatar size="30">
              <span class="white--text text-h5" >CJ</span>
            </v-avatar>
            <span class="sender-name ml-4">李四</span>
            <span class="message-time">10:30</span>
          </v-card-title>
          <v-card-text class="message-content pa-2 d-flex justify-end">
            这是一条示例消息
            <v-spacer />
            <v-icon small>mdi-check-circle</v-icon>
            <span class="read-status grey--text">已读</span>
          </v-card-text>
        </v-card>
        <!-- 更多消息... -->
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
        <v-textarea class="mb-2" outlined placeholder="输入消息..." rows="2" />
        <v-btn class="btn btn-primary" color="primary">
          <v-icon left>mdi-send</v-icon> 发送
        </v-btn>
      </v-card-text>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'ChatView',
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
</style>
