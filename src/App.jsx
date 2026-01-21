/**
 * App 主应用组件
 *
 * 整合编辑面板和海报画布，管理全局状态
 * 实现图片导出功能
 */
import React, { useState, useRef, useCallback } from 'react'
import { renderPosterToCanvas, downloadCanvas } from '@/lib/canvasRenderer'
import EditorPanel from '@/components/EditorPanel'
import PosterCanvas from '@/components/PosterCanvas'

function App() {
  // ========== 状态管理 ==========
  // 日期状态 - 默认为今天
  const [date, setDate] = useState(new Date())
  
  // 图片状态 - 上传的图片 Data URL
  const [image, setImage] = useState('')
  
  // 图片来源标注
  const [imageSource, setImageSource] = useState('来自儿童文学《猫》')
  
  // 主文案内容
  const [mainText, setMainText] = useState('非虚构类书籍是均衡阅读饮食的一部分，\n它们在让孩子接触各种题材\n和文本类型方面非常有用。\n——《小学生如何阅读一本小说》')
  
  // 导出状态
  const [isExporting, setIsExporting] = useState(false)

  // 海报画布引用 - 用于预览显示
  const canvasRef = useRef(null)

  /**
   * 下载海报
   * 使用 Canvas API 直接渲染高清图片
   */
  const handleDownload = useCallback(async () => {
    setIsExporting(true)

    try {
      console.log('开始渲染高清海报...')

      // 渲染高分辨率画布（scale=2，即889×1500）
      const canvas = await renderPosterToCanvas({
        date,
        image,
        imageSource,
        mainText,
        scale: 2
      })

      console.log('渲染完成，准备下载...')

      // 生成文件名
      const dateStr = date
        ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        : 'poster'

      // 下载
      await downloadCanvas(canvas, `老约翰早安日签_${dateStr}.png`)

      console.log('下载完成')
      setIsExporting(false)
    } catch (error) {
      console.error('导出失败:', error)
      alert('导出失败，请重试')
      setIsExporting(false)
    }
  }, [date, image, imageSource, mainText])

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 左侧：编辑面板 */}
      <EditorPanel
        date={date}
        setDate={setDate}
        image={image}
        setImage={setImage}
        imageSource={imageSource}
        setImageSource={setImageSource}
        mainText={mainText}
        setMainText={setMainText}
        onDownload={handleDownload}
        isExporting={isExporting}
      />

      {/* 右侧：预览区域 */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        {/* 预览容器 - 添加阴影效果 */}
        <div 
          className="rounded-lg overflow-hidden"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          <PosterCanvas
            ref={canvasRef}
            date={date}
            image={image}
            imageSource={imageSource}
            mainText={mainText}
          />
        </div>
      </div>
    </div>
  )
}

export default App

