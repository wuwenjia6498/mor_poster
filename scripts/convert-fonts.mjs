/**
 * 字体转换脚本：TTF → WOFF2
 *
 * 作用：
 *   将 public/fonts/ 下的老式 TTF 文件（例如缺 OS/2 表、被 Chrome OTS 拒绝）
 *   转换为 WOFF2 格式。WOFF2 编码器会重写/规范化内部表结构，通常能修复
 *   "missing OS/2 table" 等解析问题，让现代浏览器稳定加载。
 *
 * 使用方法：
 *   node scripts/convert-fonts.mjs
 *
 * 输出：
 *   public/fonts/<name>.woff2（与源 TTF 同目录）
 *
 * 依赖：
 *   wawoff2（Google 官方 WOFF2 编/解码器，纯 WASM，无需本机编译环境）
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import wawoff from 'wawoff2'

// __dirname 在 ESM 下的等价写法
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 字体文件目录（项目根/public/fonts）
const FONTS_DIR = path.resolve(__dirname, '..', 'public', 'fonts')

// 需要转换的源文件 → 目标文件名 映射
// （目标名统一小写 + 横线，更符合 Web 习惯）
const TARGETS = [
  { src: 'FREESCPT.TTF', dest: 'freestyle-script-regular.woff2' },
  { src: 'FRESTYSB.TTF', dest: 'freestyle-script-bold.woff2' },
]

async function convertOne({ src, dest }) {
  const srcPath = path.join(FONTS_DIR, src)
  const destPath = path.join(FONTS_DIR, dest)

  const ttfBuffer = await fs.readFile(srcPath)
  // wawoff2.compress 接收 Uint8Array，返回 Uint8Array
  const woff2Bytes = await wawoff.compress(new Uint8Array(ttfBuffer))
  await fs.writeFile(destPath, woff2Bytes)

  const srcSize = (ttfBuffer.length / 1024).toFixed(1)
  const destSize = (woff2Bytes.length / 1024).toFixed(1)
  const ratio = ((1 - woff2Bytes.length / ttfBuffer.length) * 100).toFixed(1)
  console.log(`  ✓ ${src}  (${srcSize} KB)  →  ${dest}  (${destSize} KB, -${ratio}%)`)
}

async function main() {
  console.log(`字体转换：${FONTS_DIR}`)
  for (const target of TARGETS) {
    try {
      await convertOne(target)
    } catch (err) {
      console.error(`  ✗ ${target.src} 转换失败:`, err?.message || err)
      process.exitCode = 1
    }
  }
  console.log('完成。')
}

main()
