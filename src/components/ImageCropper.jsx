/**
 * ImageCropper 图片裁切组件
 *
 * 使用 react-easy-crop 实现用户手动裁切图片
 */
import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Crop, ZoomIn } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'

const ImageCropper = ({
  open,
  imageSrc,
  aspectRatio = 387 / 170, // 默认为海报主插图比例
  onComplete,
  onCancel,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  /**
   * 裁切区域改变回调
   */
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  /**
   * 确认裁切
   */
  const handleConfirm = useCallback(() => {
    if (croppedAreaPixels && onComplete) {
      onComplete(croppedAreaPixels)
    }
  }, [croppedAreaPixels, onComplete])

  /**
   * 取消裁切
   */
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel()
    }
  }, [onCancel])

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crop className="w-5 h-5" />
            裁切图片
          </DialogTitle>
        </DialogHeader>

        {/* 裁切区域 */}
        <div className="flex-1 relative bg-gray-900 rounded-lg overflow-hidden">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              objectFit="contain"
              style={{
                containerStyle: {
                  background: '#1f2937',
                },
                cropAreaStyle: {
                  border: '2px solid #6EC7C0',
                },
              }}
            />
          )}
        </div>

        {/* 缩放控制 */}
        <div className="space-y-2 px-2">
          <div className="flex items-center gap-3">
            <Label className="flex items-center gap-2 text-sm text-gray-600 min-w-[80px]">
              <ZoomIn className="w-4 h-4" />
              缩放
            </Label>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(value) => setZoom(value[0])}
              className="flex-1"
            />
            <span className="text-sm text-gray-500 min-w-[60px] text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>
          <p className="text-xs text-gray-400 text-center">
            拖动图片调整位置，滚动鼠标滚轮或使用滑块调整缩放
          </p>
        </div>

        {/* 底部按钮 */}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            取消
          </Button>
          <Button
            variant="brand"
            onClick={handleConfirm}
            disabled={!croppedAreaPixels}
          >
            确认裁切
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ImageCropper
