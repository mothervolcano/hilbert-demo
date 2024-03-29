import { useState, useEffect } from "react";

import { useMediaQuery } from "@mantine/hooks";
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
  rem,
} from "@mantine/core";

import modelSelectorStyles from "./styles/modelSelector.module.css";
import sliderStyles from "./styles/slider.module.css";

// -----------------------------------------------------------

import { Model, Param, ParamSet } from "./types";

import useModel from "./hooks/useModel";

import PaperStage from "./components/paperStage";
import { reset, initModel, generate, refresh, redraw, resize, retrace } from "./stage";

// --------------------------------------------------------------
// LAYOUT COMPONENTS

const Layout = ({ orientation, children }: any) => {
  if (orientation === "LANDSCAPE") {
    return (
      <Flex>
        <div style={{ position: "relative", minWidth: "300px", maxWidth: "20%", overflowY: "auto" }}>
          {children[0]}
        </div>
        <div style={{ position: "relative", minWidth: "250px", flexGrow: "1" }}>{children[1]}</div>
      </Flex>
    );
  }

  if (orientation === "PORTRAIT") {
    return (
      <Stack justify="flex-start" align="stretch">
        <div style={{ position: "relative" }}>{children[1]}</div>
        <div style={{ position: "relative", overflowY: "auto" }}>{children[0]}</div>
      </Stack>
    );
  }

  return null;
};

// --------------------------------------------------------------
// HELPERS

function parseParams(updatedParams: ParamSet) {
  const modelParams: any = {};

  Array.from(updatedParams.values()).forEach((p: any) => {
    modelParams[p.name] = p.value;
  });

  return modelParams;
}

function App() {

  const [initialized, setInitialized] = useState<boolean>(false);

  const [models, currentModel, setCurrentModel] = useModel();
  const [paramsForConsole, setParamsForConsole] = useState<ParamSet | null>(null);

  const [iterations, setIterations] = useState<number>(4);
  const [pathOffset, setPathOffset] = useState<number>(0);

  // ----------------------------------------------------------------------------

  const modelOptions: SegmentedControlItem[] = models.map((model) => {
    return {
      label: model.option,
      value: model.option,
    };
  });

  /**
   * Called by the PaperStage when paper is installed and a PaperScope object is available
   * */
  const onStageReady = (paperScope: paper.PaperScope) => {
    console.log("1 --> PAPERJS LOADED!");
    setParamsForConsole(currentModel.params);
    reset(paperScope);
    initModel(paperScope);

    if (!initialized) {
      setInitialized(true);
    }
  };

  /**
   * Called by the PaperStage when the canvas is resized
   * */
  const onStageResize = (view: paper.View) => {
    const params: ParamSet = parseParams(currentModel.params);
    refresh();
    redraw(params);
  };

  // ----------------------------------------------------------------------------
  // HOOKS

  // .............................................................................
  // ACTION: the app is loaded

  // useEffect(() => {

  //  console.log("1 --> PAPERJS LOADED! canvasRef: ", canvasRef);

  //  if (!isPaperReady) {
  //    console.log("PAPER HASN'T LOADED");
  //    return () => {};
  //  }
  //  setParamsForConsole(currentModel.params);
  //  reset(paperScope);
  //  if (stageSize) {
  //    resize(stageSize);
  //  }
  //  initModel(paperScope);

  //  if (!initialized) {
  //    setInitialized(true);
  //  }
  // }, [isPaperReady, stageSize]);

  // .............................................................................
  // ACTION: parameters are updated in the UI

  useEffect(() => {
    console.log("2 --> PARAMS INPUT RECEIVED!");

    if (!initialized) {
      // console.log("PAPER HASN'T LOADED");
      return;
    }

    if (currentModel === null) {
      // it should check if it is initialized instead and not if there's a model
      // TODO: error message
    } else if (currentModel) {
      const params: ParamSet = parseParams(currentModel.params);
      refresh();
      generate(currentModel.model, iterations, params);
      redraw(params);
    }
  }, [paramsForConsole]);

  // .............................................................................
  // ACTION: model change

  useEffect(() => {
    console.log("3 --> NEW MODEL SELECTED!");

    if (!initialized) {
      // console.log("PAPER HASN'T LOADED");
      return;
    }

    // console.log("2 --> REDRAWING for new selected Model");

    const params: ParamSet = parseParams(currentModel.params);
    refresh();
    generate(currentModel.model, iterations, params);
    redraw(params);
  }, [currentModel]);

  // .............................................................................
  // ACTION: iteration number change

  useEffect(() => {
    console.log("4 --> NEW MODEL SELECTED!");

    if (!initialized) {
      // console.log("PAPER HASN'T LOADED");
      return;
    }

    // console.log(`2 --> REDRAWING for ${iterations} iterations`);

    const params: ParamSet = parseParams(currentModel.params);
    refresh();
    generate(currentModel.model, iterations, params);
    redraw(params);
  }, [iterations]);


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

  const switchConsole = (model: Model, layout: string, mode: string) => {
    const Console = model.console;

    return (
      <Console
        params={paramsForConsole}
        inputHandler={handleParamCtrlInputForModel}
        mode={mode}
        layout={layout}
      />
    );
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
    height: isLandscape ? `${100 - frameMargin * 2}vh` : `70vh`,
    borderLeft: isLandscape ? `1px solid ${dark}` : "none",
    borderBottom: isLandscape ? "none" : `1px solid ${dark}`,
  };

  const titleStyle = {};

  const consoleLayoutType = isPortrait ? "COL" : "COL";
  const consoleLayoutMode = isPortrait ? "COMPACT" : "NORMAL";

  // ------------------------------------------------------------------------

  const title = () => {
    return (
      <div
        style={{
          position: "absolute",
          top: "0rem",
          left: "0.25rem",
        }}
      >
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
              A FASS curve generator based on Hilbert’s model.
            </Text>
            <Space h="sm" />
          </Container>
        )}
        <div
          style={{
            paddingLeft: "1rem",
            paddingRight: "1rem",
            paddingBottom: "0.75rem",
            paddingTop: "0.25rem",
            display: "flex",
          }}
        >
          <div style={{ width: "60%" }}>
            <Title order={5} c={dark}>
              Iterations
            </Title>
          </div>
          <div style={{ width: "40%" }}>
            <NumberInput
              allowNegative={false}
              allowDecimal={false}
              min={1}
              max={6}
              value={iterations}
              onChange={handleIterationCtrlInput}
            />
          </div>
        </div>
        <div
          style={{ paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.25rem", paddingBottom: "2rem" }}
        >
          {initialized && currentModel && switchConsole(currentModel, consoleLayoutType, consoleLayoutMode)}
        </div>
      </div>
    );
  };

  const modelSelector = () => {
    return (
      <div style={{ width: "fit-content", paddingLeft: "1rem", paddingBottom: "1.25rem" }}>
        <Stack gap={9}>
          <SegmentedControl
            value={currentModel.option}
            onChange={handleModelSelection}
            data={isPortrait ? modelOptions.filter((m) => m.label !== "SCHENCK") : modelOptions}
            color={dark}
            size="xs"
            m={0}
            p={0}
            classNames={modelSelectorStyles}
          />
          {!isPortrait && (
            <Text size="sm" fw={500} c={softDark} ml="1vw">
              Choose a model...
            </Text>
          )}
        </Stack>
      </div>
    );
  };

  const tracingControl = () => {
    return (
      <div
        style={{
          position: "absolute",
          bottom: "5vh",
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
          label={null}
          size="1px"
          thumbSize={rem(10)}
          color={dark}
          showLabelOnHover={false}
          styles={{ thumb: { backgroundColor: dark, borderWidth: 0 } }}
          classNames={sliderStyles}
        />
      </div>
    );
  };

  const stage = () => {
    return (
      <PaperStage style={stageStyle} onReady={onStageReady} onResize={onStageResize}>
        <div
          style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
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
          {isPortrait && modelSelector()}
          {isLandscape && tracingControl()}
        </div>
      </PaperStage>
    );
  };
  return (
    <div>
      <header>
        <div style={containerStyle}>
      <div style={frameStyle}>
        <Layout orientation={isLandscape ? "LANDSCAPE" : isPortrait ? "PORTRAIT" : null}>
          {panel()}
          {stage()}
        </Layout>
      </div>
    </div>
      </header>
    </div>
  );
}

export default App;
