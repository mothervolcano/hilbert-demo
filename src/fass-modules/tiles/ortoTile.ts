import { Point, Path, Group } from 'paper';


class OrtoTile {

	private tile: any
	private frame: any
	private _frameSize: any;
	private _polygon: any
	private _tileSize: number
	private _angle: number
	private _position: any
	private _style: any
	private group: any;

	constructor( vertices: Array<number>, position: any, tileSize: number, frameSize?: number, angle?: number, style?: any ) {

		this._position = position
		this._angle = angle || 0
		this._tileSize = tileSize
		this._frameSize = frameSize || this._tileSize;

		this._style = style || {

			strokeColor: 'black',
			strokeWidth: 1
		}


		this.tile = new Path.Rectangle({

			point: [ this._position.x - this._tileSize/2, this._position.y - this._tileSize/2 ],
			size: this._tileSize,
			strokeColor: 'blue',
			visible: false
			// opacity: 0.25
		});

		this.frame = new Path.Rectangle({

			point: [ this._position.x - this._frameSize/2, this._position.y - this._frameSize/2 ],
			size: this._frameSize,
			strokeColor: 'blue',
			visible: false
			// opacity: 0.50
		})
		
		
		this._polygon = new Path({

			segments: [ this.frame.segments[ vertices[0] ].point, this.frame.segments[ vertices[1] ].point ]

		});

		this._polygon.style = this._style;


		this.group = new Group( [ this.tile, this.frame, this._polygon] )
		
		// this.group.pivot = this._entryPoint;
		// this.group.position = this._position;

		// this._position = this._exitPoint;

		this.group.pivot = this._polygon.firstSegment.point;
		this.group.position = this._position;


		if ( angle !== undefined ) {

			this.rotate( this._angle )
		}
	}

	get path() {

		return this._polygon;
	}

	set style( input: any ) {

    	this._style = input;
  	}

	get style(): void {

	    return this._style;
	}

	public addSegment( idx: number, at?: number ) {

		let pt;

		if ( at ) {

			const curve = this.frame.curves[idx];
			pt = curve.getPointAt( curve.length * at );

		} else {

			pt = new Point(this.frame.segments[idx].point)
		}

		this._polygon.add( pt );

		this._angle = this._polygon.lastSegment.location.tangent.angle;
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


	public angle() {

		return this._angle;
	}

	public rotate( angle: number ) {

		this.group.rotation = angle + 90;
	}
}


export default OrtoTile

