/**
 * App 主应用组件
 * 
 * 整合编辑面板和海报画布，管理全局状态
 * 实现图片导出功能
 */
import React, { useState, useRef, useCallback } from 'react'
import ReactDOM from 'react-dom/client'
import html2canvas from 'html2canvas'
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
  const [mainText, setMainText] = useState('非虚构类书籍是均衡阅读饮食的一部分，\n它们在让孩子接触各种题材\n和文本类型方面非常有用。')
  
  // 落款来源
  const [signature, setSignature] = useState('如何让孩子爱上阅读')
  
  // 导出状态
  const [isExporting, setIsExporting] = useState(false)

  // 海报画布引用 - 用于预览显示
  const canvasRef = useRef(null)

  /**
   * 下载海报
   * 使用原始尺寸（889×1500）渲染，确保最高清晰度
   */
  const handleDownload = useCallback(async () => {
    setIsExporting(true)

    try {
      // 显式加载所需的字体
      await Promise.all([
        document.fonts.load('400 50px Caveat'),
        document.fonts.load('600 50px Caveat'),
        document.fonts.load('400 12px "Noto Serif SC"'),
        document.fonts.ready
      ])
      
      console.log('字体加载完成，开始创建高清画布...')
      
      // 创建临时隐藏容器
      const tempDiv = document.createElement('div')
      tempDiv.style.position = 'fixed'
      tempDiv.style.left = '-9999px'
      tempDiv.style.top = '0'
      document.body.appendChild(tempDiv)
      
      // 创建临时根节点
      const root = ReactDOM.createRoot(tempDiv)
      
      // 渲染高分辨率画布（scale=2，即889×1500）
      await new Promise((resolve) => {
        root.render(
          <PosterCanvas
            date={date}
            image={image}
            imageSource={imageSource}
            mainText={mainText}
            signature={signature}
            scale={2}
          />
        )
        setTimeout(resolve, 1000) // 等待渲染完成
      })
      
      const exportElement = tempDiv.firstChild
      console.log('高清画布渲染完成，开始截图...')
      
      // 使用html2canvas导出（scale=2，最终1778×3000）
      const canvas = await html2canvas(exportElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      })
      
      // 清理临时DOM
      root.unmount()
      document.body.removeChild(tempDiv)
      
      console.log('截图完成，准备下载...')

      // 转换为 Blob 并下载
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          
          // 生成文件名
          const dateStr = date 
            ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
            : 'poster'
          
          link.download = `老约翰早安日签_${dateStr}.png`
          link.href = url
          link.click()

          URL.revokeObjectURL(url)
        }
        setIsExporting(false)
      }, 'image/png', 1.0)
    } catch (error) {
      console.error('导出失败:', error)
      alert('导出失败，请重试')
      setIsExporting(false)
    }
  }, [date, image, imageSource, mainText, signature])

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
        signature={signature}
        setSignature={setSignature}
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
            signature={signature}
          />
        </div>
      </div>
    </div>
  )
}

export default App

