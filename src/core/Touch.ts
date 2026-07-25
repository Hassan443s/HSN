export class Touch {

  static x = 0;
  static y = 0;
  static pressed = false;
  static justPressed = false;
  static justReleased = false;

  private static onTouchStart = (e: TouchEvent) => {

    e.preventDefault();
   if(Touch.pressed) return;

    const touch = e.touches[0];
    if (!touch) return;

    const rect = (e.currentTarget as HTMLCanvasElement).getBoundingClientRect();

    Touch.x = touch.clientX - rect.left;
    Touch.y = touch.clientY - rect.top;

    Touch.pressed = true;
    Touch.justPressed = true;

  };

  private static onTouchMove = (e: TouchEvent) => {

    e.preventDefault();

    const touch = e.touches[0];
    if (!touch) return;

    const rect = (e.currentTarget as HTMLCanvasElement).getBoundingClientRect();

    Touch.x = touch.clientX - rect.left;
    Touch.y = touch.clientY - rect.top;

  };

  private static onTouchEnd = (e: TouchEvent) => {

   if(e.touches.length > 0) return;

    Touch.pressed = false;
    Touch.justReleased = true;

  };

  static init(canvas: HTMLCanvasElement) {

    canvas.addEventListener("touchstart", this.onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", this.onTouchMove, { passive: false });
    canvas.addEventListener("touchend", this.onTouchEnd);

  }

  static destroy(canvas: HTMLCanvasElement) {

    canvas.removeEventListener("touchstart", this.onTouchStart);
    canvas.removeEventListener("touchmove", this.onTouchMove);
    canvas.removeEventListener("touchend", this.onTouchEnd);

    this.pressed = false;
    this.justPressed = false;
    this.justReleased = false;

  }

  static update() {

    this.justPressed = false;
    this.justReleased = false;

  }

}