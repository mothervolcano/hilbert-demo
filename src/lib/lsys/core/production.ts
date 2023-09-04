import { IProduction, GlyphType, Glyph, Rule, Instruction, Marker, IModel } from '../lsys';


abstract class Production implements IProduction {

	protected _glyph: Glyph;
	protected rule: Glyph[];
	protected _output: string;


	constructor( glyph: Glyph, rule: Glyph[] ) {

		this._glyph = glyph;
		this.rule = rule;

		this._output = this.encode( rule );
	};


	get glyph() {

		return this._glyph;
	}

	get output() {

		return this._output;
	}


	encode( sequence: Array<Glyph> ): string {

		const _str = sequence.map( (g:Glyph) => {

			return g.symbol;

		}).join('');

		return _str;
	};


	abstract process( params: Array<number> ): void;


	write( params?: Array<number>, context?: any ): boolean {

		if ( params ) {

			let paramIndex = 0;

			this.process( params );

			return true;

		} else {

			return false;
		}
	};


	read( context?: any ): string {

		return this._output;
	};

}

export default Production;


