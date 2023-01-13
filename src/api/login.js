import request from '@/utils/request'

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get'
  })
}
// 获取验证码
export function getSms(query) {
  return request({
    url: '/system/forget/sms',
    method: 'get',
    params: query
  })
}
// 校验验证码
export function getCheckCode(query) {
  return request({
    url: '/system/forget/checkCode',
    method: 'post',
    data: query
  })
}
// 校验验证码
export function postSetPwd(query) {
  return request({
    url: '/system/forget/resetPWD',
    method: 'post',
    data: query
  })
}
