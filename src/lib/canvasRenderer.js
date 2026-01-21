/**
 * Canvas 渲染器
 *
 * 使用原生 Canvas API 绘制海报，确保预览和导出完全一致
 * 支持多模板渲染系统
 */

import { getTemplateById, getDefaultTemplate } from '@/config/templatesConfig'

// ========== 常量定义 ==========

// 月份英文缩写映射
const MONTH_ABBR = [
  'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.',
  'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'
]

// 星期中文映射
const WEEKDAY_CN = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

// ========== 工具函数 ==========

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
 * 计算实际 X 坐标
 * 支持负值（从右边距算起）和 'center'（居中）
 * 坐标取整避免亚像素渲染导致的偏移
 */
function calcX(xConfig, width, scale, offsetX = 0) {
  let x
  if (xConfig === 'center') {
    x = width / 2 + offsetX * scale
  } else if (xConfig < 0) {
    // 负值表示从右边距算起，需要乘以 scale
    x = width + xConfig * scale
  } else {
    x = xConfig * scale
  }
  return Math.round(x) // 坐标取整，避免亚像素问题
}

/**
 * 构建字体字符串
 */
function buildFontString(fontConfig, scale) {
  const { weight, size, family } = fontConfig
  return `${weight} ${size * scale}px ${family}`
}

// ========== 日期样式渲染函数 ==========

/**
 * 绘制红框日期样式 (badge_red)
 * 从原代码精确提取的逻辑
 */
function drawDateBadgeRed(ctx, date, config, width, scale) {
  const dateConfig = config.date
  const month = date ? MONTH_ABBR[date.getMonth()] : 'Jan.'
  const day = date ? date.getDate() : 1
  const weekday = date ? WEEKDAY_CN[date.getDay()] : '星期一'

  // 2.1 绘制月份（Caveat 手写字体）
  const monthConfig = dateConfig.month
  ctx.font = buildFontString(monthConfig.font, scale)
  ctx.fillStyle = monthConfig.color
  ctx.textAlign = monthConfig.textAlign
  ctx.textBaseline = monthConfig.textBaseline
  const monthX = calcX(monthConfig.x, width, scale)
  const monthY = Math.round(monthConfig.y * scale)
  ctx.fillText(month, monthX, monthY)

  // 2.2 绘制日期红框
  const badgeConfig = dateConfig.badge
  const dateBoxX = calcX(badgeConfig.x, width, scale)
  const dateBoxY = Math.round(badgeConfig.y * scale)
  const dateBoxWidth = Math.round(badgeConfig.width * scale)
  const dateBoxHeight = Math.round(badgeConfig.height * scale)
  const dateBoxRadius = Math.round(badgeConfig.radius * scale)

  ctx.fillStyle = badgeConfig.bgColor
  roundRect(ctx, dateBoxX, dateBoxY, dateBoxWidth, dateBoxHeight, dateBoxRadius)
  ctx.fill()

  // 绘制日期数字
  const textConfig = badgeConfig.text
  ctx.font = buildFontString(textConfig.font, scale)
  ctx.fillStyle = textConfig.color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const dateBoxCenterX = Math.round(dateBoxX + dateBoxWidth / 2)
  const dateBoxCenterY = Math.round(dateBoxY + dateBoxHeight / 2 + (textConfig.offsetY || 0) * scale)
  ctx.fillText(day, dateBoxCenterX, dateBoxCenterY)

  // 2.3 绘制星期
  const weekdayConfig = dateConfig.weekday
  ctx.font = buildFontString(weekdayConfig.font, scale)
  ctx.fillStyle = weekdayConfig.color
  ctx.textAlign = weekdayConfig.textAlign
  ctx.textBaseline = weekdayConfig.textBaseline
  const weekdayX = calcX(weekdayConfig.x, width, scale)
  const weekdayY = Math.round(weekdayConfig.y * scale)
  ctx.fillText(weekday, weekdayX, weekdayY)
}

/**
 * 绘制极简竖线日期样式 (minimal_vertical)
 * 适用于晚安模板
 */
function drawDateMinimalVertical(ctx, date, config, width, scale) {
  const dateConfig = config.date
  const day = date ? date.getDate() : 1
  const weekday = date ? WEEKDAY_CN[date.getDay()] : '星期一'

  const centerX = width / 2

  // 如果有 monthEn 配置，使用新的布局样式（晚安1）
  if (dateConfig.monthEn) {
    // 绘制月份英文缩写（左下角）
    const monthEnConfig = dateConfig.monthEn
    const monthEn = date ? MONTH_ABBR[date.getMonth()] : 'Jan.'
    // 构建字体字符串，支持斜体
    let fontStr = buildFontString(monthEnConfig.font, scale)
    if (monthEnConfig.font.style === 'italic') {
      const { weight, size, family } = monthEnConfig.font
      fontStr = `italic ${weight} ${size * scale}px ${family}`
    }
    ctx.font = fontStr
    ctx.fillStyle = monthEnConfig.color
    ctx.textAlign = monthEnConfig.textAlign
    ctx.textBaseline = monthEnConfig.textBaseline
    const monthEnX = Math.round(monthEnConfig.x * scale)
    const monthEnY = Math.round(monthEnConfig.y * scale)
    ctx.fillText(monthEn, monthEnX, monthEnY)

    // 绘制竖线分隔符（如果配置了）
    if (dateConfig.divider) {
      const dividerConfig = dateConfig.divider
      const dividerX = Math.round(centerX + (dividerConfig.offsetX || 0) * scale)
      const dividerHeight = Math.round(dividerConfig.height * scale)
      const dividerY = Math.round(dividerConfig.y * scale - dividerHeight / 2)
      const dividerWidth = Math.round(dividerConfig.width * scale)
      ctx.fillStyle = dividerConfig.color
      ctx.fillRect(
        Math.round(dividerX - dividerWidth / 2),
        dividerY,
        dividerWidth,
        dividerHeight
      )
    }

    // 绘制星期（日期数字上方）
    const weekdayConfig = dateConfig.weekday
    ctx.font = buildFontString(weekdayConfig.font, scale)
    ctx.fillStyle = weekdayConfig.color
    ctx.textAlign = weekdayConfig.textAlign
    ctx.textBaseline = weekdayConfig.textBaseline
    const weekdayX = Math.round(centerX + (weekdayConfig.offsetX || 0) * scale)
    const weekdayY = Math.round(weekdayConfig.y * scale)
    ctx.fillText(weekday, weekdayX, weekdayY)

    // 绘制日期数字（中间偏右）
    const dayConfig = dateConfig.day
    ctx.font = buildFontString(dayConfig.font, scale)
    ctx.fillStyle = dayConfig.color
    ctx.textAlign = dayConfig.textAlign
    ctx.textBaseline = dayConfig.textBaseline
    const dayX = Math.round(centerX + (dayConfig.offsetX || 0) * scale)
    const dayY = Math.round(dayConfig.y * scale)
    ctx.fillText(String(day), dayX, dayY)
  } else {
    // 原有的竖线分隔布局（晚安2）
    const month = date ? date.getMonth() + 1 : 1 // 数字月份

    // 绘制月份（左侧）
    const monthConfig = dateConfig.month
    ctx.font = buildFontString(monthConfig.font, scale)
    ctx.fillStyle = monthConfig.color
    ctx.textAlign = monthConfig.textAlign
    ctx.textBaseline = monthConfig.textBaseline
    const monthX = Math.round(centerX + (monthConfig.offsetX || 0) * scale)
    const monthY = Math.round(monthConfig.y * scale)
    ctx.fillText(String(month).padStart(2, '0'), monthX, monthY)

    // 绘制竖线分隔符
    const dividerConfig = dateConfig.divider
    const dividerX = Math.round(centerX)
    const dividerHeight = Math.round(dividerConfig.height * scale)
    const dividerY = Math.round(dividerConfig.y * scale - dividerHeight / 2)
    const dividerWidth = Math.round(dividerConfig.width * scale)
    ctx.fillStyle = dividerConfig.color
    ctx.fillRect(
      Math.round(dividerX - dividerWidth / 2),
      dividerY,
      dividerWidth,
      dividerHeight
    )

    // 绘制日期数字（右侧）
    const dayConfig = dateConfig.day
    ctx.font = buildFontString(dayConfig.font, scale)
    ctx.fillStyle = dayConfig.color
    ctx.textAlign = dayConfig.textAlign
    ctx.textBaseline = dayConfig.textBaseline
    const dayX = Math.round(centerX + (dayConfig.offsetX || 0) * scale)
    const dayY = Math.round(dayConfig.y * scale)
    ctx.fillText(String(day).padStart(2, '0'), dayX, dayY)

    // 绘制星期（底部）
    const weekdayConfig2 = dateConfig.weekday
    ctx.font = buildFontString(weekdayConfig2.font, scale)
    ctx.fillStyle = weekdayConfig2.color
    ctx.textAlign = weekdayConfig2.textAlign
    ctx.textBaseline = weekdayConfig2.textBaseline
    const weekdayY2 = Math.round(weekdayConfig2.y * scale)
    ctx.fillText(weekday, Math.round(centerX), weekdayY2)
  }
}

// ========== 主渲染函数 ==========

/**
 * 渲染海报到 Canvas
 *
 * @param {Object} options - 渲染选项
 * @param {Date} options.date - 日期
 * @param {string} options.image - 图片 URL
 * @param {string} options.imageSource - 图片来源
 * @param {string} options.mainText - 主文案
 * @param {number} options.scale - 缩放比例（1=预览，2=导出）
 * @param {string} options.templateId - 模板 ID（可选，默认使用第一个模板）
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function renderPosterToCanvas({
  date,
  image,
  imageSource,
  mainText,
  scale = 1,
  templateId
}) {
  // 获取模板配置
  const config = templateId ? getTemplateById(templateId) : getDefaultTemplate()
  if (!config) {
    throw new Error(`未找到模板配置: ${templateId}`)
  }

  // 基础尺寸
  const { baseWidth, baseHeight } = config.canvas
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

  // 确保所有字体已加载（包括新增的 Freestyle Script 和 Bebas Neue）
  await Promise.all([
    document.fonts.load(`400 ${50 * scale}px Caveat`),
    document.fonts.load(`400 ${80 * scale}px "Freestyle Script"`), // 晚安模板月份字体
    document.fonts.load(`600 ${56 * scale}px "Bebas Neue"`), // 晚安模板日期字体
    document.fonts.load(`600 ${15 * scale}px -apple-system`),
    document.fonts.load(`300 ${14 * scale}px "Alibaba PuHuiTi"`),
    document.fonts.load(`300 ${14 * scale}px "PingFang SC"`),
    document.fonts.ready
  ])

  // 1. 绘制背景图
  try {
    const bgImage = await loadImage(config.background)
    ctx.drawImage(bgImage, 0, 0, width, height)
  } catch (error) {
    console.warn('背景图加载失败，使用纯白背景:', error)
  }

  // 2. 根据样式模式绘制日期模块
  if (config.styleMode === 'badge_red') {
    // 红框日期样式（早安模板）
    drawDateBadgeRed(ctx, date, config, width, scale)
  } else if (config.styleMode === 'minimal_vertical') {
    // 极简竖线样式（晚安模板）- 日期在底部，稍后绘制
    // 晚安模板的日期在底部，需要在主内容之后绘制
  }

  // 3. 绘制主插图
  const imgConfig = config.image
  const imgX = Math.round(imgConfig.x * scale)
  const imgY = Math.round(imgConfig.y * scale)
  const imgWidth = Math.round(imgConfig.width * scale)
  const imgHeight = Math.round(imgConfig.height * scale)
  const imgRadius = Math.round((imgConfig.radius || 0) * scale)

  if (image) {
    try {
      const mainImage = await loadImage(image)

      // 绘制圆角矩形裁剪区域
      ctx.save()
      if (imgRadius > 0) {
        roundRect(ctx, imgX, imgY, imgWidth, imgHeight, imgRadius)
        ctx.clip()
      }

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
      // 绘制占位区
      ctx.fillStyle = '#f5f5f5'
      roundRect(ctx, imgX, imgY, imgWidth, imgHeight, imgRadius)
      ctx.fill()
    }
  } else {
    // 绘制占位区
    ctx.fillStyle = '#f5f5f5'
    roundRect(ctx, imgX, imgY, imgWidth, imgHeight, imgRadius)
    ctx.fill()
  }

  // 4. 绘制图片来源
  if (imageSource && config.imageSource) {
    const srcConfig = config.imageSource
    ctx.font = buildFontString(srcConfig.font, scale)
    ctx.fillStyle = srcConfig.color
    ctx.textAlign = srcConfig.textAlign
    ctx.textBaseline = srcConfig.textBaseline
    const srcX = calcX(srcConfig.x, width, scale)
    const srcY = Math.round(srcConfig.y * scale)
    ctx.fillText(`${srcConfig.prefix}${imageSource}`, srcX, srcY)
  }

  // 5. 绘制文案内容
  if (mainText && config.mainText) {
    const textConfig = config.mainText
    const textX = calcX(textConfig.x, width, scale)
    const textY = Math.round(textConfig.y * scale)
    const lineHeight = Math.round(textConfig.font.size * scale * textConfig.lineHeight)

    ctx.font = buildFontString(textConfig.font, scale)
    ctx.fillStyle = textConfig.color
    ctx.textAlign = textConfig.textAlign
    ctx.textBaseline = textConfig.textBaseline
    drawMultilineText(ctx, mainText, textX, textY, lineHeight)
  }

  // 6. 如果是极简竖线样式，在最后绘制日期（底部）
  if (config.styleMode === 'minimal_vertical') {
    drawDateMinimalVertical(ctx, date, config, width, scale)
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
