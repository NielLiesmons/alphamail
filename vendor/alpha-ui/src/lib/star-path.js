/**
 * Soft 5-point star path (rounded tips / dents — not spiky).
 * @param {{ cx?: number, cy?: number, outer?: number, inner?: number, tipRound?: number, dentRound?: number }} [opts]
 */
export function softStarPath(opts = {}) {
	const cx = opts.cx ?? 12;
	const cy = opts.cy ?? 12;
	const outer = opts.outer ?? 10;
	const inner = opts.inner ?? 6.9;
	const tipRound = opts.tipRound ?? 1.2;
	const dentRound = opts.dentRound ?? 0.85;
	const spikes = 5;
	/** @type {{ x: number, y: number, r: number }[]} */
	const verts = [];
	for (let i = 0; i < spikes * 2; i++) {
		const r = i % 2 === 0 ? outer : inner;
		const a = (Math.PI * i) / spikes - Math.PI / 2;
		verts.push({
			x: cx + r * Math.cos(a),
			y: cy + r * Math.sin(a),
			r: i % 2 === 0 ? tipRound : dentRound
		});
	}
	/** @type {string[]} */
	const parts = [];
	for (let i = 0; i < verts.length; i++) {
		const prev = verts[(i - 1 + verts.length) % verts.length];
		const cur = verts[i];
		const next = verts[(i + 1) % verts.length];
		const toPrev = Math.hypot(prev.x - cur.x, prev.y - cur.y) || 1;
		const toNext = Math.hypot(next.x - cur.x, next.y - cur.y) || 1;
		const rr = Math.min(cur.r, toPrev * 0.42, toNext * 0.42);
		const ax = cur.x + ((prev.x - cur.x) / toPrev) * rr;
		const ay = cur.y + ((prev.y - cur.y) / toPrev) * rr;
		const bx = cur.x + ((next.x - cur.x) / toNext) * rr;
		const by = cur.y + ((next.y - cur.y) / toNext) * rr;
		if (i === 0) parts.push(`M ${ax.toFixed(3)} ${ay.toFixed(3)}`);
		else parts.push(`L ${ax.toFixed(3)} ${ay.toFixed(3)}`);
		parts.push(`Q ${cur.x.toFixed(3)} ${cur.y.toFixed(3)} ${bx.toFixed(3)} ${by.toFixed(3)}`);
	}
	return `${parts.join(' ')} Z`;
}

/** Shared 24×24 path for EnterpriseBox */
export const ENTERPRISE_STAR_24 = softStarPath();

/** Shared 18×18 path for nav Entreprises icon — slightly larger optical mass */
export const ENTERPRISE_STAR_18 = softStarPath({
	cx: 9,
	cy: 9,
	outer: 8.15,
	inner: 5.55,
	tipRound: 1.05,
	dentRound: 0.72
});
