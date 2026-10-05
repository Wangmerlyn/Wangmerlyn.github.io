export type SlideDeck = {
	slug: string;
	title: string;
	date: string;
	venue?: string;
	description: string;
};

export const slides: SlideDeck[] = [
	{
		slug: "2026-ring-attention",
		title: "Ring Attention",
		date: "2026-10-04",
		venue: "NiubAI",
		description: "Ring Attention with blockwise Transformers for near-infinite context.",
	},
	{
		slug: "2026-hello-slidev",
		title: "Hello Slidev",
		date: "2026-10-03",
		venue: "Site template",
		description: "Starter deck that verifies the Slidev build pipeline on this site.",
	},
];
