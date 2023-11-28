import { Container, Text, Slider, Stack } from "@mantine/core";
import sliderStyles from "../../styles/slider.module.css";

interface ConsoleProps {
	params: any;
	inputHandler: Function;
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
	const { params, inputHandler } = props;

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

	return (
		<Stack gap={15}>
			{params.map((p: any) => (
				<Stack gap={2}>
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
		</Stack>
	);
};

export default DefaultConsole;
