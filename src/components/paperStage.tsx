import { useRef, useEffect, ReactNode } from "react";

import useSize from "../hooks/useSize";
import usePaperScope from "../hooks/usePaperScope";

interface StageProps {
	style: object;
	onResize: Function;
	onReady: Function;
	children: ReactNode;
}

const PaperStage = ({ style, onResize, onReady, children }: StageProps) => {
	const stageRef = useRef(null);
	const stageSize = useSize(stageRef);
	const [canvasRef, paperScope] = usePaperScope();

	// console.log("Rendering Stage: ", canvasSize);

	/**
	 * Execute the callback to initialize the drawing
	 * */
	useEffect(() => {
		console.log("onReady: ", paperScope?.view);
		onReady(paperScope);
	}, [canvasRef.current]);

	/**
	 * Execute the callback to redraw/adjust to the updated canvas size
	 * */
	useEffect(() => {
		if (canvasRef.current && stageSize) {
			paperScope.view.viewSize.width = stageSize.width;
			paperScope.view.viewSize.height = stageSize.height;
			onResize(paperScope.view);
		}
	}, [stageSize]);

	const canvasWidth = stageSize ? `${stageSize.width}px` : "100%";
	const canvasHeight = stageSize ? `${stageSize.height}px` : "100%";

	// const canvasWidth = "100%";
	// const canvasHeight = "100%";

	return (
		<div style={style}>
			<div ref={stageRef} style={{ width: "100%", height: "100%" }}>
				<canvas
					ref={canvasRef}
					style={{ position: "relative", width: canvasWidth, height: canvasHeight }}
				></canvas>
			</div>
			{children}
		</div>
	);
};

export default PaperStage;
