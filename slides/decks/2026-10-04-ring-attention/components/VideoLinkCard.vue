<script setup lang="ts">
import coverImg from "../ulysses-cover.jpg";

const props = withDefaults(
	defineProps<{
		bvid: string;
		title?: string;
		author?: string;
		duration?: string;
	}>(),
	{
		title: "Deepspeed Ulysses 序列并行简介",
		author: "NobleAI",
		duration: "42:23",
	},
);

const href = `https://www.bilibili.com/video/${props.bvid}/`;
</script>

<template>
	<a class="video-link-card" :href="href" target="_blank" rel="noreferrer">
		<div class="video-link-card__thumb">
			<img :src="coverImg" :alt="title" />
			<span class="video-link-card__play" aria-hidden="true">
				<svg viewBox="0 0 24 24" width="18" height="18">
					<path d="M8 5.5v13l11-6.5z" fill="currentColor" />
				</svg>
			</span>
			<span class="video-link-card__time">{{ duration }}</span>
		</div>
		<div class="video-link-card__body">
			<div class="video-link-card__kicker">Bilibili · Ulysses</div>
			<div class="video-link-card__title">{{ title }}</div>
			<div class="video-link-card__meta">{{ author }}</div>
		</div>
	</a>
</template>

<style scoped>
.video-link-card {
	display: grid;
	grid-template-columns: 148px minmax(0, 1fr);
	align-items: stretch;
	gap: 14px;
	margin: 14px 0;
	padding: 8px;
	max-width: 520px;
	text-decoration: none;
	color: inherit;
	border: 1px solid #d2d2d7;
	border-radius: 12px;
	background: #fbfbfd;
	transition:
		transform 120ms ease,
		border-color 120ms ease;
}

.video-link-card:hover {
	border-color: #0071e3;
	transform: translateY(-1px);
}

.video-link-card__thumb {
	position: relative;
	overflow: hidden;
	border-radius: 8px;
	aspect-ratio: 16 / 9;
	background: #111;
}

.video-link-card__thumb img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
}

.video-link-card__play {
	position: absolute;
	inset: 0;
	display: grid;
	place-items: center;
	color: white;
	background: rgb(0 0 0 / 28%);
}

.video-link-card__time {
	position: absolute;
	right: 6px;
	bottom: 6px;
	padding: 1px 6px;
	border-radius: 4px;
	background: rgb(0 0 0 / 72%);
	color: white;
	font-size: 11px;
	line-height: 1.4;
}

.video-link-card__body {
	display: flex;
	flex-direction: column;
	justify-content: center;
	min-width: 0;
	padding-right: 6px;
}

.video-link-card__kicker {
	margin-bottom: 4px;
	color: #0071e3;
	font-size: 11px;
	letter-spacing: 0.04em;
	text-transform: none;
}

.video-link-card__title {
	font-size: 15px;
	font-weight: 700;
	line-height: 1.35;
}

.video-link-card__meta {
	margin-top: 6px;
	color: #6e6e73;
	font-size: 12px;
}
</style>
