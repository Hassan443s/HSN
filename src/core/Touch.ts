export class Touch {

  static x = 0;
  static y = 0;
  static pressed = false;
  static justPressed = false;
  static justReleased = false;

  private static canvas: HTMLCanvasElement | null = null;

  private static updatePosition(clientX: number, clientY: number) {
    if (!Touch.canvas) return;
    const rect = Touch.canvas.getBoundingClientRect();
    Touch.x = clientX - rect.left;
    Touch.y = clientY - rect.top;
  }

  private static onTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    if (Touch.pressed) return;

    const touch = e.touches[0];
    if (!touch) return;

    Touch.updatePosition(touch.clientX, touch.clientY);
    Touch.pressed = true;
    Touch.justPressed = true;
  };

  private static onTouchMove = (e: TouchEvent) => {
    e.preventDefault();

    const touch = e.touches[0];
    if (!touch) return;

    Touch.updatePosition(touch.clientX, touch.clientY);
  };

  private static onTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    if (e.touches.length > 0) return;

    Touch.pressed = false;
    Touch.justReleased = true;
  };

  // مهم على الجوال: مكالمة / إشعار / سحب من المتصفح يلغي اللمس بدون touchend
  private static onTouchCancel = (e: TouchEvent) => {
    e.preventDefault();
    Touch.pressed = false;
    Touch.justReleased = true;
  };

  static init(canvas: HTMLCanvasElement) {
    Touch.canvas = canvas;

    canvas.addEventListener("touchstart", this.onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", this.onTouchMove, { passive: false });
    canvas.addEventListener("touchend", this.onTouchEnd);
    canvas.addEventListener("touchcancel", this.onTouchCancel);
  }

  static destroy(canvas: HTMLCanvasElement) {
    canvas.removeEventListener("touchstart", this.onTouchStart);
    canvas.removeEventListener("touchmove", this.onTouchMove);
    canvas.removeEventListener("touchend", this.onTouchEnd);
    canvas.removeEventListener("touchcancel", this.onTouchCancel);

    Touch.canvas = null;
    this.pressed = false;
    this.justPressed = false;
    this.justReleased = false;
  }

  static update() {
    this.justPressed = false;
    this.justReleased = false;
  }
}