import request from '@/utils/request'
// 列表
export function getList(query) {
  return request({
    url: '/examReport/list',
    method: 'get',
    params: query
  })
}
// 详情
export function getInfo(query) {
  return request({
    url: `/examReport/detail`,
    method: 'get',
    params: query
  })
}
// 导出
export function managExport() {
  return request({
    url: `/model/download/examReport`,
    method: 'get'
  })
}
