<script lang="ts">
	import { firekitAuth } from "$lib/firebase/auth/auth.js";
	import { signInSchema } from "../../schemas/sign-in.js";
	import { superForm, defaults } from "sveltekit-superforms";
	import { Input } from "../ui/input/index.js";
	import Button from "../ui/button/button.svelte";
	import { valibot } from "sveltekit-superforms/adapters";

	const data = defaults(valibot(signInSchema));

	import * as Form from "../ui/form/index.js";
	import { toast } from "svelte-sonner";

	const form = superForm(data, {
		validators: valibot(signInSchema),
		dataType: "json",
		SPA: true,
		resetForm: false,
		clearOnSubmit: "errors-and-message",
		async onUpdate({ form }) {
			if (!form.valid) return;
			try {
				const { data } = form;
				const { email, password } = data;
				await firekitAuth.signInWithEmail(email, password);
				toast.success("Signed in successfully");
			} catch (error) {
				if (error instanceof Error) {
					toast.error(error.message);
				} else {
					toast.error("An error occurred");
				}
			}
		},
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance class="space-y-2">
	<Form.Field {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Email</Form.Label>
				<Input
					{...props}
					bind:value={$formData.email}
					placeholder="you@email.com"
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<div class="flex w-full items-center justify-between">
					<Form.Label>Password</Form.Label>
					<Button
						variant="link"
						class="text-sm"
						href="/reset-password "
					>
						I forgot my password
					</Button>
				</div>
				<Input
					{...props}
					bind:value={$formData.password}
					placeholder="*********"
					type="password"
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="w-full">Sign In</Form.Button>
</form>
