import { Point, Path, Group } from 'paper';

import { IAlphabet, ICommand, IProduction } from "../../lib/lsys/lsys";
import Command from "../../lib/lsys/core/command";
import Model from "../../lib/lsys/core/model";
import tileRule from "../productions/tileRule";

import OrtoTile from '../tiles/ortoTile';

class testModel extends Model {


	private currentTile: any;

	private scale: number;
	private distance: number;
	private angle: number;
	private angleStep: number;

	private lengthCtrl1: number;
	private lengthCtrl2: number;

	private style: any;

	
	constructor(alphabet: IAlphabet, axiom: string) {

		super(alphabet, axiom);

		// const L: IProduction = new tileRule(alphabet.rule('L'), alphabet.sequence('+RF-LFL-FR+')); 
		const L: IProduction = new tileRule(alphabet.rule('L'), alphabet.collect('+-RLF') ).compose('+RF-LFL-FR+'); 
		// const R: IProduction = new tileRule(alphabet.rule('R'), alphabet.sequence('-LF+RFR+FL-')); 
		const R: IProduction = new tileRule(alphabet.rule('R'), alphabet.collect('+-RLF')).compose('-LF+RFR+FL-'); 
		// const F: IProduction = new tileRule(alphabet.rule('F')); 

		this.addProduction(L);
		this.addProduction(R);
		// this.addProduction(F);

		// -------------------------------------------------

		this.scale = 1;
		this.distance = 5 * this.scale;

		this.lengthCtrl1 = 1;
		this.lengthCtrl2 = 1;

		this.angle = -90;
		this.angleStep = 90;


		this.style = {

			strokeColor: 'black',
			strokeWidth: 2
		}

		// ----------------------------------------------------

		const moveForward = (tool: any, context?: any) => {

			tool.forward(this.distance * this.lengthCtrl1);
		};


		const tileLeft = (tool: any, context?: any) => {

			this.currentTile = new OrtoTile([3, 0], tool.position(), this.distance, this.distance * this.lengthCtrl2, tool.angle(), this.style); 
			this.currentTile.addSegment(1); 
			this.currentTile.addSegment(2);

			this.angle = this.currentTile.angle() - this.angleStep;

			tool.up(); 
			tool.goto(this.currentTile.exit().x, this.currentTile.exit().y); 
			tool.rotate(this.angle);
			tool.down();

		};


		const tileRight = (tool: any, context?: any) => {


			this.currentTile = new OrtoTile([0, 3], tool.position(), this.distance, this.distance * this.lengthCtrl2, tool.angle(), this.style);
			this.currentTile.addSegment(2);
			this.currentTile.addSegment(1);

			this.angle = this.currentTile.angle() + this.angleStep;

			tool.up(); 
			tool.goto(this.currentTile.exit().x, this.currentTile.exit().y); 
			tool.rotate(this.angle);
			tool.down();

		};


		const turnLeft = (tool: any, context?: any) => {

			tool.left(this.angleStep)
		};


		const turnRight = (tool: any, context?: any) => {

			tool.right(this.angleStep)
		};


		this.addCommand(new Command('F', moveForward));
		this.addCommand(new Command('L', tileLeft));
		this.addCommand(new Command('R', tileRight));
		this.addCommand(new Command('+', turnLeft));
		this.addCommand(new Command('-', turnRight));


	};

	private createOrtoTile = (vertices: Array<number>, position: any, tileSize: number, frameSize?: number, angle?: number, style?: any) => {
		
		const _position = position;
		const _angle = angle || 0;
		const _tileSize = tileSize;
		const _frameSize = frameSize || _tileSize;
  
		const _style = style || {
			strokeColor: 'black',
			strokeWidth: 1
		};
  
		const tile = new Path.Rectangle({
			point: [_position.x - _tileSize / 2, _position.y - _tileSize / 2],
			size: _tileSize,
			strokeColor: 'blue',
			visible: false
		});
  
		const frame = new Path.Rectangle({
			point: [_position.x - _frameSize / 2, _position.y - _frameSize / 2],
			size: _frameSize,
			strokeColor: 'blue',
			visible: false
		});
  
		const polygon = new Path({
			segments: [frame.segments[vertices[0]].point, frame.segments[vertices[1]].point]
		});
  
		polygon.style = _style;
  
		const group = new Group([tile, frame, polygon]);
  
		group.pivot = polygon.firstSegment.point;
		group.position = _position;
  
		if (angle !== undefined) {
			group.rotation = _angle + 90;
		}

		return {
			path: polygon,
			addSegment: (idx: number, at?: number) => {
				let pt;
				if (at) {
					const curve = frame.curves[idx];
					pt = curve.getPointAt(curve.length * at);
				} else {
					pt = new Point(frame.segments[idx].point);
				}
				polygon.add(pt);
			},
			entry: () => polygon.firstSegment.point,
			exit: () => polygon.lastSegment.point,
			position: () => _position,
			angle: () => _angle,
			rotate: (newAngle: number) => {
				group.rotation = newAngle + 90;
			}
		};
	};

}


export default testModel;

