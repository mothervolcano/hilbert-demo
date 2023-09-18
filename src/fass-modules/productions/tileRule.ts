import { Glyph, Rule } from "../../lib/lsys/lsys";
import Production from "../../lib/lsys/core/production";



class TileRule extends Production {

	constructor( glyph: Rule, dialect?: Glyph[] ) {

		super( glyph, dialect );

	}


	compose( str: string ) {

		this._rule = this.decode( str );
		this._output = this.encode( this._rule );

		return this;
	}

	process() {


	}

}

export default TileRule;