import { derived } from 'svelte/store';
import { locale } from '$lib/prefs';

export { locale, setLocale } from '$lib/prefs';

const dict = {
	fr: {
		navProduct: 'Produit',
		navPricing: 'Tarifs',
		navCommunity: 'Community',
		navContact: 'Contact',
		navSettings: 'Réglages',
		settingsLang: 'Langue',
		settingsTheme: 'Apparence',
		themeLight: 'Clair',
		themeDark: 'Sombre',
		themeSystem: 'Système',
		heroTitle: "Des Spaces d'équipe ouverts",
		heroTitleSr: 'Mail, Tasks, AI threads et Files Entered the Chat',
		heroEntered: 'Entered the Chat',
		heroWords: ['Mail', 'Tasks', 'AI threads', 'Files'],
		heroDesc: 'Commentez en privé derrière le mail public. Tout remonte dans le même fil.',
		heroComposerPh: 'Écrire dans le Space…',
		heroScenes: [
			[
				{ kind: 'context', text: 'Mail · Re: Acompte salle' },
				{
					kind: 'in',
					name: 'Maya',
					hue: 265,
					text: 'On couvre l’acompte depuis ops ?'
				},
				{ kind: 'out', text: 'Oui. Je réponds et j’ajoute Jules.' },
				{ kind: 'in', name: 'Jules', hue: 195, text: 'Ok. Je prépare la réponse.' }
			],
			[
				{ kind: 'context', text: 'Task · Publier la page tarifs' },
				{
					kind: 'in',
					name: 'Alex',
					hue: 145,
					text: 'Bloqué sur le copy du hero.'
				},
				{ kind: 'out', text: 'Brouillon dans Notes, je te tague.' },
				{ kind: 'in', name: 'Sam', hue: 35, text: 'Repris. Demain matin.' }
			],
			[
				{ kind: 'context', text: 'AI · Résumer la boîte' },
				{
					kind: 'in',
					name: 'Alpha',
					hue: 285,
					text: '3 fils demandent une réponse aujourd’hui.'
				},
				{ kind: 'out', text: 'Rédige les réponses pour la salle.' },
				{
					kind: 'in',
					name: 'Alpha',
					hue: 285,
					text: 'Deux brouillons prêts. À valider avant envoi.'
				}
			],
			[
				{ kind: 'context', text: 'Drive · brand-kit.zip' },
				{
					kind: 'in',
					name: 'Lea',
					hue: 210,
					text: 'Derniers logos dans Shared/Brand.'
				},
				{ kind: 'out', text: 'Tu peux aussi dropper le SVG ?' },
				{ kind: 'in', name: 'Lea', hue: 210, text: 'Ajouté. Dossier épinglé.' }
			]
		],
		heroCta: 'Essayer gratuitement',
		navTry: 'Essayer gratuitement',
		privateTitle: 'Ce qui reste entre vous.',
		privateSub: 'Mail dehors. Collaboration dedans, chiffrée, sur votre domaine.',
		privateCards: [
			{
				title: 'Mail comme fondation',
				description:
					'De vraies boîtes sur votre domaine. Commentez en privé avant d’envoyer, comme une vraie équipe.'
			},
			{
				title: 'Fichiers, chiffrés',
				description:
					'Le Drive du Space est la source de vérité. Vous publiez seulement ce que vous choisissez.'
			},
			{
				title: 'Un fil pour tout le travail',
				description:
					'Commentaires sur mails, tâches et notes dans le même chat. Projets et fichiers au même endroit.'
			}
		],
		publicTitle: 'Quand vous voulez du public.',
		publicSub: 'Community ouvre une couche tournée vers le public, sans quitter le Space.',
		publicCards: [
			{
				title: 'Lettres, quand vous voulez',
				description:
					'Lettres et actus sous votre toit. Privé par défaut — public sur décision.'
			},
			{
				title: 'Forum pour les membres',
				description:
					'Fils, voix et mémoire collective sur community.votredomaine.'
			},
			{
				title: 'Présence publique du groupe',
				description:
					'Une présence claire pour le monde, branchée sur le même Space.'
			}
		],
		pillarsTitle: 'Ce que vous avez',
		pillarsSub: 'Quatre piliers. Ajoutez Community pour le côté public.',
		learnMore: 'En savoir plus',
		pricingEyebrow: 'Tarifs',
		pricingTitle: 'Simple, par Space.',
		pricingSub: 'Mail et Drive inclus. Ajoutez Chat, Projets et Community quand vous en avez besoin.',
		pricingTiers: [
			{
				id: 'free',
				name: 'Free',
				price: 'Gratuit',
				priceMuted: true,
				desc: 'Pour essayer un Space sur votre domaine.',
				features: [
					'Mail et Drive inclus',
					'Jusqu’à 5 personnes',
					'Votre domaine',
					'Invitations par QR'
				],
				cta: 'Essayer gratuitement',
				primary: true
			},
			{
				id: 'space',
				name: 'Space',
				price: '29 €',
				suffix: '/ mois',
				desc: 'Le Space complet pour votre groupe.',
				features: [
					'Tout Free',
					'Chat, Projets et Community',
					'Personnes illimitées',
					'Stockage étendu',
					'Support humain'
				],
				cta: 'Obtenir un Space',
				primary: true,
				featured: true
			},
			{
				id: 'enterprise',
				name: 'Enterprise',
				price: 'Custom',
				priceMuted: true,
				desc: 'Multi-Space, SSO et déploiements privés.',
				features: [
					'Tout Space',
					'Plusieurs Spaces',
					'SSO / admin org',
					'SLA dédié',
					'Hébergement adapté'
				],
				cta: 'Nous écrire',
				primary: false
			}
		],
		communityTitle: 'Community',
		communitySub:
			'Lettres, fils, actus et voix des membres sous votre toit. Plus que des posts: la couche publique du Space.',
		communityCta: 'Ouvrir Community',
		communitySoon: 'Community vit sur son propre sous-domaine — une app forum, pas une page marketing.',
		howTitle: 'Un Space, votre domaine',
		howSub:
			'Des comptes pour de vraies personnes. Admin est un rôle, pas une boîte partagée. Vous invitez avec un QR.',
		closeTitle: 'Un Space ouvert. Votre domaine. Vos gens.',
		closeSub: 'Commencez gratuitement. Ajoutez ce dont vous avez besoin ensuite.',
		closeCta: 'Essayer gratuitement',
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
				desc: 'Commentaires sur mails, tâches et notes dans le même fil.',
				long: 'Chat de groupe et commentaires sur les objets du Space. Tout remonte dans le fil. L’historique reste sur le Drive.'
			},
			projects: {
				name: 'Projets',
				desc: 'Projets, tâches et notes dans le même Space que le mail et les fichiers.',
				long: 'Projets, tâches, notes et planning sans un second abonnement. Ouvert pour y brancher d’autres types de contenu plus tard.'
			}
		}
	},
	en: {
		navProduct: 'Product',
		navPricing: 'Pricing',
		navCommunity: 'Community',
		navContact: 'Contact',
		navSettings: 'Settings',
		settingsLang: 'Language',
		settingsTheme: 'Appearance',
		themeLight: 'Light',
		themeDark: 'Dark',
		themeSystem: 'System',
		heroTitle: 'Open-ended team Spaces',
		heroTitleSr: 'Mail, Tasks, AI threads, and Files Entered the Chat',
		heroEntered: 'Entered the Chat',
		heroWords: ['Mail', 'Tasks', 'AI threads', 'Files'],
		heroDesc: 'Private comments behind public mail. Everything lands in the same feed.',
		heroComposerPh: 'Message the Space…',
		heroScenes: [
			[
				{ kind: 'context', text: 'Mail · Re: Venue deposit' },
				{
					kind: 'in',
					name: 'Maya',
					hue: 265,
					text: 'Can we cover the deposit from ops?'
				},
				{ kind: 'out', text: "Yes. I'll reply and loop Jules in." },
				{ kind: 'in', name: 'Jules', hue: 195, text: 'On it. Drafting a reply.' }
			],
			[
				{ kind: 'context', text: 'Task · Ship pricing page' },
				{
					kind: 'in',
					name: 'Alex',
					hue: 145,
					text: 'Blocked on copy for the hero.'
				},
				{ kind: 'out', text: "Draft's in Notes. Tagging you." },
				{ kind: 'in', name: 'Sam', hue: 35, text: 'Picked up. ETA tomorrow.' }
			],
			[
				{ kind: 'context', text: 'AI · Summarize inbox' },
				{
					kind: 'in',
					name: 'Alpha',
					hue: 285,
					text: '3 threads need a reply today.'
				},
				{ kind: 'out', text: 'Draft replies for the venue ones.' },
				{
					kind: 'in',
					name: 'Alpha',
					hue: 285,
					text: 'Two drafts ready. Review before send?'
				}
			],
			[
				{ kind: 'context', text: 'Drive · brand-kit.zip' },
				{
					kind: 'in',
					name: 'Lea',
					hue: 210,
					text: 'Latest logos are in Shared/Brand.'
				},
				{ kind: 'out', text: 'Can you drop the SVG mark too?' },
				{ kind: 'in', name: 'Lea', hue: 210, text: 'Added. Folder pinned.' }
			]
		],
		heroCta: 'Try for free',
		navTry: 'Try for free',
		privateTitle: 'What stays between you.',
		privateSub: 'Mail on the outside. Collaboration inside, encrypted, on your domain.',
		privateCards: [
			{
				title: 'Mail as the foundation',
				description:
					'Real mailboxes on your domain. Comment privately before you send, like a real team.'
			},
			{
				title: 'Files, encrypted',
				description:
					'The Space Drive is source of truth. Publish only what you choose.'
			},
			{
				title: 'One feed for the work',
				description:
					'Comments on mail, tasks, and notes land in the same chat. Projects and files stay beside them.'
			}
		],
		publicTitle: 'When you want a public side.',
		publicSub: 'Community opens a public-facing layer without leaving the Space.',
		publicCards: [
			{
				title: 'Letters, when you choose',
				description:
					'Letters and updates under your roof. Private by default — public on purpose.'
			},
			{
				title: 'Forum for members',
				description:
					'Threads, voices, and shared memory on community.yourdomain.'
			},
			{
				title: 'Public presence for the group',
				description:
					'A clear public-facing presence, wired to the same Space.'
			}
		],
		pillarsTitle: 'What you get',
		pillarsSub: 'Four pillars. Add Community when you need a public side.',
		learnMore: 'Learn more',
		pricingEyebrow: 'Pricing',
		pricingTitle: 'Simple, per Space.',
		pricingSub: 'Mail and Drive included. Add Chat, Projects, and Community when you need them.',
		pricingTiers: [
			{
				id: 'free',
				name: 'Free',
				price: 'Free',
				priceMuted: true,
				desc: 'Try a Space on your own domain.',
				features: [
					'Mail and Drive included',
					'Up to 5 people',
					'Your domain',
					'QR invites'
				],
				cta: 'Try for free',
				primary: true
			},
			{
				id: 'space',
				name: 'Space',
				price: '€29',
				suffix: '/ month',
				desc: 'The full Space for your group.',
				features: [
					'Everything in Free',
					'Chat, Projects, and Community',
					'Unlimited people',
					'Expanded storage',
					'Human support'
				],
				cta: 'Get a Space',
				primary: true,
				featured: true
			},
			{
				id: 'enterprise',
				name: 'Enterprise',
				price: 'Custom',
				priceMuted: true,
				desc: 'Multi-Space, SSO, and private deployments.',
				features: [
					'Everything in Space',
					'Multiple Spaces',
					'SSO / org admin',
					'Dedicated SLA',
					'Tailored hosting'
				],
				cta: 'Contact us',
				primary: false
			}
		],
		communityTitle: 'Community',
		communitySub:
			'Letters, threads, updates, and member voices under your roof. More than posts: a living public layer for the Space.',
		communityCta: 'Open Community',
		communitySoon: 'Community lives on its own subdomain — a forum app, not a marketing page.',
		howTitle: 'One Space, your domain',
		howSub:
			'Accounts are real people. Admin is a role, not a shared inbox. Invite with a QR.',
		closeTitle: 'An open Space. Your domain. Your people.',
		closeSub: 'Start free. Add what you need later.',
		closeCta: 'Try for free',
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
				desc: 'Comments on mail, tasks, and notes in the same feed.',
				long: 'Group chat and comments on Space objects. Everything lands in the feed. History stays on Drive.'
			},
			projects: {
				name: 'Projects',
				desc: 'Projects, tasks, and notes in the same Space as mail and files.',
				long: 'Projects, tasks, notes, and planning without a second subscription. Open-ended so teams can grow past the defaults later.'
			}
		}
	}
};

/** @type {import('svelte/store').Readable<typeof dict.fr>} */
export const t = derived(locale, ($l) => dict[$l] || dict.en);
