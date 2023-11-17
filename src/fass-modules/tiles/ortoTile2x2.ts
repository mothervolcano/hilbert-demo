import { Point, Path, Group } from "paper";

const DEBUG_MODE = false;

class OrtoTile2x2 {
	private tile: any;
	private frame: any;
	private _frameSize: any;
	private _polygon: any;
	private _tileSize: number;
	private _angle: number;
	private _position: any;
	private group: any;

	constructor(
		vertices: Array<number>,
		position: any,
		tileSize: number,
		frameSize?: number,
		angle?: number,
	) {
		this._position = position;
		this._angle = angle || 0;
		this._tileSize = tileSize;
		this._frameSize = frameSize || this._tileSize;

		this.tile = new Path.Rectangle({
			point: [
				this._position.x - this._tileSize / 2,
				this._position.y - this._tileSize / 2,
			],
			size: this._tileSize,
			strokeColor: "cyan",
			opacity: 0.25,
			visible: DEBUG_MODE,
		});

		this.frame = new Path.Rectangle({
			point: [
				this._position.x - this._frameSize / 2,
				this._position.y - this._frameSize / 2,
			],
			size: this._frameSize,
			strokeColor: "blue",
			opacity: 0.25,
			visible: DEBUG_MODE,
		});

		// ------------------------------------------------------

		const len = this.frame.curves.length;

		for (let i = 0; i < len; i++) {
			const c = this.frame.curves[i * 2];
			c.divideAtTime(0.5);
		}

		// ------------------------------------------------------

		this._polygon = new Path({
			segments: [
				this.frame.segments[vertices[0]].point,
				this.frame.segments[vertices[1]].point,
			],
			strokeColor: "green",
			strokeWidth: 1,
			visible: DEBUG_MODE,
		});

		this.group = new Group([this.tile, this.frame, this._polygon]);

		if (DEBUG_MODE) {
			const dot = new Path.Circle({
				center: this.frame.firstSegment.point,
				radius: 2,
				fillColor: "red",
			});
			this.group.addChild(dot);
			// this.frame.fullySelected = true;
		}

		this.group.pivot = this._polygon.firstSegment.point;
		this.group.position = this._position;

		if (angle !== undefined) {
			this.rotate(this._angle);
		}
	}

	get path() {
		return this._polygon;
	}

	public addSegment(idx: number, at?: number) {
		let pt;

		if (at !== undefined && at !== null) {
			if (at === 0) {
				pt = this.frame.bounds.center;
			} else {
				const curve = this.frame.curves[idx];
				pt = curve.getPointAt(curve.length * at);
			}
		} else {
			pt = new Point(this.frame.segments[idx].point);
		}

		this._polygon.add(pt);

		// this._angle = this._polygon.lastSegment.location.tangent.angle;
		this._angle = this._polygon.lastSegment.point.isClose(
			this.frame.segments[4].point,
			1,
		)
			? this.frame.segments[3].location.tangent.angle
			: this.frame.segments[3].location.tangent.angle - 180;
	}

	public entry() {
		return this._polygon.firstSegment.point;
	}

	public exit() {
		return this._polygon.lastSegment.point;
	}

	public position() {
		return this._position;
	}

	set angle(value: number) {
		this._angle = value;
	}

	get angle() {
		return this._angle;
	}

	public rotate(angle: number) {
		this.group.rotation = angle + 90;
	}
}

export default OrtoTile2x2;
