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
              <!-- 用户列表将通过 JavaScript 动态添加 -->
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
              <v-btn id="callBtn" class="ml-2" color="primary" @click="handleCallBtnClick">开始通话</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import Peer from 'peerjs';

  export default {
    data () {
      return {
        currentUser: null, // 假设你已经有一个方法来设置这个值
        peer: null,
        localStream: null,
        myPeerId: '',
        youPeerId: '',
      };
    },
    mounted () {
      // 如果视频页面是默认显示的页面，可以在这里调用 initVideoPage()
      if (document.getElementById('videoPage')) {
        this.showPage('videoPage');
      }

      // 在用户离开页面时清理
      window.addEventListener('beforeunload', this.unregisterUser);
    },
    beforeUnmount () {
      window.removeEventListener('beforeunload', this.unregisterUser);
    },
    methods: {
      showPage (pageId) {
        const pages = document.querySelectorAll('.content-container');
        pages.forEach(page => page.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');

        // 当切换到视频页面时初始化
        if (pageId === 'videoPage') {
          this.initVideoPage();
        }
      },
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
                this.peer.on('open', id => {
                  try {
                    console.log('获取到 Peer ID:', id);
                    this.myPeerId = id;

                    // 注册视频用户
                    fetch('http://localhost:8082/api/video/register', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        username: this.currentUser.username,
                        peer_id: id,
                      }),
                    })
                      .then(async res => {
                        if (!res.ok) {
                          throw new Error('注册视频用户失败');
                        }

                        // 开始定期获取在线用户列表
                        this.updateOnlineUsers();
                        setInterval(() => this.updateOnlineUsers(), 5000);

                        resolve();
                      })
                      .catch(error => {
                        reject(error);
                      });
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
          const response = await fetch('http://localhost:8082/api/video/users');
          const data = await response.json();
          const usersList = document.getElementById('onlineVideoUsers');
          usersList.innerHTML = '';

          data.users.forEach(user => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
            ${user.username}
            <button class="btn btn-sm btn-primary" onclick="startCall('${user.peer_id}')">
              呼叫
            </button>
          `;
            usersList.appendChild(li);
          });
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
          fetch('http://localhost:8082/api/video/unregister', {
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
/* 你的样式代码 */
</style>
