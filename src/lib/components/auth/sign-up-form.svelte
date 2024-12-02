<script lang="ts">
  import { firekitAuth } from "$lib/firebase/auth/auth.js";

  import * as Form from "../ui/form/index.js";
  import { Input } from "../ui/input/index.js";
  import { signUpSchema } from "../../schemas/sign-up.js";
  import { toast } from "svelte-sonner";
  import { superForm, defaults } from "sveltekit-superforms";
  import { valibot } from "sveltekit-superforms/adapters";
  import Button from "../ui/button/button.svelte";
  import Checkbox from "../ui/checkbox/checkbox.svelte";
  import { goto } from "$app/navigation";

  let {
    labelFisrtName,
    labelLastName,
    labelEmail,
    labelPassword,
    linkTerms,
    labelTerms,
    labelLinkTerms,
    labelBtnFormEmail,
    redirectTo,
  }: {
    labelFisrtName: string;
    labelLastName: string;
    labelEmail: string;
    labelPassword: string;
    linkTerms: string;
    labelTerms: string;
    labelLinkTerms: string;
    labelBtnFormEmail: string;
    redirectTo: string;
  } = $props();

  const data = defaults(valibot(signUpSchema));

  const form = superForm(data, {
    validators: valibot(signUpSchema),
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
        await firekitAuth.registerWithEmail(email, password, displayName);
        toast.success("Account created successfully");
        goto(redirectTo)
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
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>{labelFisrtName}</Form.Label>
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
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>{labelLastName}</Form.Label>
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
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>{labelEmail}</Form.Label>
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
        <Form.Label>{labelPassword}</Form.Label>
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
  <Form.Field {form} name="agreeToTerms">
    <Form.Control>
      {#snippet children({ props })}
        <Checkbox {...props} bind:checked={$formData.agreeToTerms} />

        <Form.Label>
          {labelTerms}
          <Button variant="link" href={linkTerms} class="p-0"
            >{labelLinkTerms}</Button
          >
        </Form.Label>
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button class="w-full">{labelBtnFormEmail}</Form.Button>
</form>
