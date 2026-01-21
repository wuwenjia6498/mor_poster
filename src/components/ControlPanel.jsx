/**
 * ControlPanel 模板选择器组件
 *
 * 显示 4 个模板按钮，支持切换选中的模板
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

  // 为模板添加编号
  const templatesWithLabels = [
    { ...morningTemplates[0], label: '早安-1' },
    { ...morningTemplates[1], label: '早安-2' },
    { ...nightTemplates[0], label: '晚安-1' },
    { ...nightTemplates[1], label: '晚安-2' },
  ]

  return (
    <div className="template-selector">
      {/* 标题 */}
      <h3 className="text-xs font-medium text-gray-600 mb-2">选择模板</h3>

      {/* 模板按钮列表 - 横向排列 */}
      <div className="flex gap-1.5">
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
        focus:outline-none focus:ring-1 focus:ring-blue-400
        ${isSelected
          ? 'bg-blue-500 text-white shadow-sm hover:bg-blue-600'
          : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:bg-blue-50'
        }
      `}
    >
      <span className="whitespace-nowrap">{label}</span>
    </button>
  )
}

export default ControlPanel
