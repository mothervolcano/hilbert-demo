import { Layer } from 'paper';
import { paperScope } from './components/paperStage';


import { IAlphabet, ICommand, IComposer, IModel } from './lib/lsys/lsys';

import Alphabet from './lib/lsys/core/alphabet';
import Composer from './lib/lsys/core/composer';


import TestModel from './fass-modules/models/testModel';
import Turtle from './lib/lsys/tools/turtle';


let view: any
let layer: any
let origin: any

let FASS: any;
let model: IModel;
let alphabet: IAlphabet;
let composer: IComposer;
let sequence: ICommand[];
let pen: any;


export function reset() {

  paperScope.project.clear();

  view = paperScope.project.view
  layer = new Layer();

  // TODO: check if there's anything that needs to be cleared in both the model and sequencer
}


// Note: initializes the requested model and creates a state and or context that is used by the other methods: generate, regenerate and redraw;

export function initModel(
  
  selectedModel: string

) {
  
  origin = view.center;

  alphabet = new Alphabet();

  alphabet.registerGlyph( 'Rule', 'L' );
  alphabet.registerGlyph( 'Rule', 'R' );
  alphabet.registerGlyph( 'Rule', 'F' );
  alphabet.registerGlyph( 'Instruction', '+' );
  alphabet.registerGlyph( 'Instruction', '-' );

  switch( selectedModel ) {

    case 'PEANO': 

      model = new TestModel( alphabet, "L");
      break;

    case 'HILBERT':
      
      model = new TestModel( alphabet, "L");
      break;
  }

  composer = new Composer( model );

  pen = new Turtle();

  pen.style = {

    strokeColor: 'black',
    strokeWidth: 2
  }

  pen.init( origin.x, origin.y, -90 );

};


// Note: generates a model based on a different implementation that requires specific modules, parameters and configuration

export function generate(

  params: any

) {

  const { iterationsNum } = params;

  console.log(`GENERATING FASS CURVE`);

  composer.reset()

  const thread = composer.compose( iterationsNum );
  
  console.log(`----> Sequence: ${ thread }`);

  sequence = composer.plot();

};


// Note: modifies the model based on user or external input;

export function draw(

    scaleCtrl: number,
    params: any

  ) {

    const { } = params;

    for ( const command of sequence ) {

      command.run( pen );
    }


  layer.position = origin;

}


// Note: regenerates the model that is currently selected with different initial parameters or configuration and updates the stage.

export function regenerate(

    params: any

  ) {

      const { iterationsNum } = params;

      console.log(`REGENERATING FASS CURVE... (to be implemented) }`);


}




