import { Layer } from 'paper';
import { paperScope } from './components/paperStage';


let view: any
let layer: any
let origin: any



export function reset() {

  paperScope.project.clear();

  view = paperScope.project.view
  layer = new Layer();

  // TODO: check if there's anything that needs to be cleared in both the model and sequencer
}


// Note: initializes the requested model and creates a state and or context that is used by the other methods: generate, regenerate and redraw;

export function init(
  
  selectedModel: string

) {
  
  origin = view.center;

  switch( selectedModel ) {

    case 'PEANO': 

      break;

    case 'HILBERT':
      
      break;

  }
};


// Note: generates a model based on a different implementation that requires specific modules, parameters and configuration

export function generate(

  params: any

) {

  const { iterationsNum } = params;

  console.log(`GENERATING HILBERT CURVE`);

  origin = view.center;

};


// Note: modifies the model based on user or external input;

export function draw(

    scaleCtrl: number,
    params: any

  ) {

    const { } = params;

}


// Note: regenerates the model that is currently selected with different initial parameters or configuration and updates the stage.

export function regenerate(

    params: any

  ) {

      const { iterationsNum } = params;

      console.log(`REGENERATING FASS CURVE... (to be implemented) }`);


}




