import useResizeObserver from "@react-hook/resize-observer";
import { useLayoutEffect, useState } from "react";

const useSize = (target: any): DOMRect | undefined => {
	const [size, setSize] = useState<DOMRect>();

	useLayoutEffect(() => {
		if (!target || !target.current) {
			throw new Error(`ERROR @useSize hook: element not found`);
		}
		setSize(target.current.getBoundingClientRect());
	}, [target.current]);

	useResizeObserver(target.current, (entry: any) => setSize(entry.contentRect));

	return size;
};

export default useSize;
