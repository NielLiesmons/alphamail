/**
 * Drive --chrome-scroll-fade (0→1 over the first `fadePx` of scroll) on a column root.
 * Finds the nested feed/body scroller (same selectors as PullToRefresh).
 *
 * @param {ParentNode | null | undefined} root
 * @param {(v: number) => void} setFade
 * @param {number} [fadePx=16]
 * @returns {() => void}
 */
export function attachChromeScrollFade(root, setFade, fadePx = 16) {
	if (!root || typeof document === 'undefined') {
		setFade(0);
		return () => {};
	}

	/** @type {HTMLElement | null} */
	let scroller = null;

	/** @param {ParentNode | null | undefined} el */
	function findScroller(el) {
		if (!el || !(el instanceof Element)) return null;
		const candidates = el.querySelectorAll('.feed, .fill, .body, .ptr-scroll');
		for (const node of candidates) {
			const style = getComputedStyle(node);
			const oy = style.overflowY;
			if (
				(oy === 'auto' || oy === 'scroll' || oy === 'overlay') &&
				node.scrollHeight > node.clientHeight + 1
			) {
				return /** @type {HTMLElement} */ (node);
			}
		}
		for (const node of candidates) {
			return /** @type {HTMLElement} */ (node);
		}
		return null;
	}

	function onScroll() {
		const t = scroller?.scrollTop ?? 0;
		setFade(Math.min(1, Math.max(0, t / fadePx)));
	}

	function bind() {
		const next = findScroller(root);
		if (next === scroller) {
			onScroll();
			return;
		}
		scroller?.removeEventListener('scroll', onScroll);
		scroller = next;
		scroller?.addEventListener('scroll', onScroll, { passive: true });
		onScroll();
	}

	setFade(0);
	bind();
	const raf = requestAnimationFrame(bind);
	const mo = new MutationObserver(bind);
	mo.observe(/** @type {Node} */ (root), { childList: true, subtree: true });

	return () => {
		cancelAnimationFrame(raf);
		mo.disconnect();
		scroller?.removeEventListener('scroll', onScroll);
		scroller = null;
	};
}
