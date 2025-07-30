import { dia } from "@joint/core";

const LIQUID_COLOR = "#27ae60";
const LIQUID_COLOR_NF = "#cccccc";

class PipeLink
 extends dia.Link {
	private animationId?: number;

	defaults() {
		return {
			...super.defaults,
			type: "Pipe",
			z: -1,
			router: { name: "rightAngle" },
			flow: 1,
			attrs: {
				liquid: {
					connection: true,
					stroke: LIQUID_COLOR_NF,
					strokeWidth: 10,
					strokeLinejoin: "round",
					strokeLinecap: "square",
					strokeDasharray: "10,20",
				},
				line: {
					connection: true,
					stroke: "#eee",
					strokeWidth: 10,
					strokeLinejoin: "round",
					strokeLinecap: "round",
				},
				outline: {
					connection: true,
					stroke: "#444",
					strokeWidth: 16,
					strokeLinejoin: "round",
					strokeLinecap: "round",
				},
			},
		};
	}

	preinitialize() {
		this.markup = [
			{
				tagName: "path",
				selector: "outline",
				attributes: { fill: "none" },
			},
			{
				tagName: "path",
				selector: "line",
				attributes: { fill: "none" },
			},
			{
				tagName: "path",
				selector: "liquid",
				attributes: { fill: "none" },
			},
		];
	}

	runFlow() {
		this.startLiquidAnimation();
	}

	stopFlow() {
		this.stopLiquidAnimation();
	}

	private startLiquidAnimation() {
		let offset = 0;
		const animate = () => {
			offset = (offset - 2 + 30) % 30; // Reverse direction
			// offset = (offset + 2 ) % 30; // Forward direction
			this.attr('liquid/strokeDashoffset', offset);
			this.attr('liquid/stroke', LIQUID_COLOR);
			this.animationId = requestAnimationFrame(animate);
		};
		this.stopLiquidAnimation();
		this.animationId = requestAnimationFrame(animate);
	}

	private stopLiquidAnimation() {
		if (this.animationId) {
			this.attr('liquid/stroke', LIQUID_COLOR_NF);
			cancelAnimationFrame(this.animationId);
			this.animationId = undefined;
		}
	}
}

export default PipeLink
;
