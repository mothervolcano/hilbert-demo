import { Layer, Group, Path, Color } from "paper";

import { ICommand, IComposer, IModel } from "./lib/lsys/lsys";

import Composer from "./lib/lsys/core/composer";
import Turtle from "./lib/lsys/tools/turtle";

// const paperScope = new PaperScope();

let view: any;
let maskLayer: any;
let fassLayer: any;
let layer: any;
let origin: any;

let pathMask: any;

let composer: IComposer;
let sequence: ICommand[];
let pen: any;
let fassPath: any;
let scaleFactor: number;

const DEBUG_MODE = false;

// ----------------------------------------------------------------------------------------
// AUX

function clipPath(path: any, mask: any) {
  const group = new Group([mask, path]);
  group.clipped = true;
}

function calculateOrigin(width: number, height: number) {
  const viewRatio = width/height;

  if (viewRatio <= 1 ) {
    return { x: width/2, y: height - height*0.48};
  }
  
  return { x: width/2, y: height/2};
}


// ----------------------------------------------------------------------------------------
//


export function resize( { width, height}: {width:number; height:number}) {
  if (view) {
    view.viewSize = [width, height];
    origin = calculateOrigin(width, height);
  }
}

export function reset(paperScope: paper.PaperScope) {
  paperScope.project.clear();
}


export function refresh() {
  // paperScope.project.clear();

  if (layer) {
    layer.removeChildren();
    fassLayer.removeChildren();
  }

  // view = paperScope.project.view;
  // layer = new Layer();

  // TODO: check if there's anything that needs to be cleared in both the model and sequencer
}

// ----------------------------------------------------------------------------------------
// Note: initializes the requested model and creates a state and or context that is used by the other methods: generate, regenerate and redraw;

export function initModel(paperScope: paper.PaperScope, clipPathData?: string) {
  // ....
  view = paperScope.view;

  origin = calculateOrigin(view.size.width, view.size.height);

  maskLayer = new Layer();
  fassLayer = new Layer();
  layer = new Layer();

  composer = new Composer();

  pen = new Turtle();

  /* DEBUG */

  if (DEBUG_MODE) {
    pen.style = {
      strokeColor: "red",
      strokeWidth: 1,
    };
  }

  pen.init(origin.x, origin.y, -90);

  // ----------------------------------

  // pathMask = new Path( clipPathData );

  pathMask = new Path.Circle({
    radius: 100,
  });

  pathMask.strokeColor = new Color("red");
  pathMask.strokeWidth = 0;

  pathMask.position = view.center;

  pathMask.fitBounds(view.bounds);
  pathMask.scale(0.75);

  maskLayer.addChild(pathMask);

  // scaleFactor = pathMask.bounds.width / clipPathBounds.width;
  scaleFactor = 1;
}

// ----------------------------------------------------------------------------------------
// Note: generates a model based on a different implementation that requires specific modules, parameters and configuration

export function generate(model: IModel, iterations: number, params: any) {
  const {} = params;

  pen.reset();
  pen.init(origin.x, origin.y, -90);
  composer.reset();
  model.reset();

  composer.compose(model, iterations);

  sequence = composer.generateSequence(model);
}

// ----------------------------------------------------------------------------------------
// Note: modifies the model based on user or external input;

export function redraw(params: any) {
  const { interspaceCtrl, p3Ctrl, p4Ctrl } = params;

  fassPath = new Path({
    strokeColor: "black",
    strokeWidth: 1 + 5 * p3Ctrl,
    visible: !DEBUG_MODE,
    // closed: true,
    // fillColor: 'turquoise'
  });

  fassLayer.addChild(fassPath);

  const context = {
    path: fassPath,
    scale: scaleFactor,
    interspace: interspaceCtrl * 0.75,
    p3: p3Ctrl,
    p4: p4Ctrl,
  };

  for (const command of sequence) {
    command.run(pen, context);
  }

  // clipPath(fassPath, pathMask);

  fassPath.scale(view.size.height/fassPath.bounds.height*0.60)

  const stageCenter = calculateOrigin(view.size.width, view.size.height);

  maskLayer.position = stageCenter;
  fassLayer.position = stageCenter;
  layer.position = stageCenter;
}

// ----------------------------------------------------------------------------------------
//

export function retrace(tPos: number) {
  // ...
  layer.removeChildren();

  if (tPos && tPos > 0) {
    let tracingPath;
    let pin;

    if (tPos < 1) {
      const offset = fassPath.length * tPos;
      const pos = fassPath.getPointAt(offset);

      tracingPath = fassPath.clone();
      const discardPath = tracingPath.splitAt(offset);

      discardPath.remove();

      pin = new Path.Circle({
        center: pos,
        radius: 3,
        fillColor: "red",
      });
    } else if (tPos >= 1) {
      tracingPath = fassPath.clone();
    }

    tracingPath.strokeColor = "red";

    layer.addChild(tracingPath);
    layer.addChild(pin);
  }
}

export function extractPath() {
  const exportPath = fassPath.clone();
  exportPath.scale(1 / scaleFactor);
  exportPath.strokeWidth = null;

  return exportPath;
}
