import request from '@/utils/request'
// 列表
export function getInfoList(query) {
  return request({
    url: '/patientInfo/list',
    method: 'get',
    params: query
  })
}
// 详情
export function getInfo(id) {
  return request({
    url: `/patientInfo/${id}`,
    method: 'get'
  })
}
export function getInfoReport(id) {
  return request({
    url: `/examReport/${id}`,
    method: 'get'
  })
}

// 详情
export function getInfoExam(query) {
  return request({
    url: `/examReport/detail`,
    method: 'get',
    params: query
  })
}

// 导出
export function managExport(query) {
  return request({
    url: `/patientInfo/export`,
    method: 'get',
    headers:{
      'Content-Type':'application/octet-stream; charset=UTF-8'
    },
    params: query
  })
}

