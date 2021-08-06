import request from '@/utils/request'
export function query(data) {
  return request({
    url: '/manage/serviceproxyinfo/getProxyInfoList',
    method: 'post',
    params: data,
  })
}
export function querybyid(id) {
  return request({
    url: '/manage/serviceproxyinfo/getProxyInfoById/' + id,
    method: 'get',

  })
}
export function edit(data) {
  return request({
    url: "/manage/serviceproxyinfo/insertOrUpdateServiceProxyInfo",
    method: 'post',
    data,
  })
}
export function getOAthUrl(id) {
  return request({
    url: '/mobile/mobileAuth/getOAthUrl',
    method: 'get',
    params: {
      proxyId: id
    }
  })
}
export function uploadMchKey(data) {
  return request({
    url: "/manage/serviceproxyinfo/uploadMchKey",
    method: 'post',
    data,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
}
