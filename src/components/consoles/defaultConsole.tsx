import { Container, Text, Slider, Stack } from "@mantine/core";
import sliderStyles from "../../styles/slider.module.css";

interface ConsoleProps {
	params: any;
	inputHandler: Function;
	layout: string;
	size: string;
}

interface Style {
    width: string;
    display: string;
    flexDirection: React.CSSProperties['flexDirection'];
    justifyContent?: React.CSSProperties['justifyContent'];
    gap?: string;

}

const labelStyleProps = {
	size: "xs",
	fw: "500",
	c: "var(--mantine-color-dark-3)",
};

const StyledText = (props: any) => {
	return <Text {...labelStyleProps}>{props.children}</Text>;
};

const DefaultConsole = (props: ConsoleProps) => {
	const { params, inputHandler, layout, size } = props;

	// ------------------------------------------------------

	function handleSliderInput(value: number, id: string) {
		const updatedParams = params.slice();

		updatedParams.map((item: any) => {
			if (item.id === id) {
				item.value = value;
			}
		});

		inputHandler(updatedParams);
	}

	const rowLayout: Style = {
		width: "100%",
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		gap: "1rem"
	}

	const colLayout: Style = {
		width: "100%",
		display: "flex",
		flexDirection: "column",
	}

	return (
	    <div style={layout === "ROW" ? rowLayout : colLayout}>
			<div style={{width: "100%"}}>
				{params.filter((p:any) => p.rank === 1).map((p: any) => (
					<Stack key={p.id} gap={2}>
						<StyledText>{p.label}</StyledText>
						<Slider
							id={p.id}
							name={p.id}
							min={p.range[0]}
							max={p.range[1]}
							step={p.step}
							onChange={(value) => {
								handleSliderInput(value, p.id);
							}}
							value={p.value}
							classNames={sliderStyles}
						/>
					</Stack>
				))}
			</div>
			<div style={{width: "100%"}}>
				{params.filter((p:any) => p.rank === 2).map((p: any) => (
					<Stack key={p.id} gap={2}>
						<StyledText>{p.label}</StyledText>
						<Slider
							id={p.id}
							name={p.id}
							min={p.range[0]}
							max={p.range[1]}
							step={p.step}
							onChange={(value) => {
								handleSliderInput(value, p.id);
							}}
							value={p.value}
							classNames={sliderStyles}
						/>
					</Stack>
				))}
			</div>
	    </div>
	);
};

export default DefaultConsole;
