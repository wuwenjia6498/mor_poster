/**
 * 工具函数库
 * 包含 cn() 用于合并 Tailwind 类名
 */
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并 Tailwind CSS 类名
 * @param {...string} inputs - 类名字符串
 * @returns {string} 合并后的类名
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

