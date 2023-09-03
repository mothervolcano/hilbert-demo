

interface Param {
			
	id: string;
	name: string;
	value: number;
	range: [number,number];
	step: number;
	label: string;
}

type ParamSet = Array<Param>;

interface Model {

	option: string;
	icon: any;
	label: string;
	console: any;
	params: Param[];
	default: boolean;
	checked: boolean;
}

export {

	Param,
	ParamSet,
	Model
}
