import request from '@/utils/request'
export function query(data) {
  return request({
    url: '/manage/serviceinsuranceorderinfo/getOrderInfoList',
    method: 'post',
    params: {
      limit: data.limit,
      page: data.page,
      goodsName: data.goodsName,
      insuranceCompanyName: data.insuranceCompanyName,
      proxyName: data.proxyName,
    },
  })
}
export function querybyid(id) {
  return request({
    url: '/manage/serviceinsuranceorderinfo/getOrderInfoById/' + id,
    method: 'get',

  })
}
export function exportOrderInfo(data) {
  return request({
    url: "/manage/serviceinsuranceorderinfo/exportOrderInfo",
    method: 'get',
    params: {
      goodsName: data.goodsName,
      insuranceCompanyName: data.insuranceCompanyName,
      proxyName: data.proxyName
    }

  })
}
