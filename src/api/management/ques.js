import request from '@/utils/request'
// 列表
export function getList(query) {
  return request({
    url: '/questionnaireReplyRecord/list',
    method: 'get',
    params: query
  })
}
// 详情
export function getInfo(id) {
  return request({
    url: `/questionnaireReplyRecord/${id}`,
    method: 'get'
  })
}
// 导出
export function managExport(query) {
  return request({
    url: `/questionnaireReplyRecord/export`,
    method: 'get',
    params: query
  })
}

