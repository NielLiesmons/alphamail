/**
 * Pointer drag-down to dismiss mobile sheets / fullscreen overlays.
 * Ignores the gesture while an inner scrollport still has scrollTop > 0.
 *
 * Phone note: `touch-action: pan-y` alone lets the browser steal the gesture
 * after a few pixels → `pointercancel` → snap-back. We claim on small
 * downward intent and `preventDefault` on non-passive touchmove so scroll
 * cannot cancel the dismiss drag.
 *
 * @param {HTMLElement} node
 * @param {{
 *   onclose?: () => void,
 *   onDismiss?: () => void,
 *   enabled?: boolean,
 *   threshold?: number,
 *   scrollSelector?: string,
 *   wholeSurface?: boolean
 * }} [params]
 */
export function dragDismiss(node, params = {}) {
	let onclose = params.onclose || params.onDismiss || (() => {});
	let enabled = params.enabled !== false;
	let threshold = params.threshold ?? 90;
	let scrollSelector = params.scrollSelector || '';
	let wholeSurface = Boolean(params.wholeSurface);

	/** @type {number} */
	let startY = 0;
	/** @type {number} */
	let startX = 0;
	/** @type {number} */
	let dy = 0;
	let dragging = false;
	/** Gesture claimed — browser scroll must not win. */
	let claimed = false;
	/** @type {number | null} */
	let pointerId = null;

	function scrollRoot() {
		if (scrollSelector) {
			const el = node.querySelector(scrollSelector);
			if (el instanceof HTMLElement) return el;
		}
		if (wholeSurface) {
			const list = node.querySelector('.queue-list, [data-drag-dismiss-scroll]');
			if (list instanceof HTMLElement) return list;
		}
		return node;
	}

	function applyTransform(y) {
		const t = Math.max(0, y);
		node.style.transform = t > 0 ? `translate3d(0, ${t}px, 0)` : '';
		node.style.opacity = t > 0 ? String(Math.max(0.35, 1 - t / 320)) : '';
		node.style.transition = dragging && claimed ? 'none' : '';
	}

	function resetVisual() {
		node.style.transform = '';
		node.style.opacity = '';
		node.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
	}

	/**
	 * @param {EventTarget | null} t
	 */
	function shouldIgnoreTarget(t) {
		if (!(t instanceof Element)) return false;
		return Boolean(
			t.closest(
				'[data-no-drag-dismiss], button, a, input, textarea, select, [role="button"], [role="slider"], [contenteditable="true"]'
			)
		);
	}

	function releaseCapture() {
		if (pointerId == null) return;
		try {
			node.releasePointerCapture(pointerId);
		} catch {
			/* ignore */
		}
	}

	/**
	 * @param {boolean} commit
	 */
	function endDrag(commit) {
		const shouldClose = commit && claimed && dy > threshold;
		dragging = false;
		claimed = false;
		releaseCapture();
		pointerId = null;
		if (shouldClose) onclose();
		dy = 0;
		resetVisual();
	}

	/**
	 * @param {PointerEvent} e
	 */
	function claim(e) {
		if (claimed) return;
		claimed = true;
		try {
			node.setPointerCapture(e.pointerId);
		} catch {
			/* ignore */
		}
	}

	/** @param {PointerEvent} e */
	function onDown(e) {
		if (!enabled) return;
		if (e.button != null && e.button !== 0) return;
		if (typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches) {
			return;
		}
		const root = scrollRoot();
		if (root.scrollTop > 2) return;
		if (shouldIgnoreTarget(e.target)) return;

		dragging = true;
		claimed = false;
		pointerId = e.pointerId;
		startY = e.clientY;
		startX = e.clientX;
		dy = 0;
		/* Capture only after claim — early capture fights taps and iOS scroll arbitration. */
	}

	/** @param {PointerEvent} e */
	function onMove(e) {
		if (!dragging || e.pointerId !== pointerId) return;
		const root = scrollRoot();
		if (root.scrollTop > 2) {
			endDrag(false);
			return;
		}

		const rawDy = e.clientY - startY;
		const dx = Math.abs(e.clientX - startX);

		if (!claimed) {
			/* Upward or mostly-horizontal → abandon so native scroll/scrub can win. */
			if (rawDy < -8) {
				dragging = false;
				pointerId = null;
				return;
			}
			if (dx > 12 && dx > rawDy) {
				dragging = false;
				pointerId = null;
				return;
			}
			const need = wholeSurface ? 4 : 8;
			if (rawDy < need) return;
			claim(e);
		}

		dy = Math.max(0, rawDy);
		applyTransform(dy);
		if (e.cancelable) e.preventDefault();
	}

	/** @param {PointerEvent} e */
	function onUp(e) {
		if (!dragging || (pointerId != null && e.pointerId !== pointerId)) return;
		endDrag(true);
	}

	/**
	 * Critical on iOS/Android: without preventDefault, the UA converts the
	 * touch into a scroll and fires pointercancel after ~5px.
	 * @param {TouchEvent} e
	 */
	function onTouchMove(e) {
		if (!dragging || !e.touches?.length) return;
		const touch = e.touches[0];
		const rawDy = touch.clientY - startY;
		if (claimed || rawDy >= (wholeSurface ? 4 : 8)) {
			if (e.cancelable) e.preventDefault();
		}
	}

	node.addEventListener('pointerdown', onDown);
	node.addEventListener('pointermove', onMove, { passive: false });
	node.addEventListener('pointerup', onUp);
	node.addEventListener('pointercancel', onUp);
	node.addEventListener('touchmove', onTouchMove, { passive: false });
	/* pan-y keeps nested scrollports usable; preventDefault after claim blocks UA steal. */
	if (!node.style.touchAction) node.style.touchAction = 'pan-y';

	return {
		/**
		 * @param {{
		 *   onclose?: () => void,
		 *   onDismiss?: () => void,
		 *   enabled?: boolean,
		 *   threshold?: number,
		 *   scrollSelector?: string,
		 *   wholeSurface?: boolean
		 * }} next
		 */
		update(next = {}) {
			onclose = next.onclose || next.onDismiss || onclose;
			enabled = next.enabled !== false;
			threshold = next.threshold ?? threshold;
			scrollSelector = next.scrollSelector ?? scrollSelector;
			wholeSurface = next.wholeSurface != null ? Boolean(next.wholeSurface) : wholeSurface;
		},
		destroy() {
			node.removeEventListener('pointerdown', onDown);
			node.removeEventListener('pointermove', onMove);
			node.removeEventListener('pointerup', onUp);
			node.removeEventListener('pointercancel', onUp);
			node.removeEventListener('touchmove', onTouchMove);
			endDrag(false);
		}
	};
}
