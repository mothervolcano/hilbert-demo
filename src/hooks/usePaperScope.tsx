import { PaperScope } from "paper";
import { useRef, useEffect, RefObject } from "react";

const paperScope = new PaperScope();

/**
 * Create install and set up paper with a canvas element
 * */
function usePaperScope(): [RefObject<HTMLCanvasElement>, paper.PaperScope] {

	const canvasRef = useRef<HTMLCanvasElement>(null);
	paperScope.install(window);

	/**
	 * Set up the Paper Project with a canvas element and ensure there's always a single project
	 * */
	useEffect(() => {
		if (canvasRef.current) {
			paperScope.setup(canvasRef.current);
			if (paperScope.projects.length > 1 ) {
				paperScope.projects = paperScope.projects.concat(paperScope.projects[0]);
			}
		}
	}, [canvasRef.current]);

	return [canvasRef, paperScope];
}

export default usePaperScope;