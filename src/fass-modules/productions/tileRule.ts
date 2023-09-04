import { Glyph, Rule } from "../../lib/lsys/lsys";
import Production from "../../lib/lsys/core/production";



class TileRule extends Production {

	constructor( head: Rule, sequence?: Glyph[] ) {

		super( head, sequence || [ head ] );
	}

	process() {

	}

}

export default TileRule;