<script lang="ts">
	// Stand-in "photo" for the demo: a small landscape drawn from a seed, so the page ships no image files.
	let { seed }: { seed: number } = $props();
	const hue = $derived((seed * 47) % 360);
	const sunX = $derived(60 + ((seed * 53) % 180));
	const sunY = $derived(40 + ((seed * 29) % 40));
	const ridge = $derived(
		Array.from({ length: 7 }, (_, i) => `${i * 50},${120 + ((seed * (i + 3) * 17) % 50)}`).join(' L')
	);
	const near = $derived(
		Array.from({ length: 7 }, (_, i) => `${i * 50},${160 + ((seed * (i + 5) * 13) % 35)}`).join(' L')
	);
</script>

<svg viewBox="0 0 300 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
	<defs>
		<linearGradient id="sky{seed}" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stop-color="hsl({hue} 70% 72%)" />
			<stop offset="1" stop-color="hsl({(hue + 40) % 360} 80% 88%)" />
		</linearGradient>
	</defs>
	<rect width="300" height="220" fill="url(#sky{seed})" />
	<circle cx={sunX} cy={sunY} r="18" fill="hsl({(hue + 60) % 360} 95% 92%)" />
	<path d="M0,220 L{ridge} L300,220 Z" fill="hsl({(hue + 200) % 360} 30% 45%)" />
	<path d="M0,220 L{near} L300,220 Z" fill="hsl({(hue + 160) % 360} 35% 28%)" />
</svg>

<style>
	svg {
		width: 100%;
		height: 100%;
		display: block;
		border-radius: 4px;
	}
</style>
