export interface BingWallpaper {
  url: string
  title: string
  copyright: string
  date: string
}

export async function getBingWallpaper(): Promise<BingWallpaper | null> {
  try {
    const response = await fetch('/api/bing?format=js&idx=0&n=1&mkt=zh-CN')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    
    if (data.images && data.images.length > 0) {
      const image = data.images[0]
      return {
        url: `https://www.bing.com${image.url}`,
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