import { Glyph, Rule } from "../lsys";
import Production from "./production";




class ProductionRule extends Production {

	constructor( head: Rule, sequence?: Glyph[] ) {

		super( head, sequence || [ head ] );
	}

	process() {

	}

}

export default ProductionRule;