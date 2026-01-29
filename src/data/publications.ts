export type Author = { name: string; coFirst?: boolean };

export type Publication = {
	title: string;
	link: string;
	venue: string;
	authors: Author[];
};

export const publications: Publication[] = [
	{
		title: "Look Back to Reason Forward: Revisitable Memory for Long-Context LLM Agents",
		link: "https://arxiv.org/abs/2509.23040",
		venue: "ICLR 2026",
		authors: [
			{ name: "Yaorui Shi" },
			{ name: "Yuxin Chen" },
			{ name: "Siyuan Wang", coFirst: true },
			{ name: "Sihang Li" },
			{ name: "Hengxing Cai" },
			{ name: "Qi Gu" },
			{ name: "Xiang Wang" },
			{ name: "An Zhang" },
		],
	},
	{
		title: "LoongRL: Reinforcement Learning for Advanced Reasoning over Long Contexts",
		link: "https://arxiv.org/abs/2510.19363",
		venue: "ICLR 2026",
		authors: [
			{ name: "Siyuan Wang", coFirst: true },
			{ name: "Gaokai Zhang", coFirst: true },
			{ name: "Li Lyna Zhang" },
			{ name: "Ning Shang" },
			{ name: "Fan Yang" },
			{ name: "Dongyao Chen" },
			{ name: "Mao Yang" },
		],
	},
	{
		title: "LongRoPE2: Near-Lossless LLM Context Window Scaling",
		link: "https://arxiv.org/abs/2502.20082v1",
		venue: "ICML 2025",
		authors: [
			{ name: "Ning Shang", coFirst: true },
			{ name: "Li Lyna Zhang", coFirst: true },
			{ name: "Siyuan Wang", coFirst: true },
			{ name: "Gaokai Zhang" },
			{ name: "Gilsinia Lopez" },
			{ name: "Fan Yang" },
			{ name: "Weizhu Chen" },
			{ name: "Mao Yang" },
		],
	},
	{
		title: "AIonopedia: an LLM agent orchestrating multimodal learning for ionic liquid discovery",
		link: "https://arxiv.org/abs/2511.11257",
		venue: "Preprint",
		authors: [
			{ name: "Yuqi Yin", coFirst: true },
			{ name: "Yibo Fu", coFirst: true },
			{ name: "Siyuan Wang", coFirst: true },
			{ name: "Peng Sun" },
			{ name: "Hongyu Wang" },
			{ name: "Xiaohui Wang" },
			{ name: "Lei Zheng" },
			{ name: "Zhiyong Li" },
			{ name: "Zhirong Liu" },
			{ name: "Jianji Wang" },
			{ name: "Zhaoxi Sun" },
		],
	},
];
