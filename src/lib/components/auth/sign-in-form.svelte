<script lang="ts">
	import { signInWithEmail } from "$lib/auth";
	import { signInSchema, type SignInSchema } from "$lib/schemas/sign-in";
	import {
		superForm,
		type Infer,
		type SuperValidated,
	} from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { Input } from "$lib/components/ui/input";
	import Button from "$lib/components/ui/button/button.svelte";
	let { data }: { data: SuperValidated<Infer<SignInSchema>> } = $props();

	import * as Form from "$lib/components/ui/form";
	import { toast } from "svelte-sonner";

	const form = superForm(data, {
		validators: zodClient(signInSchema),
		dataType: "json",
		SPA: true,
		resetForm: false,
		clearOnSubmit: "errors-and-message",
		async onUpdate({ form }) {
			if (!form.valid) return;
			try {
				const { data } = form;
				const { email, password } = data;
				await signInWithEmail(email, password);
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
		<Form.Control >
			  {#snippet children({ props })}
        <Form.Label>Email</Form.Label>
        <Input {...props} bind:value={$formData.email}  placeholder="you@email.com"/>
      {/snippet}
			
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control >
			  {#snippet children({ props })}

			<div class="flex w-full items-center justify-between">
				<Form.Label>Password</Form.Label>
				<Button variant="link" class="text-sm" href="/reset-password "
					>I forgot my password</Button
				>
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
