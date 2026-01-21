/**
 * Canvas 渲染器
 *
 * 使用原生 Canvas API 绘制海报，确保预览和导出完全一致
 */

// 月份英文缩写映射
const MONTH_ABBR = [
  'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.',
  'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'
]

// 星期中文映射
const WEEKDAY_CN = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

/**
 * 加载图片
 */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * 绘制圆角矩形
 */
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

/**
 * 绘制多行文本
 */
function drawMultilineText(ctx, text, x, y, lineHeight) {
  const lines = text.split('\n')
  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight)
  })
}

/**
 * 渲染海报到 Canvas
 *
 * @param {Object} options - 渲染选项
 * @param {Date} options.date - 日期
 * @param {string} options.image - 图片 URL
 * @param {string} options.imageSource - 图片来源
 * @param {string} options.mainText - 主文案
 * @param {number} options.scale - 缩放比例（1=预览，2=导出）
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function renderPosterToCanvas({
  date,
  image,
  imageSource,
  mainText,
  scale = 1
}) {
  // 基础尺寸
  const baseWidth = 444.5
  const baseHeight = 750
  const width = baseWidth * scale
  const height = baseHeight * scale

  // 创建 Canvas
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  // 先填充白色背景（防止透明区域显示为黑色）
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)

  // 确保字体已加载
  await Promise.all([
    document.fonts.load(`400 ${50 * scale}px Caveat`),
    document.fonts.load(`600 ${15 * scale}px -apple-system`),
    document.fonts.load(`300 ${12 * scale}px "Alibaba PuHuiTi"`),
    document.fonts.load(`300 ${12 * scale}px "PingFang SC"`),
    document.fonts.ready
  ])

  // 1. 绘制背景图
  try {
    const bgImage = await loadImage('/bg_template.png')
    ctx.drawImage(bgImage, 0, 0, width, height)
  } catch (error) {
    console.warn('背景图加载失败，使用纯白背景:', error)
    // 白色背景已经在开始时绘制了
  }

  // 2. 绘制日期模块
  const month = date ? MONTH_ABBR[date.getMonth()] : 'Jan.'
  const day = date ? date.getDate() : 1
  const weekday = date ? WEEKDAY_CN[date.getDay()] : '星期一'

  // 2.1 绘制月份（Caveat 手写字体）
  // 原设计：容器 top:125, height:50, 月份 bottom:10
  // 调整后：月份底部在 175（165 + 10）
  ctx.font = `400 ${50 * scale}px Caveat`
  ctx.fillStyle = '#6EC7C0'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(month, width - 29 * scale - 100 * scale, 175 * scale)

  // 2.2 绘制日期红框
  const dateBoxX = width - 29 * scale - 56 * scale - 30 * scale
  const dateBoxY = 155 * scale
  const dateBoxWidth = 30 * scale
  const dateBoxHeight = 20 * scale

  ctx.fillStyle = '#E55D49'
  roundRect(ctx, dateBoxX, dateBoxY, dateBoxWidth, dateBoxHeight, 2 * scale)
  ctx.fill()

  // 绘制日期数字（向下偏移 2px 以更好地居中）
  ctx.font = `600 ${15 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(day, dateBoxX + dateBoxWidth / 2, dateBoxY + dateBoxHeight / 2 + 2 * scale)

  // 2.3 绘制星期
  ctx.font = `400 ${14 * scale}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
  ctx.fillStyle = '#888888'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'bottom'
  ctx.fillText(weekday, width - 29 * scale, 175 * scale)

  // 3. 绘制主插图
  if (image) {
    try {
      const mainImage = await loadImage(image)
      const imgX = 29 * scale
      const imgY = 210 * scale
      const imgWidth = 387 * scale
      const imgHeight = 170 * scale

      // 绘制圆角矩形裁剪区域
      ctx.save()
      roundRect(ctx, imgX, imgY, imgWidth, imgHeight, 1 * scale)
      ctx.clip()

      // 计算图片缩放和居中
      const imgAspect = mainImage.width / mainImage.height
      const boxAspect = imgWidth / imgHeight
      let drawWidth, drawHeight, drawX, drawY

      if (imgAspect > boxAspect) {
        // 图片更宽，以高度为准
        drawHeight = imgHeight
        drawWidth = imgHeight * imgAspect
        drawX = imgX - (drawWidth - imgWidth) / 2
        drawY = imgY
      } else {
        // 图片更高，以宽度为准
        drawWidth = imgWidth
        drawHeight = imgWidth / imgAspect
        drawX = imgX
        drawY = imgY - (drawHeight - imgHeight) / 2
      }

      ctx.drawImage(mainImage, drawX, drawY, drawWidth, drawHeight)
      ctx.restore()
    } catch (error) {
      console.error('主图加载失败:', error)
      // 绘制占位符
      ctx.fillStyle = '#f5f5f5'
      roundRect(ctx, 29 * scale, 210 * scale, 387 * scale, 170 * scale, 1 * scale)
      ctx.fill()
    }
  } else {
    // 绘制占位符
    ctx.fillStyle = '#f5f5f5'
    roundRect(ctx, 29 * scale, 210 * scale, 387 * scale, 170 * scale, 1 * scale)
    ctx.fill()
  }

  // 4. 绘制图片来源
  if (imageSource) {
    ctx.font = `300 ${10 * scale}px "Alibaba PuHuiTi Light", "Alibaba PuHuiTi", "PingFang SC", "Noto Sans SC", sans-serif`
    ctx.fillStyle = '#000000'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'top'
    ctx.fillText(`图·${imageSource}`, width - 29 * scale, 210 * scale + 170 * scale + 3 * scale)
  }

  // 5. 绘制文案内容
  const textX = width / 2
  const textY = 440 * scale

  if (mainText) {
    // 主文案使用阿里巴巴普惠体 Light
    ctx.font = `300 ${14 * scale}px "Alibaba PuHuiTi Light", "Alibaba PuHuiTi", "PingFang SC", "Noto Sans SC", sans-serif`
    ctx.fillStyle = '#111111'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    drawMultilineText(ctx, mainText, textX, textY, 14 * scale * 1.5)
  }

  return canvas
}

/**
 * 下载 Canvas 为图片
 */
export function downloadCanvas(canvas, filename = 'poster.png') {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = filename
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
        resolve()
      } else {
        reject(new Error('生成图片失败'))
      }
    }, 'image/png', 1.0)
  })
}
