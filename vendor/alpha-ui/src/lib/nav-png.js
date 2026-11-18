/**
 * Optional PNG art for selected nav sections (alpha-ui/icons/{name}.png).
 * Missing files → null (show nothing — never invent assets).
 */

/** @type {Record<string, string>} */
const urls = {};

const modules = import.meta.glob('../../icons/*.{png,PNG}', {
	eager: true,
	query: '?url',
	import: 'default'
});

for (const [path, url] of Object.entries(modules)) {
	const base = path.split('/').pop() || '';
	const name = base.replace(/\.png$/i, '').toLowerCase();
	if (name && typeof url === 'string') urls[name] = url;
}

/** Aliases → file basename without extension */
const ALIAS = {
	task: 'tasks',
	file: 'folder',
	files: 'folder',
	drive: 'folder',
	note: 'notes',
	inbox: 'mail',
	message: 'mail',
	messages: 'chat'
};

/**
 * @param {string | undefined | null} icon
 * @returns {string | null}
 */
export function navPngUrl(icon) {
	const key = String(icon || '')
		.trim()
		.toLowerCase();
	if (!key) return null;
	const mapped = ALIAS[key] || key;
	return urls[mapped] || null;
}
