<script>
	import PageHero from '$lib/components/PageHero.svelte';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import { site } from '$lib/site';
	import { t } from '$lib/i18n';

	let name = $state('');
	let email = $state('');
	let message = $state('');

	/** @param {SubmitEvent} e */
	function onSubmit(e) {
		e.preventDefault();
		const body = [`Name: ${name}`, `Email: ${email}`, '', message].join('\n');
		window.location.href = `mailto:${site.email}?subject=${encodeURIComponent('Space — Alpha Mail')}&body=${encodeURIComponent(body)}`;
	}
</script>

<svelte:head>
	<title>{$t.contactTitle} – {site.name}</title>
</svelte:head>

<div class="page section page-chrome has-hero contact-hero">
	<PageHero title={$t.contactTitle} description={$t.contactSub} grow>
		<form class="form" id="contact" onsubmit={onSubmit}>
			<div class="row">
				<label class="field">
					<span class="field-label">{$t.contactFormName}</span>
					<input
						class="field-control"
						name="name"
						type="text"
						required
						autocomplete="name"
						placeholder={$t.contactFormNamePh}
						bind:value={name}
					/>
				</label>
				<label class="field">
					<span class="field-label">{$t.contactFormEmail}</span>
					<input
						class="field-control"
						name="email"
						type="email"
						required
						autocomplete="email"
						placeholder={$t.contactFormEmailPh}
						bind:value={email}
					/>
				</label>
			</div>

			<label class="field message-field">
				<span class="field-label">{$t.contactFormMessage}</span>
				<div class="message-wrap">
					<textarea
						class="field-control"
						name="message"
						rows="5"
						required
						placeholder={$t.contactFormMessagePh}
						bind:value={message}
					></textarea>
					<div class="send">
						<PrimaryButton type="submit" size="sm">{$t.contactFormSend}</PrimaryButton>
					</div>
				</div>
			</label>
		</form>
	</PageHero>
</div>

<style>
	.contact-hero {
		padding-bottom: 0;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		text-align: left;
		width: 100%;
	}

	.row {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	@media (min-width: 768px) {
		.row {
			grid-template-columns: 1fr 1fr;
		}
	}

	.field {
		display: block;
		min-width: 0;
	}

	.field :global(.field-label) {
		margin-bottom: 0.4rem;
	}

	.message-wrap {
		position: relative;
	}

	.message-wrap :global(textarea.field-control) {
		padding-bottom: 3.1rem;
		min-height: 8.5rem;
	}

	.send {
		position: absolute;
		right: 0.55rem;
		bottom: 0.55rem;
		z-index: 1;
	}

	.send :global(.btn) {
		height: 32px;
		min-height: 32px;
		padding: 0 0.9rem;
		font-size: 13px;
	}
</style>
