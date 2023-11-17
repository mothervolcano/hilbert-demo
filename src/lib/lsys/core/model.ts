
import { Glyph, Rule, Parameter, IProduction, ICommand, IAlphabet } from '../lsys';

import Alphabet from './alphabet';
import Production from './production';


class Model {


	private _alphabet: IAlphabet;
	private _axiom: string;

	protected productions: Map<string, IProduction>;
	protected commands: Map<string, ICommand>;


	constructor( alphabet: IAlphabet, axiom: string ) {

		this._alphabet = alphabet;
		this._axiom = axiom;

		this.productions = new Map();
		this.commands = new Map();

	};

	get alphabet() {

		return this._alphabet;
	};

	get axiom() {

		return this._axiom;
	};


	protected addCommand( command: ICommand ) {

		if ( !this.commands.has( command.symbol ) ) {

			this.commands.set( command.symbol, command );
		}
	};
	

	public hasCommand( char: string ) {

		return this.commands.has( char );
	}


	public getCommand( char: string, context?: any ) {

		if ( this.commands.has( char ) ) {

			return this.commands.get( char )!;
		}
	}


	protected addProduction( production: IProduction ) {

		if ( production.head.type === 'Rule' && !this.productions.has( production.head.symbol ) ) {

			this.productions.set( production.head.symbol, production );
		}

	};


	public getProduction( char: string, context?: any ): IProduction | undefined {

		if ( this.productions.has( char ) ) {

			return this.productions.get( char )!;
		}
	};


	public interpret( symbol: string ) {


	};


	public executeCommand() {


	};

};

export default Model;