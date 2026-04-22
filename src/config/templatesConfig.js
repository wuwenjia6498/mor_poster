/**
 * 模板配置文件
 *
 * 包含所有海报模板的布局和样式配置
 * 所有数值均基于 baseWidth: 444.5, baseHeight: 750 的基础尺寸
 *
 * 注意：以下数值从现有 canvasRenderer.js 精确提取，请勿随意修改
 */

/**
 * 模板配置数组
 * 包含 2 款早安模板 + 3 款晚安模板
 *
 * 说明：
 * - hasImage: true/false  是否需要用户上传主插图
 *   -- 缺省视为 true
 *   -- 为 false 时编辑面板会隐藏"图片上传 + 图片来源"两栏，
 *      渲染器也会跳过插图与来源文字的绘制
 */
export const TEMPLATES = [
  // ========== 模板 1: 早安红框款 (Morning 01) ==========
  // 从现有代码精确提取的数值，确保零回退
  {
    id: 'morning_01',
    name: '早安·红框款',
    type: 'morning',
    styleMode: 'badge_red', // 红框日期样式
    background: '/bg_template.png',
    thumbnail: '/bg_template.png', // 缩略图（可后续替换为专用缩略图）

    // 画布基础尺寸
    canvas: {
      baseWidth: 444.5,
      baseHeight: 750,
    },

    // 日期模块布局
    date: {
      // 月份（Caveat 手写字体）
      month: {
        // 原代码: ctx.fillText(month, width - 29 * scale - 100 * scale, 175 * scale)
        x: -129, // 负值表示从右边距算起 (width - 129)
        y: 175,
        font: {
          weight: 400,
          size: 50,
          family: 'Caveat',
        },
        color: '#6EC7C0',
        textAlign: 'right',
        textBaseline: 'alphabetic',
      },

      // 红框日期
      badge: {
        // 原代码: dateBoxX = width - 29 * scale - 56 * scale - 30 * scale
        x: -115, // 负值表示从右边距算起 (width - 115)
        y: 155,
        width: 30,
        height: 20,
        bgColor: '#E55D49',
        radius: 2,
        // 日期数字
        text: {
          // 原代码: 600 ${15 * scale}px -apple-system...
          font: {
            weight: 600,
            size: 15,
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          },
          color: '#ffffff',
          offsetY: 2, // 垂直偏移以更好居中
        },
      },

      // 星期
      weekday: {
        // 原代码: ctx.fillText(weekday, width - 29 * scale, 175 * scale)
        x: -29, // 负值表示从右边距算起 (width - 29)
        y: 175,
        font: {
          weight: 400,
          size: 14,
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        color: '#888888',
        textAlign: 'right',
        textBaseline: 'bottom',
      },
    },

    // 主插图区域
    image: {
      // 原代码: imgX = 29, imgY = 210, imgWidth = 387, imgHeight = 170
      x: 29,
      y: 210,
      width: 387,
      height: 170,
      radius: 1, // 圆角半径
    },

    // 图片来源标注
    imageSource: {
      // 原代码: ctx.fillText(`图：${imageSource}`, width - 29 * scale, 210 * scale + 170 * scale + 3 * scale)
      x: -29, // 负值表示从右边距算起 (width - 29)
      y: 388, // 210 + 170 + 8，增加5px间距
      font: {
        weight: 300,
        size: 10,
        family: '"Alibaba PuHuiTi Light", "Alibaba PuHuiTi", "PingFang SC", "Noto Sans SC", sans-serif',
      },
      color: '#000000',
      textAlign: 'right',
      textBaseline: 'top',
      prefix: '图 · ', // 前缀文字，使用中间点
    },

    // 主文案区域
    mainText: {
      // 原代码: textX = width / 2, textY = 440 * scale
      x: 'center', // 特殊值表示居中
      y: 445, // 往下移5px (440 + 5)
      font: {
        weight: 300,
        size: 14,
        family: '"Alibaba PuHuiTi Light", "Alibaba PuHuiTi", "PingFang SC", "Noto Sans SC", sans-serif',
      },
      color: '#111111',
      lineHeight: 1.5,
      textAlign: 'center',
      textBaseline: 'top',
    },
  },

  // ========== 模板 2: 早安通栏款 (Morning 02) ==========
  // 基于模板1，修改为通栏大图布局
  {
    id: 'morning_02',
    name: '早安·通栏款',
    type: 'morning',
    styleMode: 'badge_red', // 同样使用红框日期样式
    background: '/bg_morning_2.png',
    thumbnail: '/bg_morning_2.png',

    canvas: {
      baseWidth: 444.5,
      baseHeight: 750,
    },

    // 日期模块 - 与模板1相同
    date: {
      month: {
        x: -129,
        y: 175,
        font: {
          weight: 400,
          size: 50,
          family: 'Caveat',
        },
        color: '#6EC7C0',
        textAlign: 'right',
        textBaseline: 'alphabetic',
      },
      badge: {
        x: -115,
        y: 155,
        width: 30,
        height: 20,
        bgColor: '#E55D49',
        radius: 2,
        text: {
          font: {
            weight: 600,
            size: 15,
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          },
          color: '#ffffff',
          offsetY: 2,
        },
      },
      weekday: {
        x: -29,
        y: 175,
        font: {
          weight: 400,
          size: 14,
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        color: '#888888',
        textAlign: 'right',
        textBaseline: 'bottom',
      },
    },

    // 主插图区域 - 向下移动20px
    image: {
      x: 29,
      y: 230, // 210 + 20
      width: 387,
      height: 170,
      radius: 1,
    },

    // 图片来源标注
    imageSource: {
      x: -29,
      y: 408, // 230 + 170 + 8，增加5px间距
      font: {
        weight: 300,
        size: 10,
        family: '"Alibaba PuHuiTi Light", "Alibaba PuHuiTi", "PingFang SC", "Noto Sans SC", sans-serif',
      },
      color: '#000000',
      textAlign: 'right',
      textBaseline: 'top',
      prefix: '图 · ',
    },

    // 主文案区域 - 左对齐插图，右移20px，下移40px，整体再下移20px
    mainText: {
      x: 49, // 插图左边缘(29) + 右移20px
      y: 500, // 原位置(440) + 下移40px + 整体下移20px
      font: {
        weight: 300,
        size: 14,
        family: '"Alibaba PuHuiTi Light", "Alibaba PuHuiTi", "PingFang SC", "Noto Sans SC", sans-serif',
      },
      color: '#111111',
      lineHeight: 1.5,
      textAlign: 'left', // 左对齐
      textBaseline: 'top',
    },
  },

  // ========== 模板 3: 晚安极简款 (Night 01) ==========
  // 插图在顶部，日期在底部，极简竖线风格
  {
    id: 'night_01',
    name: '晚安·极简款',
    type: 'night',
    styleMode: 'minimal_vertical', // 极简竖线日期样式
    background: '/bg_night_1.png',
    thumbnail: '/bg_night_1.png',

    canvas: {
      baseWidth: 444.5,
      baseHeight: 750,
    },

    // 主插图区域 - 顶部大图，上移40px
    image: {
      x: 29,
      y: 170, // 210 - 40
      width: 387,
      height: 170,
      radius: 1,
    },

    // 图片来源标注
    imageSource: {
      x: -29,
      y: 348, // 170 + 170 + 8，增加5px间距
      font: {
        weight: 300,
        size: 10,
        family: '"Alibaba PuHuiTi Light", "Alibaba PuHuiTi", "PingFang SC", "Noto Sans SC", sans-serif',
      },
      color: '#666666',
      textAlign: 'right',
      textBaseline: 'top',
      prefix: '图 · ',
    },

    // 主文案区域，下移40px
    mainText: {
      x: 'center',
      y: 480, // 440 + 40
      font: {
        weight: 300,
        size: 14,
        family: '"Alibaba PuHuiTi Light", "Alibaba PuHuiTi", "PingFang SC", "Noto Sans SC", sans-serif',
      },
      color: '#333333',
      lineHeight: 1.5,
      textAlign: 'center',
      textBaseline: 'top',
    },

    // 日期模块 - 底部布局（图二目标样式）
    date: {
      // 月份英文缩写（左下角）
      monthEn: {
        x: 130, // 默认位置（Mar./May. 会在渲染时动态调整）
        y: 748, // 往下移20px (728 + 20)
        font: {
          weight: 400,
          size: 80, // 字号变大
          family: '"Freestyle Script", cursive', // 使用 Freestyle Script 字体
        },
        color: '#C7C7C7', // 灰色
        textAlign: 'left',
        textBaseline: 'bottom',
        format: 'short', // 使用英文缩写 (Jan, Feb, etc.)
      },

      // 竖线分隔符（日期和星期左侧）
      divider: {
        x: 'center',
        offsetX: 0, // 往左移20px (20 - 20)
        y: 693, // 往下移20px (673 + 20)
        width: 1, // 加粗至2倍
        height: 70, // 加长20px (42 + 20)
        color: '#555555', // 浅灰色
      },

      // 星期（日期上方，小字）
      weekday: {
        x: 'center',
        offsetX: 35, // 往左移20px (55 - 20)
        y: 662, // 往下移20px (642 + 20)
        font: {
          weight: 400,
          size: 14,
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        color: '#555555',
        textAlign: 'center',
        textBaseline: 'top',
      },

      // 日期数字（中间偏右，大号）
      day: {
        x: 'center',
        offsetX: 35, // 往左移20px (55 - 20)
        y: 736, // 往下移20px (716 + 20)
        font: {
          weight: 400,
          size: 56,
          family: '"AURORABC", sans-serif', // 使用 AURORABC 字体
        },
        color: '#8896A9',
        textAlign: 'center',
        textBaseline: 'bottom',
      },
    },
  },

  // ========== 模板 4: 晚安卡片款 (Night 02) ==========
  // 另一种晚安风格
  {
    id: 'night_02',
    name: '晚安·卡片款',
    type: 'night',
    styleMode: 'minimal_vertical',
    background: '/bg_night_2.png',
    thumbnail: '/bg_night_2.png',

    canvas: {
      baseWidth: 444.5,
      baseHeight: 750,
    },

    // 主插图区域 - 与晚安1保持一致
    image: {
      x: 29,
      y: 170, // 与晚安1一致
      width: 387,
      height: 170,
      radius: 1,
    },

    // 图片来源标注 - 与晚安1保持一致
    imageSource: {
      x: -29,
      y: 348, // 170 + 170 + 8，与晚安1一致
      font: {
        weight: 300,
        size: 10,
        family: '"Alibaba PuHuiTi Light", "Alibaba PuHuiTi", "PingFang SC", "Noto Sans SC", sans-serif',
      },
      color: '#666666',
      textAlign: 'right',
      textBaseline: 'top',
      prefix: '图 · ',
    },

    // 主文案区域 - 与晚安1保持一致
    mainText: {
      x: 'center',
      y: 480, // 与晚安1一致
      font: {
        weight: 300,
        size: 14,
        family: '"Alibaba PuHuiTi Light", "Alibaba PuHuiTi", "PingFang SC", "Noto Sans SC", sans-serif',
      },
      color: '#333333',
      lineHeight: 1.5,
      textAlign: 'center',
      textBaseline: 'top',
    },

    // 日期模块 - 与晚安1保持一致
    date: {
      // 月份英文缩写（左下角）
      monthEn: {
        x: 130, // 默认位置（Mar./May. 会在渲染时动态调整）
        y: 748, // 与晚安1一致
        font: {
          weight: 400,
          size: 80,
          family: '"Freestyle Script", cursive',
        },
        color: '#C7C7C7',
        textAlign: 'left',
        textBaseline: 'bottom',
        format: 'short',
      },

      // 竖线分隔符（日期和星期左侧）
      divider: {
        x: 'center',
        offsetX: 0, // 与晚安1一致
        y: 693, // 与晚安1一致
        width: 1,
        height: 70,
        color: '#555555',
      },

      // 星期（日期上方，小字）
      weekday: {
        x: 'center',
        offsetX: 35, // 与晚安1一致
        y: 662, // 与晚安1一致
        font: {
          weight: 400,
          size: 14,
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        color: '#555555',
        textAlign: 'center',
        textBaseline: 'top',
      },

      // 日期数字（中间偏右，大号）
      day: {
        x: 'center',
        offsetX: 35, // 与晚安1一致
        y: 736, // 与晚安1一致
        font: {
          weight: 400,
          size: 56,
          family: '"AURORABC", sans-serif',
        },
        color: '#8896A9',
        textAlign: 'center',
        textBaseline: 'bottom',
      },
    },
  },

  // ========== 模板 5: 晚安阅美款 (Night 03) ==========
  // 特点：无插图上传（插画已融入背景），仅编辑文案 + 日期
  // 日期样式：横向排列 "Mar" (橙色手写) + "3" (深蓝圆徽) + "星期二" (深蓝)
  {
    id: 'night_03',
    name: '晚安·阅美款',
    type: 'night',
    styleMode: 'night_badge_horizontal', // 新日期样式：横向徽章
    background: '/bg_night_3.png',
    thumbnail: '/bg_night_3.png',
    hasImage: false, // 关键：不需要用户上传插图

    canvas: {
      baseWidth: 444.5,
      baseHeight: 750,
    },

    // 主文案区域 - 左对齐，位于"阅读·阅美"标题之下
    // 本模板开启自动换行：用户输入整段文字，渲染器按 maxWidth 自动折行
    mainText: {
      x: 50, // 左边距 50px
      y: 408, // 位于"阅读·阅美"标题之下约 20px 的位置
      // 自动换行的最大行宽：画布 444.5 - 左 50 - 右 50 ≈ 344
      // 设置后，renderer 将调用 wrapTextByWidth 按字符级测量自动折行
      // 如需再留出更多右边距，减小此值即可
      maxWidth: 344,
      font: {
        weight: 300,
        size: 14,
        family: '"Alibaba PuHuiTi Light", "Alibaba PuHuiTi", "PingFang SC", "Noto Sans SC", sans-serif',
      },
      color: '#333333',
      lineHeight: 1.7, // 加大行距，段落更舒展
      textAlign: 'left',
      textBaseline: 'top',
    },

    // 日期模块 - 底部横向布局（整体位于分割线与底边的中间区域）
    date: {
      // 月份英文缩写（橙色手写体，最左侧）
      monthEn: {
        x: 55, // 左边距 55px（整体右移 25px，从视觉上更贴近中间区域）
        y: 720, // 底部基线（从 738 上移 18px，让整个日期块居于底部留白区中央）
        font: {
          weight: 700, // 使用加粗款 FRESTYSB
          size: 56,
          family: '"Freestyle Script", cursive',
        },
        color: '#E55D49', // 橙红色（与品牌红呼应）
        textAlign: 'left',
        textBaseline: 'alphabetic',
        format: 'short', // "Mar." 而非 "March"（保留缩写点号，与其他模板统一）
        stripDot: false, // 不去掉点号：与晚安1/2、早安模板保持"Mar./Apr."一致
      },

      // 日期圆形徽章（深蓝色实心圆）
      badge: {
        x: 148, // 圆心 X（整体右移 + 缩小与"Mar"的横向间距到约 4px）
        y: 704, // 圆心 Y（跟随整体上移 18px）
        radius: 19, // 半径：参考图中圆直径明显较大
        bgColor: '#1F3A68', // 深海军蓝
        text: {
          font: {
            weight: 600,
            size: 22, // 与 radius 联动加大
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          },
          color: '#ffffff',
          offsetY: 1, // 数字垂直微调（视觉居中）
        },
      },

      // 星期（圆徽右侧，深蓝色）
      weekday: {
        x: 178, // 圆徽右侧起（与圆徽间距约 10px，视觉呼吸更舒服）
        y: 714, // 与圆徽视觉居中对齐（跟随整体上移 18px）
        font: {
          weight: 400,
          size: 17, // 放大：与参考图星期字号一致
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Noto Sans SC", sans-serif',
        },
        color: '#1F3A68', // 与圆徽同色
        textAlign: 'left',
        textBaseline: 'alphabetic',
      },
    },
  },
]

/**
 * 根据 ID 获取模板配置
 * @param {string} templateId - 模板 ID
 * @returns {Object|undefined} 模板配置对象
 */
export function getTemplateById(templateId) {
  return TEMPLATES.find((t) => t.id === templateId)
}

/**
 * 根据类型筛选模板
 * @param {'morning'|'night'} type - 模板类型
 * @returns {Array} 模板配置数组
 */
export function getTemplatesByType(type) {
  return TEMPLATES.filter((t) => t.type === type)
}

/**
 * 获取默认模板（第一个早安模板）
 * @returns {Object} 默认模板配置
 */
export function getDefaultTemplate() {
  return TEMPLATES[0]
}

