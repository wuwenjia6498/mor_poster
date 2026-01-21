/**
 * EditorPanel 编辑面板组件
 * 
 * 左侧配置面板，包含：
 * - 日期选择器
 * - 图片上传
 * - 图片来源输入
 * - 文案编辑
 * - 落款输入
 * - 下载按钮
 * 
 * 使用 shadcn/ui 组件构建
 */
import React, { useRef } from 'react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { CalendarIcon, ImageIcon, Download, Type, FileText } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const EditorPanel = ({
  date,
  setDate,
  image,
  setImage,
  imageSource,
  setImageSource,
  mainText,
  setMainText,
  signature,
  setSignature,
  onDownload,
  isExporting,
}) => {
  // 文件上传 input 引用
  const fileInputRef = useRef(null)

  /**
   * 处理图片上传
   * 读取本地文件并转换为 Data URL 用于预览
   */
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        alert('请上传图片文件')
        return
      }
      
      // 读取文件为 Data URL
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  /**
   * 触发文件选择对话框
   */
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-[400px] h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* 标题栏 */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h1 className="text-xl font-semibold text-gray-900">
          老约翰早安日签
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          编辑海报内容，实时预览效果
        </p>
      </div>

      {/* 表单内容区域 */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        
        {/* ========== 日期选择 ========== */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-gray-700">
            <CalendarIcon className="w-4 h-4" />
            日期选择
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "yyyy年MM月dd日 EEEE", { locale: zhCN }) : "选择日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* ========== 图片上传 ========== */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-gray-700">
            <ImageIcon className="w-4 h-4" />
            主图上传
          </Label>
          
          {/* 隐藏的文件输入框 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          
          {/* 上传区域 */}
          <div 
            onClick={triggerFileInput}
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all",
              "hover:border-brand-teal hover:bg-teal-50/50",
              image ? "border-brand-teal bg-teal-50/30" : "border-gray-200"
            )}
          >
            {image ? (
              <div className="space-y-2">
                <img 
                  src={image} 
                  alt="预览" 
                  className="w-full h-32 object-cover rounded"
                />
                <p className="text-sm text-gray-500">点击更换图片</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">
                  点击上传图片
                </p>
                <p className="text-xs text-gray-400">
                  支持 JPG, PNG 格式
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ========== 图片来源 ========== */}
        <div className="space-y-2">
          <Label htmlFor="imageSource" className="flex items-center gap-2 text-gray-700">
            <FileText className="w-4 h-4" />
            图片来源
          </Label>
          <Input
            id="imageSource"
            placeholder="如：来自儿童文学《猫》"
            value={imageSource}
            onChange={(e) => setImageSource(e.target.value)}
          />
          <p className="text-xs text-gray-400">
            将显示在图片右下角
          </p>
        </div>

        {/* ========== 文案内容 ========== */}
        <div className="space-y-2">
          <Label htmlFor="mainText" className="flex items-center gap-2 text-gray-700">
            <Type className="w-4 h-4" />
            正文内容
          </Label>
          <Textarea
            id="mainText"
            placeholder="输入海报正文内容..."
            value={mainText}
            onChange={(e) => setMainText(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        {/* ========== 落款 ========== */}
        <div className="space-y-2">
          <Label htmlFor="signature" className="text-gray-700">
            落款来源
          </Label>
          <Input
            id="signature"
            placeholder="如：如何让孩子爱上阅读"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
          />
          <p className="text-xs text-gray-400">
            将自动添加 "——《》" 格式
          </p>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
        <Button 
          variant="brand"
          className="w-full h-12 text-base font-medium"
          onClick={onDownload}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              正在生成...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              下载海报
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default EditorPanel

