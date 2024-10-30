<script lang="ts">
	import { goto } from "$app/navigation";
	import { sendPasswordReset } from "$lib/auth.js";
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
	import {
		resetPasswordSchema,
		type ResetPasswordSchema,
	} from "$lib/schemas/reset-password";
	import { toast } from "svelte-sonner";
	import {
		type SuperValidated,
		type Infer,
		superForm,
	} from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";

	let { data }: { data: SuperValidated<Infer<ResetPasswordSchema>> } =
		$props();

	const form = superForm(data, {
		validators: zodClient(resetPasswordSchema),
		dataType: "json",
		SPA: true,
		resetForm: false,
		clearOnSubmit: "errors-and-message",
		async onUpdate({ form }) {
			if (!form.valid) return;
			try {
				const { data } = form;
				const { email } = data;
				await sendPasswordReset(email);
				toast.success("Password reset email sent");
				goto("/sign-in");
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

<form method="POST" use:enhance class="space-y-4">
	<Form.Field {form} name="email">
		<Form.Control >
			  {#snippet children({ props })}
        <Form.Label>Email</Form.Label>
        <Input {...props} bind:value={$formData.email}  placeholder="you@email.com"/>
      {/snippet}
		
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Send Email</Form.Button>
</form>
