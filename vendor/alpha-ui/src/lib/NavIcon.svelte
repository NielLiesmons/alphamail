<script>
	/**
	 * Your glyphs keep native viewBoxes. Stroke is --icon-stroke in screen px
	 * (vector-effect: non-scaling-stroke) so Drive/Mail/Chat match visually.
	 * Tune --icon-stroke in @alpha/ui tokens.
	 */
	import BaseIcon from './icons/BaseIcon.svelte';
	import { ENTERPRISE_STAR_18 } from './star-path.js';

	/** @type {{ name?: string, size?: number }} */
	let { name = 'dot', size = 22 } = $props();
</script>

<BaseIcon {size}>
	{#if name === 'songs' || name === 'music'}
		<!-- alpha-ui/icons/music.svg (filled) -->
		<svg viewBox="0 0 21 24" fill="none" aria-hidden="true">
			<path
				d="M20.401 0.899424C20.4009 0.75922 20.368 0.620978 20.3051 0.495717C20.2421 0.370457 20.1507 0.261643 20.0382 0.17795C19.9257 0.0942574 19.7952 0.0380001 19.6572 0.0136633C19.5191 -0.0106736 19.3772 -0.00241682 19.2429 0.037775L7.24224 3.63798C7.0568 3.69347 6.89418 3.80726 6.77853 3.96248C6.66287 4.1177 6.60034 4.30606 6.6002 4.49963V16.0463C6.6002 16.1756 6.45379 16.2529 6.34261 16.187C5.61883 15.7578 4.78044 15.5546 3.93594 15.6078C2.98923 15.6675 2.09059 16.0459 1.38634 16.6814C0.682086 17.3169 0.213689 18.1721 0.0574042 19.1078C-0.0988809 20.0434 0.0661496 21.0044 0.525629 21.8343C0.985108 22.6642 1.71198 23.3141 2.5879 23.6782C3.46382 24.0423 4.43721 24.0993 5.3496 23.8397C6.26199 23.5801 7.05965 23.0193 7.61272 22.2486C8.16578 21.478 8.44168 20.5428 8.3955 19.5953L8.4003 19.5005V10.0886C8.4003 10.0179 8.44665 9.95564 8.51433 9.93533L18.3949 6.97116C18.4976 6.94036 18.6009 7.01723 18.6009 7.12441V13.6474C18.6009 13.7767 18.4545 13.854 18.3433 13.788C17.6195 13.3588 16.7811 13.1557 15.9366 13.2089C14.9899 13.2686 14.0913 13.647 13.387 14.2825C12.6828 14.918 12.2144 15.7732 12.0581 16.7088C11.9018 17.6445 12.0668 18.6054 12.5263 19.4353C12.9858 20.2652 13.7127 20.9151 14.5886 21.2793C15.4645 21.6434 16.4379 21.7003 17.3503 21.4407C18.2627 21.1812 19.0603 20.6204 19.6134 19.8497C20.1665 19.079 20.4424 18.1438 20.3962 17.1964L20.401 17.1003V0.899424Z"
				fill="currentColor"
			/>
		</svg>
	{:else if name === 'albums' || name === 'album'}
		<!-- alpha-ui/icons/albums.svg (filled stacked albums) -->
		<svg viewBox="0 0 27 23" fill="none" aria-hidden="true">
			<rect x="0" y="1" width="19" height="20" rx="4" fill="currentColor" />
			<rect x="21" y="3" width="2" height="15" rx="1" fill="currentColor" />
			<rect x="25" y="5" width="2" height="11" rx="1" fill="currentColor" />
		</svg>
	{:else if name === 'playlist' || name === 'playlists'}
		<!-- alpha-ui/icons/playlist.svg (filled) -->
		<svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
			<path
				d="M0 6C0 2.68629 2.68629 0 6 0H10C13.3137 0 16 2.68629 16 6V10C16 13.3137 13.3137 16 10 16H6C2.68629 16 0 13.3137 0 10V6Z"
				fill="currentColor"
			/>
			<path
				d="M0 30C0 26.6863 2.68629 24 6 24H10C13.3137 24 16 26.6863 16 30V34C16 37.3137 13.3137 40 10 40H6C2.68629 40 0 37.3137 0 34V30Z"
				fill="currentColor"
			/>
			<path
				d="M0 54C0 50.6863 2.68629 48 6 48H10C13.3137 48 16 50.6863 16 54V58C16 61.3137 13.3137 64 10 64H6C2.68629 64 0 61.3137 0 58V54Z"
				fill="currentColor"
			/>
			<path
				d="M24 8C24 5.79086 25.7909 4 28 4H60C62.2091 4 64 5.79086 64 8C64 10.2091 62.2091 12 60 12H28C25.7909 12 24 10.2091 24 8Z"
				fill="currentColor"
			/>
			<path
				d="M24 32C24 29.7909 25.7909 28 28 28H60C62.2091 28 64 29.7909 64 32C64 34.2091 62.2091 36 60 36H28C25.7909 36 24 34.2091 24 32Z"
				fill="currentColor"
			/>
			<path
				d="M24 56C24 53.7909 25.7909 52 28 52H60C62.2091 52 64 53.7909 64 56C64 58.2091 62.2091 60 60 60H28C25.7909 60 24 58.2091 24 56Z"
				fill="currentColor"
			/>
		</svg>
	{:else if name === 'home'}
		<!-- alpha-ui/icons/home.svg (filled) -->
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path
				d="M8.5259 0.424619C8.22583 0.191234 8.0758 0.0745407 7.91013 0.0296843C7.76395 -0.00989477 7.60988 -0.00989477 7.4637 0.0296843C7.29803 0.0745407 7.14799 0.191233 6.84793 0.424619L1.05515 4.93011C0.667925 5.23128 0.474314 5.38187 0.334831 5.57046C0.211275 5.73751 0.119234 5.9257 0.0632269 6.12579C0 6.35167 0 6.59695 0 7.08751V13.2669C0 14.2236 0 14.7019 0.186183 15.0673C0.349954 15.3887 0.611276 15.65 0.932695 15.8138C1.2981 16 1.77644 16 2.73312 16H4.44133C4.6805 16 4.80008 16 4.89144 15.9535C4.97179 15.9125 5.03712 15.8472 5.07806 15.7668C5.12461 15.6755 5.12461 15.5559 5.12461 15.3167V9.67965C5.12461 9.20131 5.12461 8.96214 5.2177 8.77943C5.29959 8.61872 5.43025 8.48806 5.59096 8.40618C5.77366 8.31309 6.01283 8.31309 6.49117 8.31309H8.88265C9.361 8.31309 9.60017 8.31309 9.78287 8.40618C9.94358 8.48806 10.0742 8.61872 10.1561 8.77943C10.2492 8.96214 10.2492 9.20131 10.2492 9.67965V15.3167C10.2492 15.5559 10.2492 15.6755 10.2958 15.7668C10.3367 15.8472 10.402 15.9125 10.4824 15.9535C10.5737 16 10.6933 16 10.9325 16H12.6407C13.5974 16 14.0757 16 14.4411 15.8138C14.7626 15.65 15.0239 15.3887 15.1876 15.0673C15.3738 14.7019 15.3738 14.2236 15.3738 13.2669V7.08751C15.3738 6.59695 15.3738 6.35167 15.3106 6.12579C15.2546 5.9257 15.1625 5.73751 15.039 5.57046C14.8995 5.38187 14.7059 5.23129 14.3187 4.93011L8.5259 0.424619Z"
				fill="currentColor"
			/>
		</svg>
	{:else if name === 'artists' || name === 'artist' || name === 'profile'}
		<!-- alpha-ui/icons/profile.svg (filled) -->
		<svg viewBox="0 0 16 20" fill="none" aria-hidden="true">
			<path
				d="M16 16.2353C16 18.3145 12.4183 20 8 20C3.58172 20 0 18.3145 0 16.2353C0 14.1561 3.58172 12.4706 8 12.4706C12.4183 12.4706 16 14.1561 16 16.2353Z"
				fill="currentColor"
			/>
			<path
				d="M12.8 4.70588C12.8 7.30487 10.651 9.41177 8 9.41177C5.34903 9.41177 3.2 7.30487 3.2 4.70588C3.2 2.1069 5.34903 0 8 0C10.651 0 12.8 2.1069 12.8 4.70588Z"
				fill="currentColor"
			/>
		</svg>
	{:else if name === 'recent' || name === 'played' || name === 'clock'}
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<circle cx="8" cy="8" r="5.5" stroke="currentColor" />
			<path
				d="M8 5v3.2l2 1.3"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if name === 'upload'}
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path
				d="M8 11.5V3.5M4.5 6.5 8 3l3.5 3.5M3.5 12.5h9"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if name === 'drive'}
		<svg viewBox="0 0 41 33" fill="none" aria-hidden="true">
			<path
				d="M0.5 24.5L6.2056 4.75303C6.9745 2.22664 9.30483 0.5 11.9456 0.5H29.0544C31.6952 0.5 34.0255 2.22664 34.7944 4.75303L40.5 24.5M6.5 25.5H10.5M7.5 32.5H33.5C37.366 32.5 40.5 29.366 40.5 25.5C40.5 21.634 37.366 18.5 33.5 18.5H7.5C3.63401 18.5 0.5 21.634 0.5 25.5C0.5 29.366 3.63401 32.5 7.5 32.5Z"
				stroke="currentColor"
				stroke-linecap="round"
			/>
		</svg>
	{:else if name === 'mail'}
		<svg viewBox="0 0 26 22" fill="none" aria-hidden="true">
			<path
				d="M24.7002 5.75293L14.7451 11.5605C13.5718 12.2449 12.1385 12.2872 10.9326 11.6885L10.6943 11.5605L0.739258 5.75293V16.7188C0.739258 18.9168 2.52163 20.6992 4.71973 20.6992H20.7197C22.9178 20.6992 24.7002 18.9168 24.7002 16.7188V5.75293ZM24.7002 4.71875C24.7002 2.52066 22.9178 0.738281 20.7197 0.738281H4.71973C2.52163 0.738281 0.739258 2.52066 0.739258 4.71875V5.70605L10.7139 11.5254L10.9502 11.6533C12.1441 12.2461 13.5639 12.203 14.7256 11.5254L24.7002 5.70605V4.71875ZM24.7393 16.7188C24.7393 18.9389 22.9399 20.7383 20.7197 20.7383H4.71973C2.49954 20.7383 0.700195 18.9389 0.700195 16.7188V4.71875C0.700195 2.49857 2.49954 0.699219 4.71973 0.699219H20.7197C22.9399 0.699219 24.7393 2.49857 24.7393 4.71875V16.7188Z"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if name === 'chat'}
		<svg viewBox="0 0 18 19" fill="none" aria-hidden="true">
			<path
				d="M9 0.5C13.6944 0.5 17.5 4.30558 17.5 9C17.5 13.6944 13.6944 17.5 9 17.5C7.77335 17.5 6.60815 17.2386 5.55507 16.7706C5.3323 16.6716 5.08291 16.6441 4.84737 16.7069L1.79379 17.5216C1.02463 17.7269 0.335703 16.9948 0.587211 16.2395L1.4629 13.6098C1.55241 13.341 1.52084 13.0482 1.39409 12.7948C0.822691 11.6525 0.5 10.3641 0.5 9C0.5 4.30563 4.30565 0.500084 9 0.5Z"
				stroke="currentColor"
			/>
		</svg>
	{:else if name === 'tasks'}
		<!-- Checkmark (Bley Check glyph, stroke for nav weight) -->
		<svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
			<path
				d="M3.2 9.4 L7.1 13.1 L14.8 4.4"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if name === 'projects'}
		<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<path
				d="M13.299 1.75L20.227 5.75Q21.526 6.5 21.526 8L21.526 16Q21.526 17.5 20.227 18.25L13.299 22.25Q12 23 10.701 22.25L3.773 18.25Q2.474 17.5 2.474 16L2.474 8Q2.474 6.5 3.773 5.75L10.701 1.75Q12 1 13.299 1.75Z"
				stroke="currentColor"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if name === 'notes' || name === 'note'}
		<!-- alpha-ui/icons/note.svg verbatim -->
		<svg viewBox="0 0 17 17" fill="none" aria-hidden="true">
			<path
				d="M4.5 0.5H12.5C14.7091 0.5 16.5 2.29086 16.5 4.5V9.5C16.5 10.7318 14.9075 12.0746 13.5 13.5C12.051 14.9674 10.7682 16.5 9.5 16.5H4.5C2.29086 16.5 0.5 14.7091 0.5 12.5V4.5C0.5 2.29086 2.29086 0.5 4.5 0.5Z"
				stroke="currentColor"
			/>
			<path
				d="M16.5 8.5C16.5 11 12.5 8.5 10.5 10.5C8.5 12.5 11 16.5 8.5 16.5"
				stroke="currentColor"
				stroke-linecap="round"
			/>
		</svg>
	{:else if name === 'calendar' || name === 'planning'}
		<!-- alpha-ui/icons/planning.svg — optically slightly smaller than peer glyphs -->
		<svg viewBox="0 0 10 10" fill="none" aria-hidden="true" class="planning-glyph">
			<path d="M1 1H7M4 5H9M2 9H6" stroke="currentColor" stroke-linecap="round" />
		</svg>
	{:else if name === 'dashboard'}
		<svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
			<rect x="1.5" y="1.5" width="15" height="15" rx="1" stroke="currentColor" />
			<path d="M9 1.5v15M1.5 9h15" stroke="currentColor" stroke-linecap="round" />
		</svg>
	{:else if name === 'player'}
		<!-- Bley play glyph — stroke; optical size matched to peer icons -->
		<svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
			<g transform="translate(2.1, 1.85) scale(0.92)">
				<path
					d="M13.439 5.88263C13.8097 6.08696 14.1199 6.39198 14.3361 6.76502C14.5524 7.13805 14.6667 7.56504 14.6667 8.00022C14.6667 8.43541 14.5524 8.8624 14.3361 9.23543C14.1199 9.60847 13.8097 9.91349 13.439 10.1178L3.54868 15.6914C1.95613 16.589 0 15.421 0 13.5746V2.42664C0 0.578645 1.95613 -0.588552 3.54868 0.308245L13.439 5.88263Z"
					stroke="currentColor"
					stroke-linejoin="round"
				/>
			</g>
		</svg>
	{:else if name === 'website' || name === 'link' || name === 'globe'}
		<!-- alpha-ui/icons/website.svg verbatim -->
		<svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
			<path
				d="M7 13.5C10.5899 13.5 13.5 10.5899 13.5 7C13.5 3.41015 10.5899 0.5 7 0.5C3.41015 0.5 0.5 3.41015 0.5 7C0.5 10.5899 3.41015 13.5 7 13.5Z"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M0.5 7H13.5"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M9.5 7C9.3772 9.37699 8.50168 11.6533 7 13.5C5.49832 11.6533 4.6228 9.37699 4.5 7C4.6228 4.62301 5.49832 2.34665 7 0.5C8.50168 2.34665 9.3772 4.62301 9.5 7Z"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if name === 'publications'}
		<svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
			<path
				d="M3.5 2.5h8L15.5 6v9a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 2.5 15V4A1.5 1.5 0 0 1 4 2.5h-.5Z"
				stroke="currentColor"
				stroke-linejoin="round"
			/>
			<path
				d="M11.5 2.5V5.5H14.5M5.5 9h7M5.5 11.5h5"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if name === 'accounts' || name === 'people' || name === 'members'}
		<!-- alpha-ui/icons/profile.svg (filled) — shared people glyph -->
		<svg viewBox="0 0 16 20" fill="none" aria-hidden="true">
			<path
				d="M16 16.2353C16 18.3145 12.4183 20 8 20C3.58172 20 0 18.3145 0 16.2353C0 14.1561 3.58172 12.4706 8 12.4706C12.4183 12.4706 16 14.1561 16 16.2353Z"
				fill="currentColor"
			/>
			<path
				d="M12.8 4.70588C12.8 7.30487 10.651 9.41177 8 9.41177C5.34903 9.41177 3.2 7.30487 3.2 4.70588C3.2 2.1069 5.34903 0 8 0C10.651 0 12.8 2.1069 12.8 4.70588Z"
				fill="currentColor"
			/>
		</svg>
	{:else if name === 'settings'}
		<svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
			<circle cx="9" cy="9" r="2.25" stroke="currentColor" />
			<path
				d="M9 1.75v1.5M9 14.75v1.5M1.75 9h1.5M14.75 9h1.5M3.4 3.4l1.06 1.06M13.54 13.54l1.06 1.06M14.6 3.4l-1.06 1.06M4.46 13.54l-1.06 1.06"
				stroke="currentColor"
				stroke-linecap="round"
			/>
		</svg>
	{:else if name === 'accounting'}
		<svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
			<rect x="3.5" y="1.5" width="11" height="15" rx="1.5" stroke="currentColor" />
			<path
				d="M6.5 5.5h5M6.5 8.5h5M6.5 11.5h3"
				stroke="currentColor"
				stroke-linecap="round"
			/>
		</svg>
	{:else if name === 'enterprise' || name === 'entreprises'}
		<svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
			<path
				d={ENTERPRISE_STAR_18}
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if name === 'menu'}
		<!-- alpha-ui/icons/menu.svg in a 16 slot so chrome-ico matches filter/plus optical size -->
		<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path
				d="M3.5 4H12.5M3.5 8H12.5M3.5 12H9.5"
				stroke="currentColor"
				stroke-linecap="round"
			/>
		</svg>
	{:else if name === 'shop'}
		<svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
			<path
				d="M3.5 5.5h11l-1 9.5H4.5l-1-9.5Z"
				stroke="currentColor"
				stroke-linejoin="round"
			/>
			<path
				d="M6.5 5.5V4a2.5 2.5 0 0 1 5 0v1.5"
				stroke="currentColor"
				stroke-linecap="round"
			/>
		</svg>
	{:else}
		<svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
			<circle cx="9" cy="9" r="2" stroke="currentColor" />
		</svg>
	{/if}
</BaseIcon>

<style>
	/* Planning bars read large in a square slot — shrink optically vs peer icons */
	:global(.planning-glyph) {
		width: 78% !important;
		height: 78% !important;
	}
</style>
