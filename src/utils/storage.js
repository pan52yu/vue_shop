// 定义本地存储获取
export function getLocal (key) {
  const data = localStorage.getItem(key)
  try {
    return JSON.parse(data)
  } catch (e) {
    // console.log(e)
    return data
  }
}

// 定义本地存储存储
export function setLocal (key, data) {
  localStorage.setItem(
    key,
    typeof data === 'object' ? JSON.stringify(data) : data
  )
}

// 删除本地存储数据
export function removeLocal (key) {
  localStorage.removeItem(key)
}
