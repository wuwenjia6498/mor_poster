/**
 * PosterCanvas 海报画布组件
 * 
 * 负责渲染海报的实际内容，包括：
 * - 日期模块（月份、日期、星期）
 * - 主插图
 * - 文案内容
 * 
 * 使用 bg_template.png 作为背景，动态元素通过绝对定位叠加
 */
import React, { forwardRef } from 'react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

// 月份英文缩写映射
const MONTH_ABBR = [
  'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.',
  'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'
]

// 星期中文映射
const WEEKDAY_CN = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

const PosterCanvas = forwardRef(({ 
  date, 
  image, 
  imageSource, 
  mainText, 
  signature,
  scale = 1 // 缩放比例，默认1（显示尺寸），2为导出尺寸
}, ref) => {
  // 获取日期的各部分
  const month = date ? MONTH_ABBR[date.getMonth()] : 'Jan.'
  const day = date ? date.getDate() : 1
  const weekday = date ? WEEKDAY_CN[date.getDay()] : '星期一'
  
  // 基础尺寸（scale=1时的尺寸）
  const baseWidth = 444.5
  const baseHeight = 750

  return (
    <div 
      ref={ref}
      data-poster-canvas
      className="relative bg-white overflow-hidden"
      style={{
        width: `${baseWidth * scale}px`,
        height: `${baseHeight * scale}px`,
        backgroundImage: 'url(/bg_template.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* ========== 日期模块 ========== */}
      {/* 
        使用绝对定位精确控制每个元素的位置
        确保完美对齐
      */}
      <div 
        className="absolute"
        style={{
          top: `${125 * scale}px`,
          right: `${29 * scale}px`,
          height: `${50 * scale}px`,
          position: 'relative',
        }}
      >
        {/* 月份 - Caveat 手写字体 */}
        <div 
          className="font-caveat"
          style={{
            position: 'absolute',
            right: `${100 * scale}px`,
            bottom: `${10 * scale}px`,
            fontSize: `${50 * scale}px`,
            color: '#6EC7C0',
            fontWeight: '400',
            lineHeight: `${20 * scale}px`,
            height: `${20 * scale}px`,
            letterSpacing: `${-0.5 * scale}px`,
            overflow: 'visible',
          }}
        >
          {month}
        </div>

        {/* 日期 - 红色圆角矩形 */}
        <div 
          style={{
            position: 'absolute',
            right: `${56 * scale}px`,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#E55D49',
            borderRadius: `${2 * scale}px`,
            width: `${30 * scale}px`,
            height: `${20 * scale}px`,
            fontSize: `${15 * scale}px`,
            fontWeight: '600',
            color: '#ffffff',
            lineHeight: 1,
          }}
        >
          {day}
        </div>

        {/* 星期 - 灰色文字 */}
        <div 
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            fontSize: `${14 * scale}px`,
            color: '#888888',
            fontWeight: '400',
            lineHeight: `${20 * scale}px`,
            height: `${20 * scale}px`,
          }}
        >
          {weekday}
        </div>
      </div>

      {/* ========== 主插图区域 ========== */}
      {/* 
        位置：海报中上部
        样式：带阴影的图片容器
      */}
      <div 
        className="absolute"
        style={{
          top: `${210 * scale}px`,
          left: `${29 * scale}px`,
          right: `${29 * scale}px`,
        }}
      >
        {/* 图片容器 - 无阴影 */}
        <div 
          className="relative bg-white overflow-hidden"
          style={{
            width: `${387 * scale}px`,
            height: `${170 * scale}px`,
            borderRadius: `${1 * scale}px`,
          }}
        >
          {image ? (
            <img 
              src={image} 
              alt="海报插图"
              className="w-full h-full object-cover"
            />
          ) : (
            // 占位图 - 当没有上传图片时显示
            <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <svg 
                  style={{ width: `${64 * scale}px`, height: `${64 * scale}px`, marginLeft: 'auto', marginRight: 'auto', marginBottom: `${12 * scale}px` }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
                <span style={{ fontSize: `${12 * scale}px` }} className="text-gray-400">点击左侧上传图片</span>
              </div>
            </div>
          )}
        </div>

        {/* 图片来源标注 - 位于图片右下角外侧 */}
        {imageSource && (
          <div 
            className="text-right"
            style={{
              fontSize: `${9 * scale}px`,
              color: '#999999',
              fontWeight: '300',
              marginTop: `${3 * scale}px`,
            }}
          >
            图·{imageSource}
          </div>
        )}
      </div>

      {/* ========== 文案区域 ========== */}
      {/* 
        位置：图片下方
        样式：宋体，灰色，居中对齐，适当行高
      */}
      <div 
        className="absolute text-center"
        style={{
          top: `${440 * scale}px`,
          left: `${33 * scale}px`,
          right: `${33 * scale}px`,
        }}
      >
        {/* 主文案 - 使用 Noto Serif SC 宋体 */}
        {mainText && (
          <p 
            className="font-noto-serif whitespace-pre-line"
            style={{
              fontSize: `${12 * scale}px`,
              color: '#777777',
              lineHeight: '1.5',
              letterSpacing: `${0.5 * scale}px`,
            }}
          >
            {mainText}
          </p>
        )}

        {/* 落款 - 自动添加破折号前缀 */}
        {signature && (
          <p 
            className="font-noto-serif"
            style={{
              fontSize: `${12 * scale}px`,
              color: '#777777',
              lineHeight: '1.5',
              marginTop: `${4 * scale}px`,
            }}
          >
            ——《{signature}》
          </p>
        )}
      </div>
    </div>
  )
})

PosterCanvas.displayName = 'PosterCanvas'

export default PosterCanvas

