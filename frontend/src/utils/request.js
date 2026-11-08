// axios 请求封装：统一 baseURL、超时、请求/响应拦截器
import axios from 'axios';

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
});

// 请求拦截器：预留携带token的位置
request.interceptors.request.use(
  (config) => {
    // TODO 后续登录功能完成后，在此携带token，例如：
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = token;
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：统一处理后端返回的 {"code":200,"msg":"...","data":{}}
request.interceptors.response.use(
  (response) => {
    const { code, msg, data } = response.data;
    if (code === 200) {
      return data;
    }
    // 401未登录：预留跳转登录页位置
    if (code === 401) {
      // TODO 后续跳转登录页，例如 router.push('/login')
    }
    return Promise.reject(new Error(msg || '请求失败'));
  },
  (error) => Promise.reject(error)
);

export default request;
