export interface Param {
  id: string;
  name: string;
  value: number;
  range: [number, number];
  step: number;
  label: string;
}

export type ParamSet = Array<Param>;

export interface Model {
  option: string;
  label: string;
  icon: any;
  model: any;
  console: any;
  params: ParamSet;
  default: boolean;
  checked: boolean;
}