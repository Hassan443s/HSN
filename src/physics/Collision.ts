import type { GameObject } from "../core/GameObject";

export class Collision {

  static pointInObject(
    x: number,
    y: number,
    obj: GameObject,
    width: number,
    height: number
  ): boolean {
    const t = obj.transform;

    const hw = (width * Math.abs(t.scaleX)) / 2;
    const hh = (height * Math.abs(t.scaleY)) / 2;

    // بدون دوران: صندوق محاذي للمحاور مع مراعاة الـ scale
    if (t.rot === 0) {
      return (
        x >= t.x - hw &&
        x <= t.x + hw &&
        y >= t.y - hh &&
        y <= t.y + hh
      );
    }

    // مع دوران: تحويل النقطة إلى local space ثم المقارنة
    const dx = x - t.x;
    const dy = y - t.y;

    const cos = Math.cos(-t.rot);
    const sin = Math.sin(-t.rot);

    const localX = dx * cos - dy * sin;
    const localY = dx * sin + dy * cos;

    return (
      localX >= -hw &&
      localX <= hw &&
      localY >= -hh &&
      localY <= hh
    );
  }
}