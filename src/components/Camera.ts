import { Component } from "../core/Component";
import type { GameObject } from "../core/GameObject";

export class Camera extends Component {
	public zoom: number;
	public target: GameObject | null = null;
	public smooth: boolean = false;
	public smoothSpeed: number = 5;

	constructor(zoom: number = 1) {
		super();
		this.zoom = zoom;
		this.name = "Camera Component";
	}

	apply(
		ctx: CanvasRenderingContext2D,
		viewWidth: number,
		viewHeight: number
	) {
		ctx.save();

		const t = this.gameObject.transform;

		ctx.translate(viewWidth / 2, viewHeight / 2);
		ctx.scale(this.zoom, this.zoom);
		ctx.translate(-t.x, -t.y);
	}

	reset(ctx: CanvasRenderingContext2D) {
		ctx.restore();
	}

	start() {

	}

	update(delta: number) {
		if (!this.target) return;

		const camera = this.gameObject.transform;
		const target = this.target.transform;

		if (this.smooth) {
			camera.x += (target.x - camera.x) *
			this.smoothSpeed * delta;

			camera.y += (target.y - camera.y) *
			this.smoothSpeed * delta;
		} else {
			camera.x = target.x;
			camera.y = target.y;
		}
	}

	screenToWorld(
		screenX: number,
		screenY: number,
		viewWidth: number,
		viewHeight: number
	): { x: number; y: number } {

		const t = this.gameObject.transform;

		return {
			x: t.x + (screenX - viewWidth / 2) / this.zoom,
			y: t.y + (screenY - viewHeight / 2) / this.zoom
		};
	}
}