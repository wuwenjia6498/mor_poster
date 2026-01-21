/**
 * Canvas 工具函数
 *
 * 处理图片裁切等操作
 */

/**
 * 裁切图片
 *
 * @param {string} imageSrc - 原图 URL (Data URL 或 Blob URL)
 * @param {Object} pixelCrop - 裁切区域 { x, y, width, height }
 * @returns {Promise<string>} - 返回裁切后的 Blob URL
 */
export async function getCroppedImg(imageSrc, pixelCrop) {
  return new Promise((resolve, reject) => {
    // 1. 创建临时图片元素
    const image = new Image()
    image.crossOrigin = 'anonymous'

    image.onload = () => {
      // 2. 创建临时 Canvas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('无法获取 Canvas 上下文'))
        return
      }

      // 3. 设置 Canvas 尺寸为裁切区域大小
      canvas.width = pixelCrop.width
      canvas.height = pixelCrop.height

      // 4. 绘制裁切区域
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      )

      // 5. 转换为 Blob URL
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas 转换 Blob 失败'))
            return
          }

          const croppedImageUrl = URL.createObjectURL(blob)
          resolve(croppedImageUrl)
        },
        'image/jpeg',
        0.95
      )
    }

    image.onerror = () => {
      reject(new Error('图片加载失败'))
    }

    image.src = imageSrc
  })
}

/**
 * 清理 Blob URL
 *
 * @param {string} url - Blob URL
 */
export function revokeBlobUrl(url) {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}
