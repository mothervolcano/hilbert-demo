
import { IModel, Glyph, Rule, IProduction, ICommand, IAlphabet } from '../lsys';

abstract class Model implements IModel {


	private _alphabet: IAlphabet;
	private _axiom: string;

	protected productions: Map<string, IProduction>;
	protected commands: Map<string, ICommand>;

	constructor( alphabet: IAlphabet, axiom: string ) {

		this._alphabet = alphabet;
		this._axiom = axiom;

		this.productions = new Map();
		this.commands = new Map();

	}

	get alphabet() {

		return this._alphabet;
	}

	get axiom() {

		return this._axiom;
	}


	protected addCommand( command: ICommand ) {

		if ( !this.commands.has( command.symbol ) ) {

			this.commands.set( command.symbol, command );
		}
	}
	

	public hasCommand( symbol: string ) {

		if ( this.commands.has( symbol )  ) {

			return true;

		} else {

			return false;
		}

	}


	public getCommand( symbol: string, context?: any ) {

		if ( this.commands.has( symbol ) ) {

			return this.commands.get( symbol )!;
		}
	}


	protected addProduction( production: IProduction ) {

		if ( production.glyph.type === 'Rule' && !this.productions.has( production.glyph.symbol ) ) {

			this.productions.set( production.glyph.symbol, production );
		}

	}


	public hasProduction( symbol: string ) {

		if ( this.productions.has( symbol ) ) {

			return true;

		} else {
			
			return false;
		}
	}


	public getProduction( symbol: string, context?: any ): IProduction | undefined {

		if ( this.productions.has( symbol ) ) {

			return this.productions.get( symbol )!;
		}
	}

}

export default Model;


