<template>
  <!-- 视频会议页面 -->
  <v-container id="videoPage" class="content-container">
    <v-row>
      <!-- 在线用户列表 -->
      <v-col cols="3">
        <v-card>
          <v-card-title>
            在线用户
          </v-card-title>
          <v-card-text>
            <v-list id="onlineVideoUsers">
              <v-list-item
                v-for="user in onlineUsers"
                :key="user.peer_id"
                class="d-flex justify-space-between align-center"
              >
                <v-list-item-title>{{ user.username }}</v-list-item-title>
                <v-btn
                  small
                  color="primary"
                  @click="startCall(user.peer_id)"
                >
                  呼叫
                </v-btn>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 视频区域 -->
      <v-col cols="9">
        <v-container class="video-container">
          <v-row>
            <v-col>
              <v-card class="video-box">
                <v-card-title>
                  本地视频
                </v-card-title>
                <v-card-text>
                  <video ref="localVideo" class="w-100" style="height: 300px;" />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col>
              <v-card class="video-box">
                <v-card-title>
                  远程视频
                </v-card-title>
                <v-card-text>
                  <video ref="remoteVideo" class="w-100" style="height: 300px;" />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row class="video-controls mt-3">
            <v-col>
              <v-text-field
                id="myPeerid"
                v-model="myPeerId"
                label="我的ID"
                outlined
                readonly
              />
            </v-col>
            <v-col>
              <v-text-field
                id="youPeerid"
                v-model="youPeerId"
                label="对方ID"
                outlined
                placeholder="请输入对方ID"
              />
              <v-btn id="callBtn" color="primary" @click="handleCallBtnClick">开始通话</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import Peer from 'peerjs';

  import API from '@/config/api';

  export default {
    data () {
      return {
        currentUser: null,
        peer: null,
        localStream: null,
        myPeerId: '',
        youPeerId: '',
        onlineUsers: [],
        updateInterval: null
      };
    },
    mounted () {
      // 从localStorage获取当前用户信息
      const userJson = localStorage.getItem('currentUser');
      if (userJson) {
        this.currentUser = JSON.parse(userJson);
      }

      // 初始化视频页面
      this.initVideoPage();

      // 在用户离开页面时清理
      window.addEventListener('beforeunload', this.unregisterUser);
    },
    beforeUnmount () {
      // 清理定时器和事件监听器
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
      }
      window.removeEventListener('beforeunload', this.unregisterUser);

      // 注销视频用户
      this.unregisterUser();

      // 关闭视频流
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
      }

      // 关闭Peer连接
      if (this.peer) {
        this.peer.destroy();
      }
    },
    methods: {
      getUserMedia (constrains, success, error) {
        if (navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia(constrains).then(success).catch(error);
        } else if (navigator.webkitGetUserMedia) {
          navigator.webkitGetUserMedia(constrains).then(success).catch(error);
        } else if (navigator.mozGetUserMedia) {
          navigator.mozGetUserMedia(constrains).then(success).catch(error);
        } else if (navigator.getUserMedia) {
          navigator.getUserMedia(constrains).then(success).catch(error);
        }
      },
      async initVideoPage () {
        if (!this.currentUser) {
          alert('请先登录');
          return;
        }

        try {
          this.getUserMedia({ video: true, audio: true }, async stream => {
            try {
              this.localStream = stream;
              this.$refs.localVideo.srcObject = stream;
              this.$refs.localVideo.autoplay = true;
              this.$refs.localVideo.play();

              // 创建新的 Peer 连接并等待连接建立
              this.peer = new Peer();

              await new Promise((resolve, reject) => {
                this.peer.on('open', async id => {
                  try {
                    console.log('获取到 Peer ID:', id);
                    this.myPeerId = id;

                    // 注册视频用户
                    // 修改fetch调用
                    const response = await fetch(API.VIDEO_REGISTER, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        username: this.currentUser.username,
                        peer_id: id,
                      }),
                    });

                    if (!response.ok) {
                      throw new Error('注册视频用户失败');
                    }

                    // 开始定期获取在线用户列表
                    this.updateOnlineUsers();
                    this.updateInterval = setInterval(() => this.updateOnlineUsers(), 5000);

                    resolve();
                  } catch (error) {
                    reject(error);
                  }
                });

                this.peer.on('error', err => {
                  reject(err);
                });
              });

              // Peer 连接建立后设置呼叫处理
              this.peer.on('call', call => {
                call.answer(this.localStream);
                call.on('stream', remoteStream => {
                  this.$refs.remoteVideo.srcObject = remoteStream;
                  this.$refs.remoteVideo.autoplay = true;
                });
              });

            } catch (error) {
              console.error('初始化视频通话失败:', error);
              alert('初始化视频通话失败，请刷新页面重试');
            }
          }, err => {
            console.log('Failed to get local stream', err);
            alert('无法访问摄像头和麦克风');
          });
        } catch (error) {
          console.error('创建 Peer 连接失败:', error);
        }
      },
      async updateOnlineUsers () {
        try {
          // 修改另一个fetch调用
          const response = await fetch(API.VIDEO_USERS);
          const data = await response.json();

          // 更新在线用户列表
          this.onlineUsers = data.users;
        } catch (error) {
          console.error('获取在线用户失败:', error);
        }
      },
      handleCallBtnClick () {
        const remoteId = this.youPeerId;
        if (remoteId === '') {
          alert('请选择要呼叫的用户');
          return;
        }

        // 添加自身ID检查
        if (remoteId === this.myPeerId) {
          alert('不能呼叫自己');
          return;
        }

        const call = this.peer.call(remoteId, this.localStream);
        call.on('stream', remoteStream => {
          this.$refs.remoteVideo.srcObject = remoteStream;
          this.$refs.remoteVideo.autoplay = true;
        });
      },
      startCall (peerId) {
        this.youPeerId = peerId;
        this.handleCallBtnClick();
      },
      unregisterUser () {
        if (this.currentUser) {
          // 修改第三个fetch调用
          fetch(API.VIDEO_UNREGISTER, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: this.currentUser.username,
            }),
          })
            .then(res => {
              if (!res.ok) {
                console.error('注销视频用户失败');
              }
            })
            .catch(error => {
              console.error('注销视频用户失败:', error);
            });
        }
      },
    },
  };
</script>

<style scoped>
.video-container {
  width: 100%;
}

.video-box {
  margin-bottom: 20px;
}

video {
  background-color: #000;
  border-radius: 4px;
}
</style>
