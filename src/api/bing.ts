export interface BingWallpaper {
  url: string
  title: string
  copyright: string
  date: string
}

export async function getBingWallpaper(): Promise<BingWallpaper | null> {
  try {
    // 使用CORS代理服务来绕过CORS限制
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
    const targetUrl = 'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN'
    const response = await fetch(proxyUrl + targetUrl)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    
    if (data.images && data.images.length > 0) {
      const image = data.images[0]
      return {
        url: `https://cn.bing.com${image.url}`,
        title: image.title,
        copyright: image.copyright,
        date: image.enddate
      }
    }
    return null
  } catch (error) {
    console.error('Failed to get Bing wallpaper:', error)
    return null
  }
}