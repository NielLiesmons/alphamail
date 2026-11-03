import { derived } from 'svelte/store';
import { locale } from '$lib/prefs';

export { locale, setLocale } from '$lib/prefs';

const dict = {
	fr: {
		navProduct: 'Produit',
		navCommunity: 'Community',
		navContact: 'Contact',
		navSettings: 'Réglages',
		settingsLang: 'Langue',
		settingsTheme: 'Apparence',
		themeLight: 'Clair',
		themeDark: 'Sombre',
		themeSystem: 'Système',
		heroTitle: 'Un chez-soi pour votre groupe',
		heroDesc:
			'Mail, Drive, Chat et Projets dans un seul Space. Privé par défaut. Public quand vous voulez une vitrine.',
		heroSecondary: 'Voir le produit',
		heroCta: 'Créer un Space',
		pillarsTitle: 'Ce que vous avez',
		pillarsSub: 'Quatre piliers. Ajoutez Community pour le côté public.',
		learnMore: 'En savoir plus',
		communityTitle: 'Community',
		communitySub:
			'Lettres, fils, actus et voix des membres sous votre toit. Plus que des posts: la couche publique du Space.',
		communityCta: 'Entrer dans Community',
		communitySoon: 'Bientôt ici. Écrivez-nous pour rejoindre les premiers Spaces.',
		howTitle: 'Un Space, votre domaine',
		howSub:
			'Des comptes pour de vraies personnes. Admin est un rôle, pas une boîte partagée. Vous invitez avec un QR.',
		closeTitle: 'Un Space. Votre domaine. Vos gens.',
		closeCta: 'Obtenir un Space',
		productTitle: 'Produit',
		productSub: 'Mail et Drive toujours là. Le reste selon vos besoins.',
		contactTitle: 'Obtenir un Space',
		contactSub: 'Dites-nous qui vous êtes et ce dont votre groupe a besoin.',
		contactFormName: 'Nom',
		contactFormEmail: 'Email',
		contactFormMessage: 'Message',
		contactFormNamePh: 'Votre nom',
		contactFormEmailPh: 'vous@email.com',
		contactFormMessagePh: 'Groupe, domaine, modules souhaités…',
		contactFormSend: 'Envoyer',
		footerMessageUs: 'Nous écrire',
		footerColProduct: 'Produit',
		footerColCommunity: 'Community',
		footerColContact: 'Contact',
		/* ServiceCarousel still reads $t.services */
		services: {
			mail: {
				name: 'Mail',
				desc: 'Chacun a toi@tondomaine, pas une boîte fourre-tout.',
				long: 'De vraies boîtes mail sur votre domaine. Les gens se connectent avec leur adresse, pas un compte générique partagé. JMAP pour Admin, IMAP pour Apple Mail.'
			},
			drive: {
				name: 'Drive',
				desc: 'Fichiers partagés, à vous. Chiffré. Vous publiez seulement ce que vous voulez.',
				long: 'Drive privé chiffré comme source de vérité. Partagez l’accès au Space, pas un dossier Google. Publiez vers le site public seulement quand vous choisissez.'
			},
			chat: {
				name: 'Chat',
				desc: 'La conversation vit avec les fichiers et les tâches, pas à côté.',
				long: 'Chat de groupe et commentaires sur les objets du Space. L’historique reste sur le Drive. Moins de fils WhatsApp perdus.'
			},
			projects: {
				name: 'Projets',
				desc: 'Projets, tâches et notes pour ceux qui aiment Linear ou ClickUp, dans le même Space.',
				long: 'Projets, tâches, notes et planning sans un second abonnement. Pour les équipes et associations qui veulent du suivi sans le zoo d’outils.'
			}
		}
	},
	en: {
		navProduct: 'Product',
		navCommunity: 'Community',
		navContact: 'Contact',
		navSettings: 'Settings',
		settingsLang: 'Language',
		settingsTheme: 'Appearance',
		themeLight: 'Light',
		themeDark: 'Dark',
		themeSystem: 'System',
		heroTitle: 'A home for your group',
		heroDesc:
			'Mail, Drive, Chat, and Projects in one Space. Private by default. Public when you want a face for the world.',
		heroSecondary: 'See the product',
		heroCta: 'Start a Space',
		pillarsTitle: 'What you get',
		pillarsSub: 'Four pillars. Add Community when you need a public side.',
		learnMore: 'Learn more',
		communityTitle: 'Community',
		communitySub:
			'Letters, threads, updates, and member voices under your roof. More than posts: a living public layer for the Space.',
		communityCta: 'Enter Community',
		communitySoon: 'Coming here soon. Write us to join the first Spaces.',
		howTitle: 'One Space, your domain',
		howSub:
			'Accounts are real people. Admin is a role, not a shared inbox. Invite with a QR.',
		closeTitle: 'One Space. Your domain. Your people.',
		closeCta: 'Get a Space',
		productTitle: 'Product',
		productSub: 'Mail and Drive always on. Everything else as you need it.',
		contactTitle: 'Get a Space',
		contactSub: 'Tell us who you are and what your group needs.',
		contactFormName: 'Name',
		contactFormEmail: 'Email',
		contactFormMessage: 'Message',
		contactFormNamePh: 'Your name',
		contactFormEmailPh: 'you@email.com',
		contactFormMessagePh: 'Group, domain, modules you want…',
		contactFormSend: 'Send',
		footerMessageUs: 'Message us',
		footerColProduct: 'Product',
		footerColCommunity: 'Community',
		footerColContact: 'Contact',
		services: {
			mail: {
				name: 'Mail',
				desc: 'People get you@yourdomain, not a shared dump.',
				long: 'Real mailboxes on your domain. People sign in as themselves, not a shared generic seat. JMAP in Admin, IMAP in Apple Mail.'
			},
			drive: {
				name: 'Drive',
				desc: 'Shared files that stay yours. Encrypted. Publish only what you choose.',
				long: 'Encrypted private Drive as source of truth. Share Space access, not a Google folder. Publish to the public site only when you choose.'
			},
			chat: {
				name: 'Chat',
				desc: 'Conversation that lives with files and tasks, not in a side app.',
				long: 'Group chat and comments on Space objects. History stays on Drive. Fewer lost WhatsApp threads.'
			},
			projects: {
				name: 'Projects',
				desc: 'Projects, tasks, and notes for the Linear / ClickUp crowd, inside the same Space.',
				long: 'Projects, tasks, notes, and planning without a second subscription. For teams and associations that want tracking without the tool zoo.'
			}
		}
	}
};

/** @type {import('svelte/store').Readable<typeof dict.fr>} */
export const t = derived(locale, ($l) => dict[$l] || dict.en);
