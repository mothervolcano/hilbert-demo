import { useState, useEffect } from "react";

import { Model, Param, ParamSet } from "./fass";

import {
	Container,
	Flex,
	Grid,
	NumberInput,
	SegmentedControl,
	SegmentedControlItem,
	Stack,
	DEFAULT_THEME
} from "@mantine/core";

// -----------------------------------------------------------

import useModel from "./hooks/useModel";

import PaperStage from "./components/paperStage";

import {
	reset,
	initModel,
	generate,
	refresh,
	redraw,
	extractPath,
} from "./main";

// --------------------------------------------------------------
// TYPES

interface ModelOption {
	label: string;
	value: Model;
}

// --------------------------------------------------------------
// HELPERS

function parseParams(updatedParams: ParamSet) {
	const modelParams: any = {};

	Array.from(updatedParams.values()).forEach((p: any) => {
		modelParams[p.name] = p.value;
	});

	return modelParams;
}


const UI = () => {
	const [isPaperLoaded, setIsPaperLoaded] = useState<boolean>(false);
	const [initialized, setInitialized] = useState<boolean>(false);

	const [models, currentModel, setCurrentModel] = useModel();
	const [paramsForConsole, setParamsForConsole] = useState<ParamSet | null>(
		null,
	);
	const [iterations, setIterations] = useState<number>(3);

	// ----------------------------------------------------------------------------

	const modelOptions: SegmentedControlItem[] = models.map((model) => {
		return {
			label: model.option,
			value: model.option,
		};
	});

	// ----------------------------------------------------------------------------
	// HOOKS

	// .............................................................................
	// ACTION: the app is loaded

	useEffect(() => {
		if (!isPaperLoaded) {
			console.log("PAPER HASN'T LOADED");
			return () => {};
		}
		console.log("1 --> PAPERJS LOADED! CurrentModel: ", currentModel);
		setParamsForConsole(currentModel.params);
		reset();
		initModel();

		if (!initialized) {
			setInitialized(true);
		}
	}, [isPaperLoaded]);

	// .............................................................................
	// ACTION: parameters are updated in the UI

	useEffect(() => {
		if (!isPaperLoaded) {
			console.log("PAPER HASN'T LOADED");
			return () => {};
		}

		if (currentModel === null) {
			// it should check if it is initialized instead and not if there's a model
			// TODO: error message
		} else if (currentModel) {
			const params: ParamSet = parseParams(currentModel.params);

			console.log(`2 --> REDRAWING for params change: `, params);

			refresh();
			generate(currentModel.model, iterations, params);
			redraw(params);
		}
	}, [paramsForConsole]);

	// .............................................................................

	useEffect(() => {
		if (!isPaperLoaded) {
			console.log("PAPER HASN'T LOADED");
			return () => {};
		}

		console.log("2 --> REDRAWING for new selected Model");

		const params: ParamSet = parseParams(currentModel.params);
		refresh();
		generate(currentModel.model, iterations, params);
		redraw(params);
	}, [currentModel]);

	// .............................................................................

	useEffect(() => {
		if (!isPaperLoaded) {
			console.log("PAPER HASN'T LOADED");
			return () => {};
		}

		console.log(`2 --> REDRAWING for ${iterations} iterations`);

		const params: ParamSet = parseParams(currentModel.params);
		refresh();
		generate(currentModel.model, iterations, params);
		redraw(params);
	}, [iterations]);

	// ----------------------------------------------------------------------------
	// HANDLERS

	const handleIterationCtrlInput = (value: number | string) => {
		if ( value > 0 ) {
			setIterations(Number(value));
		}
	}

	const handleParamCtrlInputForModel = (updatedParams: any) => {
		setParamsForConsole(updatedParams);
	};

	const handleModelSelection = (value: string) => {
		setCurrentModel({ type: value });
		console.log(`selected: ${value}`, currentModel);
	};

	// -------------------------------------------------------------------------------------------------------
	// AUX

	const switchConsole = (model: Model) => {
		const Console = model.console;

		return (
			<Console
				params={paramsForConsole}
				inputHandler={handleParamCtrlInputForModel}
			/>
		);
	};

	const frameMargin = 6;
	const borderColor = DEFAULT_THEME.colors.dark[5];

	return (
		<div style={{position: "relative", width: "100%", height: "100vh", padding: `${frameMargin}vh`, border: "1px solid red",}}>
			<div style={{border: `1px solid ${borderColor}`}}>
				<Grid align="stretch">
					<Grid.Col span={2} >
							<Stack w={"100%"} p={15}>
								<NumberInput 
									label="iterations"
									description="..."
									allowNegative={false}
									allowDecimal={false}
									min={2}
									max={6}
									value={iterations}
									onChange={handleIterationCtrlInput}
								/>
								{initialized && currentModel && switchConsole(currentModel)}
							</Stack>
					</Grid.Col>
					<Grid.Col span={10} >
						<div
							style={{ position: "relative", height: `${100-frameMargin*2}vh`, borderLeft: `1px solid ${borderColor}`}}
						>
							<div style={{ position: "absolute", top: "15px", left: "15px" }}>
								<SegmentedControl
									value={currentModel.option}
									onChange={handleModelSelection}
									data={modelOptions}
								/>
							</div>
							<PaperStage onPaperLoad={setIsPaperLoaded} />
						</div>
					</Grid.Col>
				</Grid>
				</div>
		</div>
	);
};

export default UI;
