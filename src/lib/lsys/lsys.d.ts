export type GlyphType = 'Rule' | 'Instruction' | 'Parameter' | 'Marker';


export interface Rule {

  type: 'Rule';
  symbol: string;
  params: number[];

}

export interface Instruction {
  
  type: 'Instruction';
  symbol: string;
}


export interface Parameter {
  
  type: 'Parameter';
  value: number;
}


export interface Marker {
  
  type: 'Marker';
  symbol: string;
}


export type Glyph = Rule | Instruction | Parameter | Marker;


export interface IAlphabet {

  register( type: GlyphType, symbol_: string ): void;
  registerRules( symbol_: string ): void;
  registerInstructions( symbol_: string ): void;
  registerMarkers( symbol_: string ): void;
  glyph( str: string ): Glyph;
  rule( str: string ): Rule;
  compose( str: string ): Glyph[];

}


export interface IProduction {

  readonly head: Glyph;
  read( params?: Array<number>, context?: any ): boolean;
  process( params: Array<number>, context?: any ): void;
  rewrite( context?: any ): string;
  output( context?: any ): string;
}

export interface ICommand {

  readonly symbol: string;
  run( tool: any, context?: any ): void;

}

// export type IProduction = ( params: number[], context?: any ) => string;
// export type ICommand = ( context?: any ) => void;


export interface IModel {

  readonly alphabet: IAlphabet;
  readonly axiom: string;
  getProduction( char: string, context?: any ): IProduction | undefined;
  hasCommand( char: string ): boolean;
  getCommand( char: string, context?: any ): ICommand | undefined;
  reset(): void

}

export interface IComposer {

  compose( model: IModel, iterations: number, context?: any ): string;
  generateSequence( model: IModel ): Array<ICommand>;
  reset(): void;

}






