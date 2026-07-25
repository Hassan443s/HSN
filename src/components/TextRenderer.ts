import { Component } from "../core/Component";

export class TextRenderer extends Component {

  text: string;
  color: string;

  stroke: boolean;
  strokeColor: string;
  strokeSize: number;

  private _font: string;
  private _maxWidth: number;
  private _lineHeight: number;

  private autoMaxWidth: boolean;
  private autoLineHeight: boolean;

  constructor(
    text: string,
    font: string = "20px Arial",
    color: string = "white",
    stroke: boolean = false,
    strokeColor: string = "black",
    strokeSize: number = 2,
    maxWidth?: number,
    lineHeight?: number
  ) {
    super();

    this.name = "TextRenderer";

    this.text = text;
    this._font = font;
    this.color = color;

    this.stroke = stroke;
    this.strokeColor = strokeColor;
    this.strokeSize = strokeSize;

    this.autoMaxWidth = maxWidth === undefined;
    this.autoLineHeight = lineHeight === undefined;

    this._maxWidth = maxWidth ?? Infinity;
    this._lineHeight = lineHeight ?? this.computeAutoLineHeight();
  }

  get font(): string {
    return this._font;
  }

  set font(value: string) {
    this._font = value;
    if (this.autoLineHeight) {
      this._lineHeight = this.computeAutoLineHeight();
    }
  }

  get maxWidth(): number {
    return this._maxWidth;
  }

  set maxWidth(value: number) {
    this._maxWidth = value;
    this.autoMaxWidth = false;
  }

  get lineHeight(): number {
    return this._lineHeight;
  }

  set lineHeight(value: number) {
    this._lineHeight = value;
    this.autoLineHeight = false;
  }

  private extractFontSize(font: string): number {
    const match = font.match(/(\d+(\.\d+)?)px/);
    return match ? parseFloat(match[1]) : 20;
  }

  private computeAutoLineHeight(): number {
    return this.extractFontSize(this._font) * 1.2;
  }

  private computeAutoMaxWidth(): number {
    const scene = this.gameObject.scene;
    const engine = scene?.engine;

    if (!engine) return Infinity;

    const zoom = scene?.activeCamera?.zoom ?? 1;
    return engine.viewWidth / zoom;
  }

  private wrapText(
    ctx: CanvasRenderingContext2D,
    text: string
  ): string[] {
    const effectiveMaxWidth = this.autoMaxWidth
      ? this.computeAutoMaxWidth()
      : this._maxWidth;

    const paragraphs = text.split("\n");
    const lines: string[] = [];

    for (const para of paragraphs) {
      if (para === "") {
        lines.push("");
        continue;
      }

      if (!isFinite(effectiveMaxWidth)) {
        lines.push(para);
        continue;
      }

      const words = para.split(" ");
      let line = "";

      for (const word of words) {
        const test = line ? line + " " + word : word;

        if (ctx.measureText(test).width > effectiveMaxWidth) {
          if (line) lines.push(line);
          line = word;
        } else {
          line = test;
        }
      }

      if (line) lines.push(line);
    }

    return lines;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    ctx.translate(
      this.gameObject.transform.x,
      this.gameObject.transform.y
    );

    ctx.rotate(this.gameObject.transform.rot);

    ctx.scale(
      this.gameObject.transform.scaleX,
      this.gameObject.transform.scaleY
    );

    ctx.font = this.font;
    ctx.fillStyle = this.color;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const lines = this.wrapText(ctx, this.text);

    lines.forEach((line, index) => {
      const y = (index - (lines.length - 1) / 2) * this.lineHeight;

      if (this.stroke) {
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.strokeSize;
        ctx.strokeText(line, 0, y);
      }

      ctx.fillText(line, 0, y);
    });

    ctx.restore();
  }
}