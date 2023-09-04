
import { IModel, ICommand, IComposer } from '../lsys';

import { getParameterString, parseParameters } from '../tools/parserAssistant';




class Composer implements IComposer {

	private thread: string;
	private strip: string;
	private window: number;
	private currentIndex: number;

	constructor(private model: IModel) {

		this.thread = "";
		this.strip = "";
		this.window = 10;
		this.currentIndex = 0;

	};


	private shift(start: number | null = null, length: number | null = null) {

		const _start = start !== null ? start : this.currentIndex;
		const _length = length !== null ? length : this.window;

		const end = Math.min(_start + _length, this.thread.length);

		this.strip = this.thread.substring(_start, end);
	};


	private append(str: string) {

		this.thread += str;
	};


	public compose( iterations: number, context?: any ): string {

		
		this.append( this.model.axiom );


		for (let i = 0; i < iterations; i++) {

			let _thread = "";

			this.currentIndex = 0;

			while (this.currentIndex < this.thread.length) {

				this.shift();

				const currChar = this.thread.charAt(this.currentIndex);

				const glyph = this.model.alphabet.glyph(currChar);

				// ...............................................................
				// REWRITING REQUIRED

				if ( glyph.type === 'Rule' ) {

					const production = this.model.getProduction(currChar);

					if ( production !== undefined ) {

						const paramString = getParameterString(this.strip);

						if (paramString === 'incomplete') {

							// TODO: handle this case

						} else if (paramString !== null) {

							const params = parseParameters(paramString);

							if (!production.write(params)) {

								// TODO: handle the case when the production fails to process the parameters.
							}

						} else {

							// TODO: handle this case
						}

						_thread += production.read();
						
					} else {

						throw new Error(`Model has no Production defined for Rule ${glyph.symbol}`);
					}

				// .............................................................
				// REWRITING NOT REQUIRED
		
				} else {

					_thread += currChar;
				}

				this.currentIndex++;

				if (this.currentIndex >= this.thread.length) {

					// TODO: think what to do here

					break;
				}

			}

			this.thread = _thread;


			// console.log(`---> ${ _thread }`)
			// console.log(`.............................`)

		}

		return this.thread;
	}


	public plot() {

		const sequence: ICommand[] = [];

		for (let i = 0; i < this.thread.length; i++) {

			const currChar = this.thread.charAt(i);
			const glyph = this.model.alphabet.glyph(currChar);

			switch( glyph.type ) {

				case 'Rule':

					if ( this.model.hasCommand( glyph.symbol ) ) {

						sequence.push( this.model.getCommand( glyph.symbol )! );
					}

					break;

				case 'Instruction':

					if ( this.model.hasCommand( glyph.symbol ) ) {

						sequence.push( this.model.getCommand( glyph.symbol )! );
					}

					break;

				case 'Marker':

					// ignore

					break;

				default : throw new Error(`Failed to execute. Probably invalid Glyph ${ currChar }`)
			}
		}

		return sequence;
	}

	public reset() {

		this.thread = '';
		this.currentIndex = 0;
	}
}


export default Composer;

