/**
 * PosterCanvas 海报画布组件
 *
 * 使用 Canvas API 渲染海报，确保预览和导出完全一致
 * 支持多模板系统
 */
import React, { forwardRef, useEffect, useRef } from 'react'
import { renderPosterToCanvas } from '@/lib/canvasRenderer'
import { getTemplateById, getDefaultTemplate } from '@/config/templatesConfig'

const PosterCanvas = forwardRef(({
  date,
  image,
  imageSource,
  mainText,
  templateId, // 新增：模板 ID
  scale = 1 // 缩放比例，默认1（显示尺寸），2为导出尺寸
}, ref) => {
  const containerRef = useRef(null)

  // 获取当前模板配置以计算尺寸
  const template = templateId ? getTemplateById(templateId) : getDefaultTemplate()
  const baseWidth = template?.canvas?.baseWidth || 444.5
  const baseHeight = template?.canvas?.baseHeight || 750

  useEffect(() => {
    const renderCanvas = async () => {
      const container = containerRef.current
      if (!container) return

      try {
        // 渲染海报到 Canvas，传入模板 ID
        const canvas = await renderPosterToCanvas({
          date,
          image,
          imageSource,
          mainText,
          scale,
          templateId
        })

        // 清空当前容器并添加新画布
        container.innerHTML = ''
        container.appendChild(canvas)
      } catch (error) {
        console.error('渲染失败:', error)
      }
    }

    renderCanvas()
  }, [date, image, imageSource, mainText, scale, templateId])

  // 暴露 ref 给父组件（用于导出）
  React.useImperativeHandle(ref, () => ({
    getCanvas: () => containerRef.current?.firstChild
  }))

  return (
    <div
      ref={containerRef}
      data-poster-canvas
      style={{
        width: `${baseWidth * scale}px`,
        height: `${baseHeight * scale}px`,
        position: 'relative',
      }}
    />
  )
})

PosterCanvas.displayName = 'PosterCanvas'

export default PosterCanvas
