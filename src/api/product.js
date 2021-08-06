import request from '@/utils/request'
export function query(data) {
  return request({
    url: '/manage/serviceinsurancegoodsinfo/getInsuranceGoodsInfoList',
    method: 'post',
    params: data,
  })
}
export function querybyid(id) {
  return request({
    url: '/manage/serviceinsurancegoodsinfo/getInsuranceGoodsInfoById/' + id,
    method: 'get',

  })
}
// 保险停用
export function deactivate(id) {
  return request({
    url: '/manage/serviceinsurancegoodsinfo/DeactivateInsuranceGoodsInfo/' + id,
    method: 'get',

  })
}
// 获取上传参数
export function getAliCode() {
  return request({
    url: "/manage/serviceinsurancegoodsinfo/getAliCode",
    method: 'get',

  })
}
export function edit(data) {
  return request({
    url: "/manage/serviceinsurancegoodsinfo/insertOrUpdateInsuranceGoodsInfo",
    method: 'post',
    data
  })
}
