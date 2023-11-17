import { GlyphType, Glyph, Rule, Instruction, Parameter, Marker, IModel, IAlphabet } from '../lsys';

import Production from './production';



class ProductionExample extends Production {

	
	constructor( head: Glyph, alphabet: IAlphabet ) {

		const glyphs: Glyph[] = alphabet.compose( '-LR+RL' );

		super( head, glyphs );
	};


	process( params: Array<number>) {

		const _sequence: Array<Glyph> = this.rule.map( ( g: Glyph ) => { 

			if ( g.type === 'Rule' ) {

				return { ...g };

			} else {

				return { ...g };
			}

		});

		for ( let i = 0; i<_sequence.length; i++ ) {

			const g: Glyph = _sequence[i];

			if ( g.type === 'Rule' ) {

				if ( g.symbol === 'L' ) {

					g.params = [ ...params ];
				}

				if ( g.symbol === 'R' ) {

					g.params = [ ...params ];
				}
			}
		}

		this.rewrite( _sequence );

	};

}


export default ProductionExample;