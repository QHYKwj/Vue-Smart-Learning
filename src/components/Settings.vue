<template>
  <v-row>
    <v-col cols="12">
      <v-card elevation="2">
        <v-card-title class="pb-0">
          <v-icon left color="primary">mdi-account-cog</v-icon>
          <span class="text-h5">账户设置</span>
        </v-card-title>

        <v-card-text>
          <!-- 加载状态 -->
          <div v-if="loading" class="text-center py-8">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
            />
            <p class="mt-4 text-body-1">加载用户信息中...</p>
          </div>

          <!-- 设置表单 -->
          <v-form
            v-else
            ref="form"
            v-model="valid"
            lazy-validation
            @submit.prevent="updateProfile"
          >
            <!-- 当前信息展示 -->
            <v-alert
              type="info"
              text
              border="left"
              class="mb-4"
            >
              <strong>当前信息：</strong>
              {{ originalData.username }} ({{ originalData.email }})
            </v-alert>

            <!-- 用户名 -->
            <v-text-field
              v-model="formData.username"
              :counter="20"
              label="用户名"
              required
              :rules="nameRules"
              prepend-icon="mdi-account"
              clearable
              outlined
              dense
              :hint="usernameChanged ? '用户名将被更新' : ''"
              persistent-hint
            />

            <!-- 邮箱 -->
            <v-text-field
              v-model="formData.email"
              label="邮箱地址"
              required
              :rules="emailRules"
              type="email"
              prepend-icon="mdi-email"
              clearable
              outlined
              dense
              class="mt-3"
              :hint="emailChanged ? '邮箱将被更新' : ''"
              persistent-hint
            />

            <!-- 密码区域 -->
            <v-expansion-panels class="mt-4" flat>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <div>
                    <v-icon left>mdi-lock-reset</v-icon>
                    修改密码
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-text-field
                    v-model="formData.password"
                    label="新密码"
                    :rules="passwordRules"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-icon="mdi-lock"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                    clearable
                    outlined
                    dense
                    hint="留空则不修改密码，至少6位字符"
                    persistent-hint
                  />

                  <v-text-field
                    v-if="formData.password"
                    v-model="confirmPassword"
                    label="确认新密码"
                    :rules="confirmPasswordRules"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    prepend-icon="mdi-lock-check"
                    :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showConfirmPassword = !showConfirmPassword"
                    clearable
                    outlined
                    dense
                    class="mt-3"
                  />
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <v-divider class="my-6" />

            <!-- 操作按钮 -->
            <v-row>
              <v-col cols="12" sm="6">
                <v-btn
                  color="primary"
                  :loading="updating"
                  :disabled="!valid || !hasChanges"
                  block
                  large
                  @click="updateProfile"
                >
                  <v-icon left>mdi-content-save</v-icon>
                  保存更改
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6">
                <v-btn
                  color="grey darken-1"
                  outlined
                  block
                  large
                  :disabled="updating"
                  @click="resetForm"
                >
                  <v-icon left>mdi-refresh</v-icon>
                  重置
                </v-btn>
              </v-col>
            </v-row>

            <!-- 更改提示 -->
            <v-alert
              v-if="hasChanges"
              type="warning"
              text
              border="left"
              class="mt-4"
            >
              <strong>检测到更改：</strong>
              <ul class="mt-2">
                <li v-if="usernameChanged">用户名: {{ originalData.username }} → {{ formData.username }}</li>
                <li v-if="emailChanged">邮箱: {{ originalData.email }} → {{ formData.email }}</li>
                <li v-if="formData.password">密码: 将被更新</li>
              </ul>
            </v-alert>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- 成功提示 -->
    <v-snackbar
      v-model="successSnackbar"
      color="success"
      timeout="3000"
      top
    >
      {{ successMessage }}
      <template #action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="successSnackbar = false"
        >
          关闭
        </v-btn>
      </template>
    </v-snackbar>

    <!-- 错误提示 -->
    <v-snackbar
      v-model="errorSnackbar"
      color="error"
      timeout="5000"
      top
    >
      {{ errorMessage }}
      <template #action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="errorSnackbar = false"
        >
          关闭
        </v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>

<script>
import axios from 'axios'
import API from '@/config/api';

export default {
  name: 'UserSettings',

  data: () => ({
    valid: false,
    loading: true,
    updating: false,

    // 表单数据
    formData: {
      username: '',
      email: '',
      password: ''
    },

    // 原始数据
    originalData: {
      username: '',
      email: ''
    },

    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,

    // 提示消息
    successSnackbar: false,
    successMessage: '',
    errorSnackbar: false,
    errorMessage: '',

    // 验证规则
    nameRules: [
        v => !!v || '用户名不能为空',
        v => (v && v.length <= 20) || '用户名不能超过20个字符',
        v => (v && v.length >= 1) || '用户名至少1个字符',
        v => /^[\u4e00-\u9fa5a-zA-Z]+([\u4e00-\u9fa5a-zA-Z\s])*$/.test(v) || '用户名只能包含中文、字母和空格，且不能以空格开头'
      ],
    emailRules: [
        v => !!v || '邮箱不能为空',
        v => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v) || '邮箱格式不正确'
      ],
    passwordRules: [
        v => !v || v.length >= 6 || '密码至少需要6位字符',
        v => !v || v.length <= 50 || '密码不能超过50位字符'
      ]
  }),

  computed: {
      confirmPasswordRules() {
        return [
          v => !this.formData.password || !!v || '请确认密码',
          v => !this.formData.password || v === this.formData.password || '两次输入的密码不一致'
        ]
      },

      hasChanges() {
        return (
          this.usernameChanged ||
          this.emailChanged ||
          (!!this.formData.password && this.formData.password.trim() !== '')
        )
      },

      usernameChanged() {
        return this.formData.username.trim() !== this.originalData.username
      },

      emailChanged() {
        return this.formData.email.trim() !== this.originalData.email
      },

    currentUserEmail() {
      // 获取当前用户邮箱的多种方式
      return localStorage.getItem('userEmail') ||
             this.getCurrentUserFromStorage()?.email ||
             this.$store?.state?.user?.email ||
             ''
    }
  },

  async mounted() {
    await this.loadUserProfile()
  },

  methods: {
    // 从localStorage获取当前用户
    getCurrentUserFromStorage() {
      try {
        const currentUser = localStorage.getItem('currentUser')
        return currentUser ? JSON.parse(currentUser) : null
      } catch (error) {
        console.error('解析currentUser失败:', error)
        return null
      }
    },

    // 加载用户信息
    async loadUserProfile() {
      try {
        this.loading = true

        // 检查是否有当前用户邮箱
        if (!this.currentUserEmail) {
          this.showError('未找到当前用户信息，请重新登录')
          setTimeout(() => {
            this.$router?.push('/login')
          }, 2000)
          return
        }

        console.log('正在获取用户信息，邮箱:', this.currentUserEmail)

        const response = await axios.get(API.USER_PROFILE, {
          params: { email: this.currentUserEmail }
        })

        console.log('用户信息响应:', response.data)

        // 处理响应数据
        let user
        if (response.data.user) {
          user = response.data.user
        } else if (response.data.username && response.data.email) {
          user = response.data
        } else {
          throw new Error('服务器返回数据格式错误')
        }

        // 验证用户数据完整性
        if (!user.username || !user.email) {
          throw new Error('用户数据不完整')
        }

        // 设置表单数据
        this.formData.username = user.username
        this.formData.email = user.email
        this.formData.password = ''

        // 保存原始数据
        this.originalData.username = user.username
        this.originalData.email = user.email

        console.log('用户信息加载成功')

      } catch (error) {
        console.error('加载用户信息失败:', error)

        let errorMessage = '加载用户信息失败'

        if (error.response) {
          errorMessage = error.response.data?.detail || `服务器错误 (${error.response.status})`

          // 认证错误，需要重新登录
          if (error.response.status === 401 || error.response.status === 404) {
            errorMessage += '，请重新登录'
            setTimeout(() => {
              this.$router?.push('/login')
            }, 2000)
          }
        } else if (error.message) {
          errorMessage = error.message
        }

        this.showError(errorMessage)

      } finally {
        this.loading = false
      }
    },

    async updateProfile() {
      if (!this.$refs.form.validate()) {
        this.showError('请检查输入信息')
        return
      }

      if (this.formData.password && this.formData.password !== this.confirmPassword) {
        this.showError('两次输入的密码不一致')
        return
      }

      try {
        this.updating = true

        // 构建更新数据 - 修复：只传递有值的字段
        const updateData = {
          email: this.currentUserEmail // 当前用户邮箱作为查找依据
        }

        // 只有当用户名实际改变时才添加该字段
        if (this.usernameChanged && this.formData.username.trim()) {
          updateData.new_username = this.formData.username.trim()
        }

        // 只有当邮箱实际改变时才添加该字段
        if (this.emailChanged && this.formData.email.trim()) {
          updateData.new_email = this.formData.email.trim()
        }

        // 只有当密码有值时才添加该字段
        if (this.formData.password && this.formData.password.trim()) {
          updateData.new_password = this.formData.password.trim()
        }

        console.log('发送更新请求:', updateData)

        // 发送请求时使用正确的 Content-Type
        // 修改axios调用
        const response = await axios.get(API.USER_PROFILE, {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        console.log('更新响应:', response.data)

        // 更新成功
        this.showSuccess(response.data.message || '信息更新成功')

        // 如果邮箱或用户名变更，需要更新本地存储
        if (updateData.new_email || updateData.new_username) {
          this.updateLocalStorage(updateData)
        }

        // 重新加载数据
        await this.loadUserProfile()

        // 清空密码字段
        this.formData.password = ''
        this.confirmPassword = ''

      } catch (error) {
        console.error('更新失败:', error)
        let message = '更新失败，请稍后重试'

        if (error.response?.data?.detail) {
          message = error.response.data.detail

          // 如果是验证错误，显示更详细的信息
          if (Array.isArray(error.response.data.detail)) {
            message = error.response.data.detail
              .map(err => err.msg || err.message || err)
              .join('; ')
          } else if (typeof error.response.data.detail === 'object') {
            message = JSON.stringify(error.response.data.detail)
          }
        }

        this.showError(message)
      } finally {
        this.updating = false
      }
    },

    // 更新本地存储
    updateLocalStorage(updateData) {
      try {
        // 更新 userEmail
        if (updateData.new_email) {
          localStorage.setItem('userEmail', updateData.new_email)
        }

        // 更新 currentUser
        const currentUser = this.getCurrentUserFromStorage()
        if (currentUser) {
          if (updateData.new_username) {
            currentUser.username = updateData.new_username
          }
          if (updateData.new_email) {
            currentUser.email = updateData.new_email
          }
          localStorage.setItem('currentUser', JSON.stringify(currentUser))
        }

        // 如果使用 Vuex，也要更新 store
        if (this.$store) {
          this.$store.commit('updateUser', {
            username: updateData.new_username || this.originalData.username,
            email: updateData.new_email || this.originalData.email
          })
        }

      } catch (error) {
        console.error('更新本地存储失败:', error)
      }
    },

    // 重置表单
    resetForm() {
      this.formData.username = this.originalData.username
      this.formData.email = this.originalData.email
      this.formData.password = ''
      this.confirmPassword = ''
      this.$refs.form?.resetValidation()
    },

    // 显示成功消息
    showSuccess(message) {
      this.successMessage = message
      this.successSnackbar = true
    },

    // 显示错误消息
    showError(message) {
      this.errorMessage = message
      this.errorSnackbar = true
    }
  }
}
</script>

<style scoped>
.v-card {
  max-width: 600px;
  margin: 0 auto;
}

.v-expansion-panel-content >>> .v-expansion-panel-content__wrap {
  padding: 16px 24px 24px;
}
</style>
