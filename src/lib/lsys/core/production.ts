import { GlyphType, Glyph, Rule, Instruction, Parameter, Marker, IModel } from '../lsys';


abstract class Production {

	protected _head: Glyph;
	protected rule: Glyph[];
	protected phrase: string;


	constructor( head: Glyph, rule: Glyph[] ) {

		this._head = head;
		this.rule = rule;

		this.phrase = this.serialize( rule );
	};


	get head() {

		return this._head;
	}


	serialize( sequence: Array<Glyph> ): string {

		const _str = sequence.map( (g:Glyph) => {

			if ( g.type !== 'Parameter' ) {

				return g.symbol;
			}

		}).join('');

		return _str;
	};


	// requiresParameter(): boolean {

	// 	if (this.head.type === 'Rule') {

	// 		return this.head.params.length > 0 ? true : false;

	// 	} else { return false }
	// };

	abstract process( params: Array<number> ): void;


	read( params?: Array<number>, context?: any ): boolean {

		if ( params ) {

			let paramIndex = 0;

			this.process( params );

			return true;

		} else {

			return false;
		}
	};


	rewrite( sequence: Array<any>,  context?: any ): string {

		const _output = this.serialize( sequence );

		// TODO: make one final verification to see if the output was well formed?

		this.phrase = _output;

		return this.phrase;
	};


	output( context?: any ): string {

		return this.phrase;
	}
}

export default Production;


