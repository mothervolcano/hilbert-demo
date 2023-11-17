import { useRef, useEffect } from "react";

import { PaperScope } from "paper";

export const paperScope = new PaperScope();

const PaperStage = ({ onPaperLoad }: any) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (canvasRef.current !== null) {
			paperScope.install(window);
			paperScope.setup(canvasRef.current);
			onPaperLoad(true);
		} else {
			//TODO: error message
		}
	}, []);

	return (
		<canvas
			style={{ position: "relative", width: "100%", height: "100%"}}
			ref={canvasRef}
		></canvas>
	);
};

export default PaperStage;
