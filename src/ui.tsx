import modelSelectorStyles from "./styles/modelSelector.module.css";

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
	Flex,
} from "@mantine/core";

import sliderStyles from "./styles/slider.module.css";

// -----------------------------------------------------------

import useModel from "./hooks/useModel";

import PaperStage from "./components/paperStage";

import { reset, initModel, generate, refresh, redraw, resize, retrace } from "./stage";
import { useMediaQuery } from "@mantine/hooks";

// --------------------------------------------------------------
// LAYOUT COMPONENTS

const Layout = ({ orientation, children }: any) => {


	if (orientation === "LANDSCAPE") {
		return (
			<Flex>
				<div style={{ position: "relative", minWidth: "300px", maxWidth: "25%" }}>{children[0]}</div>
				<div style={{ position: "relative", minWidth: "250px", flexGrow: "1" }}>{children[1]}</div>
			</Flex>
		);
	}

	if (orientation === "PORTRAIT") {
		return (
			<Stack justify="flex-start" align="stretch">
				<div style={{ position: "relative" }}>{children[1]}</div>
				<div style={{ position: "relative" }}>{children[0]}</div>
			</Stack>
		);
	} 
	
	return null;

};

const LayoutTest = ({orientation, children}: any) => {

	if (orientation === "LANDSCAPE") {

		return (<div>{children}</div>)
	} else {
		return null
	}

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

// ---------------------------------------------------------------

const UI = () => {
	const [paperLoaded, setPaperLoaded] = useState<boolean>(false);
	const [initialized, setInitialized] = useState<boolean>(false);

	const [models, currentModel, setCurrentModel] = useModel();
	const [paramsForConsole, setParamsForConsole] = useState<ParamSet | null>(null);
	
	const [stageSize, setStageSize] = useState<{ width: number; height: number } | null>(null);
	const [iterations, setIterations] = useState<number>(4);
	const [pathOffset, setPathOffset] = useState<number>(0)

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
		if (!paperLoaded) {
			console.log("PAPER HASN'T LOADED");
			return () => {};
		}
		console.log("1 --> PAPERJS LOADED! CurrentModel: ", stageSize);
		setParamsForConsole(currentModel.params);
		reset();
		if (stageSize) {
			resize(stageSize);
		}
		initModel();

		if (!initialized) {
			setInitialized(true);
		}
	}, [paperLoaded, stageSize]);

	// .............................................................................
	// ACTION: parameters are updated in the UI

	useEffect(() => {
		if (!paperLoaded) {
			console.log("PAPER HASN'T LOADED");
			return () => {};
		}

		if (currentModel === null) {
			// it should check if it is initialized instead and not if there's a model
			// TODO: error message
		} else if (currentModel) {
			const params: ParamSet = parseParams(currentModel.params);

			console.log(`2 --> REDRAWING for params change: `, params);
			if (stageSize) {
				resize(stageSize);
			}
			refresh();
			generate(currentModel.model, iterations, params);
			redraw(params);
		}
	}, [paramsForConsole, stageSize]);

	// .............................................................................
	// ACTION: model change

	useEffect(() => {
		if (!paperLoaded) {
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
		if (!paperLoaded) {
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
	// ACTION: on browser window resize

	// useEffect(() => {
	// 	if (!isPaperLoaded) {
	// 		console.log("PAPER ISN'T LOADED");
	// 		return () => {};
	// 	}

	// 	console.log(`3 --> RESIZING`);

	// 	if (stageSize) {
	// 		resize(stageSize);
	// 	}
	// }, [stageSize]);

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
		setPathOffset(0);
		console.log(`selected: ${value}`, currentModel);
	};

	const handleSliderInput = (value: number, id: string) => {
		setPathOffset(value);
		retrace(value);
	};

	// -------------------------------------------------------------------------------------------------------
	// MEDIA QUERIES

	const isDesktop = useMediaQuery("(min-width: 1024px)");
	const isLandscape = useMediaQuery("(orientation: landscape)");
	const isPortrait = useMediaQuery("(orientation: portrait)");

	// -------------------------------------------------------------------------------------------------------
	// AUX

	const switchConsole = (model: Model, layout: string) => {
		const Console = model.console;

		return <Console params={paramsForConsole} inputHandler={handleParamCtrlInputForModel} layout={layout}/>;
	};

	const frameMargin = 6;
	const dark = DEFAULT_THEME.colors.dark[5];
	const softDark = DEFAULT_THEME.colors.dark[0];
	const light = DEFAULT_THEME.colors.gray[0];
	const softLight = DEFAULT_THEME.colors.gray[2];

	const containerStyle = {
		// position: "relative",
		width: "100%",
		height: "100vh",
		padding: isDesktop ? `${frameMargin}vh` : "0",
	};

	const frameStyle = {
		border: isDesktop ? `1px solid ${dark}` : "none",
		borderRadius: isDesktop ? `10px` : "none",
	};

	const sidebarStyle = {
		borderRadius: isDesktop ? "8px 0 0 0" : "none",
	};

	const stageStyle = {
		height: isLandscape ? `${100 - frameMargin * 2}vh` : `60vh`,
		borderLeft: isLandscape ? `1px solid ${dark}` : "none",
		borderBottom: isLandscape ? "none" : `1px solid ${dark}`,
	};

	const titleStyle = {};

	const consoleLayoutType = isPortrait ? "ROW" : "COL";

	// ------------------------------------------------------------------------

	const title = () => {
		return (
			<div style={{
					position: "absolute",
					top: "0.75rem",
					left: "1rem",
				}}>
				<Title c={dark}>Hilbert</Title>
			</div>
		);
	};

	const panel = () => {
		return (
			<div style={{ width: "100%" }}>
				{isLandscape && (
					<Container fluid w="100%" bg={dark} pt="sm" pb="md" mb="md" style={{ borderRadius: "8px 0 0 0" }}>
						<Title c={light}>Hilbert</Title>
						<Space h="md" />
						<Text size="sm" c={softLight}>
							Project description goes here. It should be a brief succint text introducing the concept
						</Text>
						<Space h="sm" />
					</Container>
				)}
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
					{initialized && currentModel && switchConsole(currentModel, consoleLayoutType)}
				</Stack>
			</div>
		);
	};

	const modelSelector = () => {
		return (
			<div style={{width: "fit-content"}}>
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
		);
	};

	const tracingControl = () => {
		return (
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
					value={pathOffset}
					classNames={sliderStyles}
				/>
			</div>
		);
	};

	const stage = () => {
		return (
			<div style={stageStyle}>
				<PaperStage onPaperLoad={setPaperLoaded} onResize={setStageSize} />
				<div
					style={{
						position: "absolute",
						top: "0px",
						left: "0px",
						width: "100%",
					}}
				>
					{!isLandscape && title()}
					{!isPortrait && modelSelector()}
				</div>
				<div
					style={{
						position: "absolute",
						bottom: "0px",
						left: "0px",
						width: "100%",
					}}
				>
					{isLandscape && tracingControl()}
				</div>
			</div>
		);
	};

	return (
		<div style={containerStyle}>
			<div style={frameStyle}>
				<Layout orientation={isLandscape ? "LANDSCAPE" : isPortrait ? "PORTRAIT" : null}>
					{panel()}
					{stage()}
				</Layout>
			</div>
		</div>
	);
};

export default UI;
