export const site = {
	name: 'Alpha Mail',
	shortName: 'Alpha',
	url: 'https://alphamail.xyz',
	email: 'hello@alphamail.xyz',
	addressFr: 'Belgique · France',
	addressEn: 'Belgium · France',
	descriptionFr:
		'Alpha Mail — un Space pour votre groupe. Mail, Drive, Chat et Projets. Privé par défaut, public quand vous voulez.',
	descriptionEn:
		'Alpha Mail — a Space for your group. Mail, Drive, Chat, and Projects. Private by default, public when you choose.',
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
