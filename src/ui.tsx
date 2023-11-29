import modelSelectorStyles from "./styles/modelSelector.module.css";
import sliderStyles from "./styles/slider.module.css";

import { useState, useEffect } from "react";

import { Model, Param, ParamSet } from "./types";

import {
	Container,
	Grid,
	NumberInput,
	SegmentedControl,
	SegmentedControlItem,
	Stack,
	Title,
	Text,
	DEFAULT_THEME,
	Space,
	Slider,
} from "@mantine/core";

// -----------------------------------------------------------

import useModel from "./hooks/useModel";

import PaperStage from "./components/paperStage";

import { reset, initModel, generate, refresh, redraw, retrace } from "./stage";

// --------------------------------------------------------------
// HELPERS

function parseParams(updatedParams: ParamSet) {
	const modelParams: any = {};

	Array.from(updatedParams.values()).forEach((p: any) => {
		modelParams[p.name] = p.value;
	});

	return modelParams;
}

// ---------------------------------------------------------------

const UI = () => {
	const [isPaperLoaded, setIsPaperLoaded] = useState<boolean>(false);
	const [initialized, setInitialized] = useState<boolean>(false);

	const [models, currentModel, setCurrentModel] = useModel();
	const [paramsForConsole, setParamsForConsole] = useState<ParamSet | null>(null);
	const [iterations, setIterations] = useState<number>(4);

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
	// ACTION: model change

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
	// ACTION: iteration number change

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

	// .............................................................................
	// ACTION: tracing slider input

	// ----------------------------------------------------------------------------
	// HANDLERS

	const handleIterationCtrlInput = (value: number | string) => {
		if (value > 0) {
			setIterations(Number(value));
		}
	};

	const handleParamCtrlInputForModel = (updatedParams: any) => {
		setParamsForConsole(updatedParams);
	};

	const handleModelSelection = (value: string) => {
		setCurrentModel({ type: value });
		console.log(`selected: ${value}`, currentModel);
	};

	const handleSliderInput = (value: number, id: string) => {
		retrace(value);
	};

	const handleCanvasResize = (width: number, height: number) => {
		console.log("canvas size: ", width, height);

		if (isPaperLoaded && width && height) {
			console.log(`2 --> RESIZING for ${iterations} iterations`);

			reset();
			initModel(width, height);
			const params: ParamSet = parseParams(currentModel.params);
			refresh();
			generate(currentModel.model, iterations, params);
			redraw(params);
		}
	};

	// -------------------------------------------------------------------------------------------------------
	// AUX

	const switchConsole = (model: Model) => {
		const Console = model.console;

		return <Console params={paramsForConsole} inputHandler={handleParamCtrlInputForModel} />;
	};

	const frameMargin = 6;
	const dark = DEFAULT_THEME.colors.dark[5];
	const softDark = DEFAULT_THEME.colors.dark[0];
	const light = DEFAULT_THEME.colors.gray[0];
	const softLight = DEFAULT_THEME.colors.gray[2];

	return (
		<div
			style={{
				position: "relative",
				width: "100%",
				height: "100vh",
				padding: `${frameMargin}vh`,
			}}
		>
			<div style={{ border: `1px solid ${dark}`, borderRadius: `10px` }}>
				<Grid align="stretch" gutter={0}>
					<Grid.Col span={2}>
						<Container
							fluid
							w="100%"
							bg={dark}
							pt="sm"
							pb="md"
							mb="md"
							style={{ borderRadius: "8px 0 0 0" }}
						>
							<Title c={light}>Hilbert</Title>
							<Space h="md" />
							<Text size="sm" c={softLight}>
								Project description goes here. It should be a brief succint text introducing the concept
							</Text>
							<Space h="sm" />
						</Container>
						<Stack w={"100%"} p={15}>
							<NumberInput
								label="iterations"
								description="..."
								allowNegative={false}
								allowDecimal={false}
								min={1}
								max={6}
								value={iterations}
								onChange={handleIterationCtrlInput}
							/>
							{initialized && currentModel && switchConsole(currentModel)}
						</Stack>
					</Grid.Col>
					<Grid.Col span={10}>
						<div
							style={{
								position: "relative",
								height: `${100 - frameMargin * 2}vh`,
								borderLeft: `1px solid ${dark}`,
							}}
						>
							<div style={{ position: "absolute", top: "15px", left: "15px" }}>
								<Stack gap={9}>
									<SegmentedControl
										value={currentModel.option}
										onChange={handleModelSelection}
										data={modelOptions}
										color={dark}
										size="xs"
										m={0}
										p={0}
										classNames={modelSelectorStyles}
									/>
									<Text size="sm" fw={500} c={softDark} ml="1vw">
										Choose a model...
									</Text>
								</Stack>
							</div>
							<div
								style={{
									position: "absolute",
									bottom: "3vh",
									left: "3vw",
									width: "100%",
									paddingRight: "6vw",
								}}
							>
								<Slider
									id={"retraceCtrl"}
									name={"RetraceCtrl"}
									min={0}
									max={1}
									step={0.001}
									onChange={(value) => {
										handleSliderInput(value, "retraceCtrl");
									}}
									// value={0}
									classNames={sliderStyles}
								/>
							</div>
							<PaperStage onPaperLoad={setIsPaperLoaded} onResize={handleCanvasResize} />
						</div>
					</Grid.Col>
				</Grid>
			</div>
		</div>
	);
};

export default UI;
