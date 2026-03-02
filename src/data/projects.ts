export type ProjectItem = {
	title: string;
	role: string;
	org?: string;
	period?: string;
	link?: string;
	description: string;
	tags?: string[];
	prs?: { label: string; url: string }[];
};

export type ProjectCategory = {
	title: string;
	items: ProjectItem[];
};

export const projectCategories: ProjectCategory[] = [
	{
		title: "Competitions & Demos",
		items: [
			{
				title: "Kaggle LMSYS – Chatbot Arena Preference Prediction",
				role: "Team Lead & Algorithm Designer",
				period: "Aug 2024",
				description:
					"Built LoRA‑fine‑tuned models with pseudo‑labeling and ensembles; earned Silver Medal (39/1,849 teams).",
				tags: ["Kaggle", "preference modeling", "LoRA"],
			},
			{
				title: "LLM‑MCTS Reasoning from Scratch",
				role: "Lead & Algorithm Designer",
				period: "Jan 2025",
				link: "https://github.com/Wangmerlyn/MCTS-GSM8k-Demo",
				description:
					"Lightweight Monte‑Carlo Tree Search pipeline for LLM agents; supports OpenAI/DeepSeek APIs with optimized rollout policy.",
				tags: ["LLM", "MCTS", "agents"],
			},
			{
				title: "Jung's Letter (NetEase MINIGAME 2022)",
				role: "Architect & Lead Programmer",
				period: "Oct 2022",
				link: "https://www.bilibili.com/video/BV1eD4y1b7oa",
				description:
					"2.5D narrative adventure; produced teaser and achieved charity certification from Beijing New Sunshine Charity Foundation.",
				tags: ["game dev", "narrative", "unity"],
			},
		],
	},
	{
		title: "Open Source Contributions",
		items: [
			{
				title: "KeepGPU",
				role: "Maintainer",
				period: "2025-2026",
				link: "https://github.com/Wangmerlyn/KeepGPU",
				description:
					"Built and maintain a Python CLI tool that keeps shared GPUs active with lightweight keep-alive workloads, plus a matching Python API.",
				tags: ["python", "GPU tooling", "CLI"],
			},
			{
				title: "vLLM",
				role: "Contributor",
				period: "2025",
				link: "https://github.com/vllm-project/vllm/pull/20857",
				description:
					"Fixed rope scaling override order so Hugging Face config conversions stay correct after legacy overrides.",
				tags: ["LLM serving", "inference", "bugfix"],
			},
			{
				title: "VERL (Volcano Engine RL for LLMs)",
				role: "Contributor",
				period: "2025",
				description:
					"Extended-context fixes and truncation improvements for RL pipelines (YaRN), with tests across rollout workers.",
				tags: ["RL", "long context", "tooling"],
				prs: [
					{ label: "PR #737", url: "https://github.com/volcengine/verl/pull/737" },
					{ label: "PR #1488", url: "https://github.com/volcengine/verl/pull/1488" },
					{ label: "PR #2462", url: "https://github.com/volcengine/verl/pull/2462" },
				],
			},
			{
				title: "RULER / InfiniteBench / Retrieval Head",
				role: "Contributor",
				period: "2024",
				description:
					"Long-context evaluation and analysis: reproducible data synthesis, 128k LLaMA3-7B single‑GPU inference, and Phi3 retrieval-head support.",
				tags: ["evaluation", "long context", "LLM"],
				prs: [
					{ label: "RULER fixes", url: "https://github.com/hsiehjackson/RULER" },
					{ label: "InfiniteBench optimization", url: "https://github.com/OpenBMB/InfiniteBench" },
					{
						label: "Retrieval Head (Phi3 support)",
						url: "https://github.com/nightdessert/Retrieval_Head",
					},
				],
			},
		],
	},
];
