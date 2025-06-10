// API配置文件

// 从环境变量获取基础URL
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:8082';
const WS_BASE_URL = import.meta.env.VITE_APP_WS_BASE_URL || 'ws://localhost:8082';

// API端点
const API = {
  // 用户相关
  LOGIN: `${API_BASE_URL}/api/login`,
  REGISTER: `${API_BASE_URL}/api/register`,
  USER_PROFILE: `${API_BASE_URL}/api/user/profile`,
  ADD_TASK: `${API_BASE_URL}/api/tasks/add`,
  EDIT_TASK: `${API_BASE_URL}/api/tasks/edit`,
  GET_TASKS: `${API_BASE_URL}/api/tasks`,
  DELETE_TASK: `${API_BASE_URL}/api/tasks/delete`,
  // 视频相关
  VIDEO_REGISTER: `${API_BASE_URL}/api/video/register`,
  VIDEO_USERS: `${API_BASE_URL}/api/video/users`,
  VIDEO_UNREGISTER: `${API_BASE_URL}/api/video/unregister`,

  // WebSocket
  WS_CHAT: (userEmail) => `${WS_BASE_URL}/ws/chat/?user_email=${userEmail}`
};

export default API;
