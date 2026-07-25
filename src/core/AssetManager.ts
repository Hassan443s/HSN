export class AssetManager {

  private static images = new Map<string, HTMLImageElement>();
  private static sources = new Map<string, string>();

  static loadImage(name: string, src: string): Promise<HTMLImageElement> {
    const existing = this.images.get(name);

    if (existing && existing.complete && this.sources.get(name) === src) {
      return Promise.resolve(existing);
    }

    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        resolve(image);
      };

      image.onerror = () => {
        console.error("Image failed:", src);
        reject(new Error(`Image "${src}" failed to load.`));
      };

      image.src = src;

      this.images.set(name, image);
      this.sources.set(name, src);
    });
  }

  static getImage(name: string): HTMLImageElement | undefined {
    return this.images.get(name);
  }

  /** إزالة صورة واحدة من الذاكرة */
  static unload(name: string): void {
    const img = this.images.get(name);
    if (img) {
      img.src = "";
    }
    this.images.delete(name);
    this.sources.delete(name);
  }

  /** تفريغ كل الصور */
  static clear(): void {
    for (const img of this.images.values()) {
      img.src = "";
    }
    this.images.clear();
    this.sources.clear();
  }

  static has(name: string): boolean {
    return this.images.has(name);
  }

  static count(): number {
    return this.images.size;
  }

  static reloadIfBroken(): void {
    for (const [name, img] of this.images) {
      const isBroken = img.complete && img.naturalWidth === 0;

      if (isBroken) {
        const src = this.sources.get(name);
        if (!src) continue;

        const fresh = new Image();
        fresh.onerror = () => {
          console.error("Image reload failed:", src);
        };
        fresh.src = src;
        this.images.set(name, fresh);
      }
    }
  }
}