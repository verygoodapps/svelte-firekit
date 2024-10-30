<script lang="ts">
	import { registerWithEmail } from "$lib/auth";
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
	import { signUpSchema, type SignUpSchema } from "$lib/schemas/sign-up";
	import { toast } from "svelte-sonner";
	import {
		type SuperValidated,
		type Infer,
		superForm,
	} from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";

	let { data }: { data: SuperValidated<Infer<SignUpSchema>> } = $props();

	const form = superForm(data, {
		validators: zodClient(signUpSchema),
		dataType: "json",
		SPA: true,
		resetForm: false,
		clearOnSubmit: "errors-and-message",
		async onUpdate({ form }) {
			if (!form.valid) return;
			try {
				const { data } = form;
				const { email, password, firstName, lastName } = data;
				const displayName = `${firstName} ${lastName}`;
				await registerWithEmail(email, password, displayName);
				toast.success("Account created successfully");
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
	<div class="grid grid-cols-2 gap-4">
		<Form.Field {form} name="firstName">
			<Form.Control >
				  {#snippet children({ props })}

				<Form.Label>First Name</Form.Label>
				<Input
					{...props}
					bind:value={$formData.firstName}
					placeholder="John"
				/>
      {/snippet}

			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="lastName">
			<Form.Control >
				  {#snippet children({ props })}

				<Form.Label>First Name</Form.Label>
				<Input
					{...props}
					bind:value={$formData.lastName}
					placeholder="Smith"
				/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>
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

			<Form.Label>Password</Form.Label>
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

	<Form.Button class="w-full">Sign Up</Form.Button>
</form>
