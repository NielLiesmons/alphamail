export const site = {
	name: 'Alpha Mail',
	shortName: 'Alpha',
	url: 'https://alphamail.xyz',
	/** Separate forum/community webapp — open in a new tab from marketing */
	communityUrl: 'https://community.alphamail.xyz',
	email: 'hello@alphamail.xyz',
	addressFr: 'Belgique · France',
	addressEn: 'Belgium · France',
	descriptionFr:
		'Alpha Mail — Mail, Tasks, AI threads et Files Entered the Chat. Commentez en privé derrière le mail public, dans un seul Space.',
	descriptionEn:
		'Alpha Mail — Mail, Tasks, AI threads, and Files Entered the Chat. Private comments behind public mail, in one Space.',
	ogImage: 'https://alphamail.xyz/media/og.jpg'
};

/** Home carousel + Product page sections (order matters). */
export const pillars = [
	{ id: 'mail' },
	{ id: 'drive' },
	{ id: 'chat' },
	{ id: 'projects' }
];

/** @deprecated use pillars */
export const services = pillars;
