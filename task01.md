# 角色
你是一位拥有极高审美标准的高级前端工程师（React 专家）。我们要开发“老约翰早安日签海报生成器”。

# 提供的视觉素材 (Assets)
请仔细分析我提供的两张图片：
1.  **`reference_poster.png` (视觉参考标准):**
    -这是最终成品的目标样式。请仔细“观察”并分析其中元素（日期、插图、文字）的 **字号、颜色、间距、字体粗细** 和 **绝对位置**。你需要写 CSS 来像素级复刻它。
2.  **`bg_template.png` (开发背景素材):**
    - 这是去除了动态内容后的底图。你的代码必须将此图作为容器背景 (`background-image`)。

# 技术栈 (Tech Stack)
- **Framework:** React (Vite)
- **Styling:** Tailwind CSS (这是核心，用于精准布局)
- **UI Components:** **shadcn/ui** (必须使用此库构建左侧控制面板，特别是 Input, Textarea, Button, 和 Calendar/Popover 组件)
- **Icons:** Lucide React
- **Export:** html2canvas
- **Fonts:**
    - Google Font: 'Caveat' (用于月份英文)
    - Google Font: 'Noto Serif SC' (用于正文宋体)

# 核心开发任务

## 1. 布局结构 (Split View)
- **左侧 (400px):** 配置面板 (Control Panel)。使用 shadcn/ui 组件构建，风格简洁现代。
- **右侧 (Flex-1):** 实时预览区 (Preview Area)。背景灰色，居中显示海报画布。

## 2. 海报画布逻辑 (The Canvas)
- **容器：** 设置为相对定位 (`relative`)，背景图使用 `bg_template.png`。
- **尺寸：** 预览模式下建议固定宽度 `375px`，高度按原图比例自适应（约为 667px）。导出时需确保高清。
- **元素定位 (Absolute Positioning)：**
    - **日期模块 (参照 reference_poster.png):**
        - Month (Jan.): 使用 'Caveat' 字体，颜色取色为 #6EC7C0。
        - Day (15): 白色文字，背景为圆角矩形 (#E55D49)，注意圆角半径。
        - Weekday: 灰色无衬线体。
        - *关键点：* 请根据 reference_poster.png 的视觉位置，精确调整 `top` 和 `left` 的值。
    - **主插图 (Main Image):**
        - 位于海报中上部。默认显示占位图。
        - 样式：`object-fit: cover`。
        - 来源标注：位于图片右下角外侧，微小灰色字体。
    - **文案 (Text Body):**
        - 位于图片下方。
        - 字体：'Noto Serif SC' (宋体)。
        - 样式：颜色 #555，行高 relaxed，居中对齐。
        - 落款：若用户输入，显示在正文下方，自动添加 "—— " 前缀。

## 3. 交互功能
- **日期选择：** 使用 shadcn 的 `Calendar` + `Popover` 组件。选择日期后，自动利用 `date-fns` 或原生 JS 格式化为：
    - Month (英文缩写)
    - Day (数字)
    - Weekday (中文周几)
- **图片上传：** 提供一个美观的上传区域，支持本地预览。
- **下载功能：** 点击按钮后，使用 `html2canvas` 生成高清 PNG 并触发下载。

# 执行步骤
1. 初始化项目结构，安装必要的 shadcn 组件 (button, input, textarea, calendar, popover, label)。
2. 创建 `PosterCanvas` 组件，编写精准的 Tailwind 类名以复刻 `reference_poster.png` 的布局。
3. 创建 `EditorPanel` 组件，绑定状态。
4. 在 `App.jsx` 中组装。

请直接给出完整的代码实现。