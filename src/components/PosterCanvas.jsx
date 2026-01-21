/**
 * PosterCanvas 海报画布组件
 *
 * 使用 Canvas API 渲染海报，确保预览和导出完全一致
 */
import React, { forwardRef, useEffect, useRef } from 'react'
import { renderPosterToCanvas } from '@/lib/canvasRenderer'

const PosterCanvas = forwardRef(({
  date,
  image,
  imageSource,
  mainText,
  signature,
  scale = 1 // 缩放比例，默认1（显示尺寸），2为导出尺寸
}, ref) => {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  // 基础尺寸（scale=1时的尺寸）
  const baseWidth = 444.5
  const baseHeight = 750

  useEffect(() => {
    const renderCanvas = async () => {
      if (!canvasRef.current) return

      try {
        const canvas = await renderPosterToCanvas({
          date,
          image,
          imageSource,
          mainText,
          signature,
          scale
        })

        // 清空当前画布并替换
        const container = containerRef.current
        if (container) {
          container.innerHTML = ''
          container.appendChild(canvas)
        }
      } catch (error) {
        console.error('渲染失败:', error)
      }
    }

    renderCanvas()
  }, [date, image, imageSource, mainText, signature, scale])

  // 暴露 ref 给父组件（用于导出）
  React.useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current?.firstChild
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
    >
      <div ref={canvasRef} />
    </div>
  )
})

PosterCanvas.displayName = 'PosterCanvas'

export default PosterCanvas
