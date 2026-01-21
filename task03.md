# 角色
你是一名擅长图像处理的 React 前端专家。

# 任务
升级“控制面板 (ControlPanel)”的图片上传功能，从“自动居中裁切”改为**“用户手动裁切”**。
我们需要引入 `react-easy-crop` 库，让用户可以拖拽和缩放图片，选择最佳展示区域。

# 技术栈
- 核心库：`react-easy-crop` (假设已安装)
- UI 组件：Shadcn UI `Dialog` (弹窗), `Slider` (缩放滑块), `Button`。
- 图标：Lucide React

# 实施步骤

## 第一步：编写裁切工具函数 (`canvasUtils.js`)
我们需要一个纯 JS 函数来处理图片像素。请创建一个 `getCroppedImg(imageSrc, pixelCrop)` 函数：
1. 创建一个临时的 HTMLImageElement 加载原图。
2. 创建一个临时的 Canvas。
3. 根据 `pixelCrop` (x, y, width, height) 将原图的指定区域绘制到 Canvas 上。
4. 返回一个 Promise，解析为裁切后的图片 **Blob URL** (例如 `blob:http://...`)。
*目的：* 这样主海报组件 (`PosterCanvas`) 就不需要修改任何逻辑，它只需要接收这张已经处理好的“完美图片”。

## 第二步：创建 `ImageCropper` 组件
创建一个新的弹窗组件，用于承载裁切交互：
- **Props:** `open` (控制弹窗显示), `imageSrc` (原图), `aspectRatio` (锁定比例), `onComplete` (回调裁切后的图), `onCancel`.
- **UI 布局：**
  - 使用 Shadcn `Dialog` 包裹。
  - 中间区域放置 `<Cropper />` (设置 `objectFit="contain"` 以便在弹窗里看全图)。
  - 底部区域放置一个 `Slider` 用于控制 `zoom` (1 到 3)。
  - 底部按钮：“取消”和“确认裁切”。
- **逻辑：** 点击“确认”时，调用 `getCroppedImg`，通过 `onComplete` 返回新的 Blob URL。

## 第三步：集成到 `ControlPanel`
修改文件上传的逻辑：
1. 状态管理：新增 `originalImage` (原图) 和 `isCropping` (是否正在裁切) 状态。
2. `handleFileChange`：用户选图后，不直接更新海报，而是设置 `originalImage` 并打开 `isCropping` 弹窗。
3. **关键点 - 纵横比 (Aspect Ratio)：**
   - 查看之前的 `PosterCanvas` 代码，找到主插图区域的宽度和高度 (例如 W:800, H:600)。
   - 计算出该比例 (例如 4/3)，并将此 `aspect` 属性传递给 `ImageCropper`。这能强制用户按照海报坑位的形状进行裁切。
4. 回调处理：当 `ImageCropper` 返回新图时，更新主状态 `imageSrc`，关闭弹窗。

# 行动
请编写完整的代码，包括 `canvasUtils.js` 工具文件、`ImageCropper.jsx` 组件以及 `ControlPanel.jsx` 的修改部分。