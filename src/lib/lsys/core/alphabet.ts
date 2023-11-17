
import { GlyphType, Glyph, Rule, Instruction, Parameter, Marker, IModel } from '../lsys';


class Alphabet {

	private dictionary: Map<string, Glyph>;

	constructor() {

		this.dictionary = new Map();
	};


	private validateRetrieval( symbol: string ): string {

		if ( !this.dictionary.has(symbol) ) {

			throw new Error(`${symbol} not found in alphabet`);

		} else {

			return symbol;
		}
	};


	private validateEntry( symbol: string ): string {

		if ( this.dictionary.has(symbol) ) {

			throw new Error(`${symbol} already registered in alphabet`);

		} else {

			return symbol;
		}
	};


	public register( type: GlyphType, symbol_: string ) { // symbol_ can be a single character eg. 'A' or a series of characters to be split into separate entries 'A+FB'

		
		let glyph: Glyph;

		for ( const char of symbol_ ) {

			const symbol: string = char;

			switch( type ) {

				case 'Rule' :

					glyph = { type: type, symbol: symbol, params: [] };

					break;

				case 'Instruction':

					glyph = { type: type, symbol: symbol };

					break;

				case 'Marker':

					glyph = { type: type, symbol: symbol };

					break;

				default : throw new Error(`${type} is an invalide Glyph Type`);

			}

			this.dictionary.set( symbol, glyph );

		}
	};


	public registerRules( symbol_: string ) {

		for ( const char of symbol_ ) {

			const _marker: Rule = { type: 'Rule', symbol: char, params: [] };

			this.dictionary.set( this.validateEntry(char), _marker );
		}
	};


	public registerInstructions( symbol_: string ) {

		for ( const char of symbol_ ) {

			const _marker: Instruction = { type: 'Instruction', symbol: char };

			this.dictionary.set( this.validateEntry(char), _marker );
		}
	};


	public registerMarkers( symbol_: string ) {

		for ( const char of symbol_ ) {

			const _marker: Marker = { type: 'Marker', symbol: char };

			this.dictionary.set( this.validateEntry(char), _marker );
		}
	};


	public glyph( str: string ): Glyph {

		if ( str.length === 1 ) {

			const _glyph = this.dictionary.get( this.validateRetrieval(str.charAt(0)) )!;

			return _glyph;

		} else if ( str.length > 1) {

			throw new Error(`Invalid input ${str}. If you meant to retrieve a series of Glyphs use composePhrase instead`);

		} else {

			throw new Error(`Invalid input ${str}`);
		}
	};


	public rule( str: string ): Rule {

		if ( str.length === 1 ) {

			const _glyph = this.dictionary.get( this.validateRetrieval(str.charAt(0)) )!;

			if ( _glyph.type === 'Rule' ) {

				return _glyph;

			} else {

				throw new Error(`Requested symbol ${str} is not a Glyph Rule`);
			}

		} else if ( str.length > 1) {

			throw new Error(`Invalid input ${str}. If you meant to retrieve a series of Glyphs use composePhrase instead`);

		} else {

			throw new Error(`Invalid input ${str}`);
		}
	};


	public compose( str: string ): Glyph[] {

		if ( str.length > 1 ) {

			const sequence: Glyph[] = [];

			for ( const char of str ) {

				const _glyph = this.dictionary.get( this.validateRetrieval(char) )!;

				sequence.push( _glyph );
			}

			if ( sequence.length > 0 ) { return sequence }
			else { throw new Error(`Failed to retrieve entry(ies) for ${str}`) };

		} else if ( str.length === 1 ) {

			throw new Error(`Invalid input ${str}. If you mean to retrieve a single Glyph use retrieveGlyph instead`);

		} else {

			throw new Error(`Invalid input ${str}`);
		}
	}

}


export default Alphabet;

