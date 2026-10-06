import { onMounted, onUnmounted } from "vue";

const CANVAS_WIDTH = 980;

export default function setup() {
	let observer: ResizeObserver | undefined;

	onMounted(() => {
		const container = document.getElementById("slide-container");
		if (!container) {
			return;
		}

		const apply = () => {
			const { width, height } = container.getBoundingClientRect();
			if (width < 1 || height < 1) {
				return;
			}

			const scale = width / CANVAS_WIDTH;
			const canvasHeight = Math.max(1, Math.ceil(height / scale));
			container.style.setProperty("--slidev-fit-w", `${CANVAS_WIDTH}px`);
			container.style.setProperty("--slidev-fit-h", `${canvasHeight}px`);
			container.style.setProperty("--slidev-fit-s", String(scale));
		};

		observer = new ResizeObserver(apply);
		observer.observe(container);
		apply();
	});

	onUnmounted(() => observer?.disconnect());
}
