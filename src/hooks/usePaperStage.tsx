import { PaperScope } from "paper";
import { useRef, useEffect, useState, RefObject } from "react";

const paperScope = new PaperScope();

function usePaperStage(): [RefObject<HTMLCanvasElement>, boolean, paper.PaperScope] {
	const [isPaperReady, setIsPaperReady] = useState<boolean>(false);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	console.log("...updating paper stage. ", canvasRef)

	useEffect(() => {
		if (canvasRef.current !== null) {
			paperScope.install(window);
			paperScope.setup(canvasRef.current);
			setIsPaperReady(true);
		} else {
			//TODO: error message
		}
	}, [canvasRef.current]);
	
	console.log("paper stage updated! ", canvasRef)

	return [canvasRef, isPaperReady, paperScope];

}

export default usePaperStage;