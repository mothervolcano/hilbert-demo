import { Dispatch, useReducer, useState } from "react";

import { IAlphabet, ICommand, IComposer, IModel } from "../lib/lsys/lsys";

import { Model, Param, ParamSet } from "../fass";

import Alphabet from "../lib/lsys/core/alphabet";

import Hilbert from "../fass-modules/models/hilbert";
import Anton from "../fass-modules/models/anton";
import Donna from "../fass-modules/models/donna";
import Egon from "../fass-modules/models/egon";
import Morton from "../fass-modules/models/morton";
import Lukas from "../fass-modules/models/lukas";
import Schenck from "../fass-modules/models/schenck";

import DefaultConsole from "../components/consoles/defaultConsole";

const defaultParamScheme: ParamSet = [
  {
    id: "mkp5",
    name: "scaleCtrl",
    value: 1,
    range: [0, 2],
    step: 0.01,
    label: "scale",
  },
  {
    id: "mkp3",
    name: "interspaceCtrl",
    value: 1,
    range: [0, 1],
    step: 0.01,
    label: "interspace",
  },
  {
    id: "mkp4",
    name: "p3Ctrl",
    value: 0,
    range: [0, 1],
    step: 0.01,
    label: "P3",
  },
  {
    id: "mkp6",
    name: "p4Ctrl",
    value: 1,
    range: [0, 1],
    step: 0.01,
    label: "P4",
  },
  {
    id: "mkp7",
    name: "empty",
    value: 1,
    range: [0, 2],
    step: 0.01,
    label: "P7",
  },
];

const models: Model[] = [
  {
    option: "HILBERT",
    label: "The Hilbert Curve",
    icon: null,
    model: Hilbert,
    console: DefaultConsole,
    params: defaultParamScheme,
    default: true,
    checked: false,
  },
  {
    option: "EGON",
    label: "Egon Hilbert Curve",
    icon: null,
    model: Egon,
    console: DefaultConsole,
    params: defaultParamScheme,
    default: false,
    checked: false,
  },
  {
    option: "DONNA",
    label: "Donna Hilbert Curve",
    icon: null,
    model: Donna,
    console: DefaultConsole,
    params: defaultParamScheme,
    default: false,
    checked: false,
  },
  {
    option: "MORTON",
    label: "Morton Hilbert Curve",
    icon: null,
    model: Morton,
    console: DefaultConsole,
    params: defaultParamScheme,
    default: false,
    checked: false,
  },
  {
    option: "LUKAS",
    label: "Lukas Hilbert Curve",
    icon: null,
    model: Lukas,
    console: DefaultConsole,
    params: defaultParamScheme,
    default: false,
    checked: false,
  },
  {
    option: "SCHENCK",
    label: "Schenck Hilbert Curve",
    icon: null,
    model: Schenck,
    console: DefaultConsole,
    params: defaultParamScheme,
    default: false,
    checked: false,
  },
  {
    option: "ANTON",
    label: "Anton Hilbert Curve",
    icon: null,
    model: Schenck,
    console: DefaultConsole,
    params: defaultParamScheme,
    default: false,
    checked: false,
  },
];

const alphabet = new Alphabet();

alphabet.register("Rule", "L");
alphabet.register("Rule", "R");
alphabet.register("Rule", "F");
alphabet.register("Instruction", "+");
alphabet.register("Instruction", "-");

const modelReducer = (state: any, action: any) => {
  let selectedModel;

  switch (action.type) {
    case "HILBERT":
      selectedModel =
        models.find((model: Model) => model.option === "HILBERT") || models[0];
      break;
    case "DONNA":
      selectedModel =
        models.find((model: Model) => model.option === "DONNA") || models[0];
      break;
    case "EGON":
      selectedModel =
        models.find((model: Model) => model.option === "EGON") || models[0];
      break;
    case "MORTON":
      selectedModel =
        models.find((model: Model) => model.option === "MORTON") || models[0];
      break;
    case "LUKAS":
      selectedModel =
        models.find((model: Model) => model.option === "LUKAS") || models[0];
      break;
    case "SCHENCK":
      selectedModel =
        models.find((model: Model) => model.option === "SCHENCK") || models[0];
      break;
    case "ANTON":
      selectedModel =
        models.find((model: Model) => model.option === "ANTON") || models[0];
      break;
    default:
      throw new Error(`ERROR: ${action.type} is not a valid model`);
  }

  return {
    ...selectedModel,
    model: new selectedModel.model(alphabet, "L"),
  };
};

function useModel(): [Model[], Model, Dispatch<any>] {
  const defaultModel =
    models.find((model: Model) => model.default === true) || models[0];
  const model = {
    ...defaultModel,
    model: new defaultModel.model(alphabet, "L"),
  };

  const [currentModel, setCurrentModel] = useReducer(modelReducer, model);

  return [models, currentModel, setCurrentModel];
}

export default useModel;
