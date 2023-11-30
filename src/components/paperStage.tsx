import { useRef, useEffect, useLayoutEffect, useState } from "react";

import useResizeObserver from "@react-hook/resize-observer";

import { PaperScope } from "paper";

export const paperScope = new PaperScope();

const useSize = (target: any): any => {
	const [size, setSize] = useState();

	useLayoutEffect(() => {
		setSize(target.current.getBoundingClientRect());
	}, [target]);

	useResizeObserver(target, (entry: any) => setSize(entry.contentRect));

	return size;
};

const PaperStage = ({ onPaperLoad, onResize }: any) => {
	// ...
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const size = useSize(containerRef);

	// if (size) {
	// 	console.log("resize observer: ", size.width);
	// }

	useEffect(() => {
		if (canvasRef.current !== null) {
			paperScope.install(window);
			paperScope.setup(canvasRef.current);
			onPaperLoad(true);
		} else {
			//TODO: error message
		}
	}, []);


	useEffect(() => {
	    // Update canvas size based on parent size
	    if (canvasRef.current && size) {
	        canvasRef.current.width = size.width;
	        canvasRef.current.height = size.height;
	        // paperScope.project.view.viewSize = new paperScope.Size(size.width, size.height);
	        onResize({width: size.width, height: size.height});
	    }
	}, [size]);

	return (
		<div style={{ width: "100%", height: "100%"}} ref={containerRef}>
			<canvas style={{ position: "relative", width: "100%", height: "100%" }} ref={canvasRef}></canvas>
		</div>
	);
};

export default PaperStage;
