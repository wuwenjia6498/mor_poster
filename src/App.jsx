/**
 * App 主应用组件
 *
 * 整合编辑面板和海报画布，管理全局状态
 * 实现图片导出功能，支持多模板系统
 */
import React, { useState, useRef, useCallback } from 'react'
import { renderPosterToCanvas, downloadCanvas } from '@/lib/canvasRenderer'
import { getTemplateById, getDefaultTemplate, TEMPLATES } from '@/config/templatesConfig'
import EditorPanel from '@/components/EditorPanel'
import PosterCanvas from '@/components/PosterCanvas'
import ControlPanel from '@/components/ControlPanel'

function App() {
  // ========== 状态管理 ==========

  // 模板选择状态 - 默认使用第一个模板
  const [selectedTemplateId, setSelectedTemplateId] = useState(getDefaultTemplate().id)

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

  // 获取当前选中的模板配置
  const currentTemplate = getTemplateById(selectedTemplateId) || getDefaultTemplate()

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
        scale: 2,
        templateId: selectedTemplateId
      })

      console.log('渲染完成，准备下载...')

      // 生成文件名
      const dateStr = date
        ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        : 'poster'

      // 根据模板类型生成文件名
      const typePrefix = currentTemplate.type === 'morning' ? '早安' : '晚安'

      // 下载
      await downloadCanvas(canvas, `老约翰${typePrefix}日签_${dateStr}.png`)

      console.log('下载完成')
      setIsExporting(false)
    } catch (error) {
      console.error('导出失败:', error)
      alert('导出失败，请重试')
      setIsExporting(false)
    }
  }, [date, image, imageSource, mainText, selectedTemplateId, currentTemplate])

  /**
   * 处理模板切换
   */
  const handleTemplateChange = useCallback((templateId) => {
    setSelectedTemplateId(templateId)
  }, [])

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 左侧：编辑面板 */}
      <div className="w-[480px] flex flex-col bg-white border-r border-gray-200 overflow-hidden">
        {/* 模板选择器 */}
        <div className="p-4 border-b border-gray-200">
          <ControlPanel
            selectedTemplateId={selectedTemplateId}
            onTemplateChange={handleTemplateChange}
          />
        </div>

        {/* 内容编辑区 */}
        <div className="flex-1 overflow-auto">
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
        </div>
      </div>

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
            templateId={selectedTemplateId}
          />
        </div>
      </div>
    </div>
  )
}

export default App
