
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

	
	constructor( alphabet: IAlphabet, axiom: string ) {

		super( alphabet, axiom );

		const L: IProduction = new tileRule( alphabet.rule('L'), alphabet.sequence('+RF-LFL-FR+') ); 
		const R: IProduction = new tileRule( alphabet.rule('R'), alphabet.sequence('-LF+RFR+FL-') ); 
		const F: IProduction = new tileRule( alphabet.rule('F') ); 

		this.addProduction( L );
		this.addProduction( R );
		this.addProduction( F );

		// -------------------------------------------------

		this.scale = 1;
		this.distance = 5*this.scale;

		this.lengthCtrl1 = 1;
		this.lengthCtrl2 = 1;

		this.angle = -90;
		this.angleStep = 90;


		this.style = {

			strokeColor: 'black',
			strokeWidth: 2
		}

		// ----------------------------------------------------

		const moveForward = ( tool: any, context?: any ) => {

			tool.forward( this.distance * this.lengthCtrl1 );
		};


		const tileLeft= ( tool: any, context?: any ) => {

			this.currentTile = new OrtoTile( [3, 0], tool.position(), this.distance, this.distance * this.lengthCtrl2, tool.angle(), this.style ); 
			this.currentTile.addSegment(1); 
			this.currentTile.addSegment(2);

			this.angle = this.currentTile.angle() - this.angleStep;

			tool.up(); 
			tool.goto( this.currentTile.exit().x, this.currentTile.exit().y ); 
			tool.rotate( this.angle );
			tool.down();

		};


		const tileRight = ( tool: any, context?: any ) => {


			this.currentTile = new OrtoTile( [0, 3], tool.position(), this.distance, this.distance * this.lengthCtrl2, tool.angle(), this.style );
			this.currentTile.addSegment(2);
			this.currentTile.addSegment(1);

			this.angle = this.currentTile.angle() + this.angleStep;

			tool.up(); 
			tool.goto( this.currentTile.exit().x, this.currentTile.exit().y ); 
			tool.rotate( this.angle );
			tool.down();

		};


		const turnLeft = ( tool: any, context?: any ) => {

			tool.left( this.angleStep )
		};


		const turnRight = ( tool: any, context?: any ) => {

			tool.right( this.angleStep )
		};


		this.addCommand( new Command( 'F', moveForward ) );
		this.addCommand( new Command( 'L', tileLeft ) );
		this.addCommand( new Command( 'R', tileRight ) );
		this.addCommand( new Command( '+', turnLeft ) );
		this.addCommand( new Command( '-', turnRight ) );


	};	
}


export default testModel;

