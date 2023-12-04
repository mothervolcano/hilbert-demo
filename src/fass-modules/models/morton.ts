import { IAlphabet, IProduction } from "../../lib/lsys/lsys";
import Command from "../../lib/lsys/core/command";
import Model from "../../lib/lsys/core/model";
import ProductionRule from "../../lib/lsys/core/productionRule";

import OrtoTile from "../tiles/ortoTile";

const HILBERT_L = "+RF-LFL-FR+";
const HILBERT_R = "-LF+RFR+FL-";

class Morton extends Model {
	private currentTile: any;

	private distance: number;
	private angle: number;
	private angleStep: number;

	private lengthCtrl1: number;
	private lengthCtrl2: number;

	private style: any;

	constructor(alphabet: IAlphabet, axiom: string) {
		super(alphabet, axiom);

		// const L: IProduction = new ProductionRule( alphabet.rule('L') );
		// const R: IProduction = new ProductionRule( alphabet.rule('R') );

		const L: IProduction = new ProductionRule(
			alphabet.rule("L"),
			alphabet.compose(HILBERT_L),
		);
		const R: IProduction = new ProductionRule(
			alphabet.rule("R"),
			alphabet.compose(HILBERT_R),
		);
		const F: IProduction = new ProductionRule(alphabet.rule("F"));

		this.addProduction(L);
		this.addProduction(R);
		this.addProduction(F);

		// -------------------------------------------------

		this.distance = 10;

		this.lengthCtrl1 = 1;
		this.lengthCtrl2 = 1;

		this.angle = -90;
		this.angleStep = 90;

		this.style = {
			strokeColor: "black",
			strokeWidth: 0,
		};

		// ----------------------------------------------------

		const moveForward = (tool: any, context?: any) => {
			tool.forward(
				this.distance *
					(context.interspace*0.70) *
					context.scale,
			);
			context.path.addSegments(tool.path().segments);
		};

		const tileLeft = (tool: any, context?: any) => {
			this.currentTile = new OrtoTile(
				[3, 0],
				tool.position(),
				this.distance,
				this.distance * (1-context.interspace*0.70) * context.scale,
				tool.angle(),
			);
			this.currentTile.addSegment(0, 0.25);
			this.currentTile.addSegment(2, 0.75);
			this.currentTile.addSegment(2, 0.25);
			this.currentTile.addSegment(0, 0.75);
			this.currentTile.addSegment(1);
			this.currentTile.addSegment(2);

			this.angle = this.currentTile.angle - this.angleStep;

			tool.up();
			tool.goto(this.currentTile.exit().x, this.currentTile.exit().y);
			tool.rotate(this.angle);
			tool.down();

			context.path.addSegments(this.currentTile.path.segments);
		};

		const tileRight = (tool: any, context?: any) => {
			this.currentTile = new OrtoTile(
				[0, 3],
				tool.position(),
				this.distance,
				this.distance * (1-context.interspace*0.70) * context.scale,
				tool.angle(),
			);
			this.currentTile.addSegment(2, 0.75);
			this.currentTile.addSegment(0, 0.25);
			this.currentTile.addSegment(0, 0.75);
			this.currentTile.addSegment(2, 0.25);
			this.currentTile.addSegment(2);
			this.currentTile.addSegment(1);

			this.angle = this.currentTile.angle + this.angleStep;

			tool.up();
			tool.goto(this.currentTile.exit().x, this.currentTile.exit().y);
			tool.rotate(this.angle);
			tool.down();

			context.path.addSegments(this.currentTile.path.segments);
		};

		const turnLeft = (tool: any, context?: any) => {
			tool.left(this.angleStep);
		};

		const turnRight = (tool: any, context?: any) => {
			tool.right(this.angleStep);
		};

		this.addCommand(new Command("F", moveForward));
		this.addCommand(new Command("L", tileLeft));
		this.addCommand(new Command("R", tileRight));
		this.addCommand(new Command("+", turnLeft));
		this.addCommand(new Command("-", turnRight));
	}

	public reset() {
		this.distance = 10;

		this.lengthCtrl1 = 1;
		this.lengthCtrl2 = 1;

		this.angle = -90;
		this.angleStep = 90;

		if (this.currentTile) {
			this.currentTile.rotate(0);
			this.currentTile.angle = this.angle;
		}
	}
}

export default Morton;
