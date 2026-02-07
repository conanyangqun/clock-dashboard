export interface BingWallpaper {
  url: string
  title: string
  copyright: string
  date: string
}

export async function getBingWallpaper(): Promise<BingWallpaper | null> {
  try {
    // 使用cn.bing.com的API端点，可能会有不同的CORS设置
    const response = await fetch('https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN')
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