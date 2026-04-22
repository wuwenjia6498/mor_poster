/**
 * ControlPanel 模板选择器组件
 *
 * 显示 4 个模板按钮，支持切换选中的模板
 * 品牌色：#385a91
 */
import React from 'react'
import { TEMPLATES } from '@/config/templatesConfig'

/**
 * 模板选择器面板
 *
 * @param {Object} props
 * @param {string} props.selectedTemplateId - 当前选中的模板 ID
 * @param {Function} props.onTemplateChange - 模板切换回调函数
 */
function ControlPanel({ selectedTemplateId, onTemplateChange }) {
  // 按类型分组模板
  const morningTemplates = TEMPLATES.filter((t) => t.type === 'morning')
  const nightTemplates = TEMPLATES.filter((t) => t.type === 'night')

  // 动态生成"早安-N / 晚安-N"标签，支持任意数量模板
  const templatesWithLabels = [
    ...morningTemplates.map((t, i) => ({ ...t, label: `早安-${i + 1}` })),
    ...nightTemplates.map((t, i) => ({ ...t, label: `晚安-${i + 1}` })),
  ]

  return (
    <div className="template-selector">
      {/* 标题 */}
      <h3 className="text-xs font-medium text-gray-600 mb-2">选择模板</h3>

      {/* 模板按钮列表 - 横向排列，数量变多时自动换行 */}
      <div className="flex flex-wrap gap-1.5">
        {templatesWithLabels.map((template) => (
          <TemplateButton
            key={template.id}
            template={template}
            label={template.label}
            isSelected={selectedTemplateId === template.id}
            onClick={() => onTemplateChange(template.id)}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * 单个模板按钮
 */
function TemplateButton({ template, label, isSelected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex-1 px-2.5 py-1.5 rounded-md font-medium text-xs
        
        transition-all duration-200
        focus:outline-none focus:ring-1 focus:ring-brand-blue
        ${isSelected
          ? 'bg-brand-blue text-white shadow-sm hover:bg-brand-blue/90'
          : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-blue/30 hover:bg-brand-blue/5'
        }
      `}
    >
      <span className="whitespace-nowrap">{label}</span>
    </button>
  )
}

export default ControlPanel
