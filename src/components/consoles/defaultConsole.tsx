import { Container, Text, Slider, Stack } from "@mantine/core";
import sliderStyles from "./slider.module.css";
import labelStyles from "./sliderLabel.module.css";

interface ConsoleProps {
	params: any;
	inputHandler: Function;
}

const labelStyleProps = {
	size: "sm",
	c: "var(--mantine-color-dark-3)",
};

const StyledText = (props: any) => {
	return <Text {...labelStyleProps}>{props.children}</Text>;
};

const DefaultConsole = (props: ConsoleProps) => {
	const { params, inputHandler } = props;

	// ------------------------------------------------------

	function handleSliderInput(value: number, id: string) {
		console.log(`@DefaultConsole: slider ---> ${value}  / ${id}`);

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
			<Stack gap={2}>
				<StyledText>{params[0].label}</StyledText>
				<Slider
					id={params[0].id}
					name={params[0].id}
					min={params[0].range[0]}
					max={params[0].range[1]}
					step={params[0].step}
					onChange={(value) => {
						handleSliderInput(value, params[0].id);
					}}
					value={params[0].value}
					classNames={sliderStyles}
				/>
			</Stack>

			<Stack gap={2}>
				<StyledText>{params[1].label}</StyledText>
				<Slider
					id={params[1].id}
					name={params[1].id}
					min={params[1].range[0]}
					max={params[1].range[1]}
					step={params[1].step}
					onChange={(value) => {
						handleSliderInput(value, params[1].id);
					}}
					value={params[1].value}
					classNames={sliderStyles}
				/>
			</Stack>

			<Stack gap={2}>
				<StyledText>{params[2].label}</StyledText>
				<Slider
					id={params[2].id}
					name={params[2].id}
					min={params[2].range[0]}
					max={params[2].range[1]}
					step={params[2].step}
					onChange={(value) => {
						handleSliderInput(value, params[2].id);
					}}
					value={params[2].value}
					classNames={sliderStyles}
				/>
			</Stack>

			<Stack gap={2}>
				<StyledText>{params[3].label}</StyledText>
				<Slider
					id={params[3].id}
					name={params[3].id}
					min={params[3].range[0]}
					max={params[3].range[1]}
					step={params[3].step}
					onChange={(value) => {
						handleSliderInput(value, params[3].id);
					}}
					value={params[3].value}
					classNames={sliderStyles}
				/>
			</Stack>
		</Stack>
	);
};

export default DefaultConsole;
