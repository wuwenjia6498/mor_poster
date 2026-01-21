# 角色
高级前端开发专家 (Pixel-Perfect Expert)。

# 修正后的问题描述 (CRITICAL UPDATE)
用户反馈上一版代码存在严重的渲染偏差。在 `html2canvas` 导出的图片中：
1. **红框内的日期数字 (Day)** 没有垂直居中，而是偏上或偏下了。
2. **月份 (Month)** 和 **星期 (Weekday)** 相对于红框的位置也发生了错误的垂直偏移。
3. **整体表现：** 三个元素（月、日框、周）原本在浏览器中是对齐的，但在导出图中像是“散架”了。

# 根因分析
`html2canvas` 经常无法正确渲染 `display: flex; align-items: center;`，尤其是当子元素包含不同字体（自定义手写体 vs 系统字体）和不同容器高度时，基线计算会出错。

# 必须执行的修复方案 (CSS Hardening)

请重写 `PosterCanvas` 组件的 **日期模块 (Date Module)** CSS，放弃依赖 `flex` 的自动居中，改用更底层的“物理定位”：

## 1. 红框数字的修复 (The Red Box)
不要使用 `flex` `justify-center` `items-center` 来居中数字。
请使用“行高法” (Line-height Hack) 确保 100% 居中：
- 设置红框为固定宽高 (例如 `w-8 h-8` 或 `w-[32px] h-[32px]`)。
- **关键：** 设置 `line-height` 等于高度 (例如 `leading-[32px]`)。
- 设置 `text-align: center`。
- 这样无论 Canvas 怎么算，文字都会被行高强行锁死在中间。

## 2. 月份和星期的对齐修复 (Side Text)
不要依赖父容器的 `items-center` 来对齐这三个元素。
- 将父容器设置为 `flex items-end` (底部对齐) 或者 `flex items-baseline`。
- 然后给“月份”和“星期”单独添加 `mb-[x]px` (底部外边距) 或 `translate-y`，通过微调像素值，让它们在视觉上与红框中心对齐。
- **或者：** 如果 Flexbox 依然不稳定，请将这三个元素全部改为 `absolute` 定位，相对于同一个父容器精确指定 `top` 和 `left` 像素值。

## 3. 实施“影子容器” (Ghost Container)
(必须保留此逻辑)
创建一个 `id="export-container"`：
- `position: fixed; left: -9999px;`
- **Width:** 固定为设计稿原宽 (如 1080px 或 750px)。
- **Scale:** 1 (不缩放)。
- 导出时对这个容器截图，彻底消除屏幕缩放带来的偏移干扰。

# 行动
请重构代码，重点展示修改后的 **CSS 类名** 和 **DOM 结构**，确保导出后的红框数字完美居中，且两侧文字对齐整齐。

4. html2canvas 配置更新
请使用以下配置以获得最佳效果：

JavaScript

const canvas = await html2canvas(element, {
  scale: 2, // 保持高清
  useCORS: true,
  backgroundColor: null, // 避免多余的白色背景
  scrollY: -window.scrollY, // 核心：防止滚动后的偏移
  
  // 【新增建议】显式指定画布尺寸，防止意外的留白
  windowWidth: element.scrollWidth,
  windowHeight: element.scrollHeight,
});