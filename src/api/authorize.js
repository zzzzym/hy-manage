import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/manage/manageAuth/auth',
    method: 'post',
    data

  })
}