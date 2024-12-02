<script lang="ts">
  import SignInWithGoogle from "$lib/components/auth/google-sign-in.svelte";
  import SignInForm from "$lib/components/auth/sign-in-form.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  let {
    title = "Sign in",
    subtitle = "Don't have an account yet?",
    textLink = "Sign up here",
    link = "/sign-up",
    redirectTo = "/dashboard",
    labelBtnGoogle = "Sign in with",
    labelEmail = "Email",
    labelPassword = "Password",
    labellLinkEmailForm = "I forgot my password",
    linkForgetPassword = "/reset-password",
    labelBtnFormEmail = "Sign",
    labelDivider = "Or",
  }: {
    title?: string;
    subtitle?: string;
    textLink?: string;
    link?: string;
    redirectTo?: string;
    labelBtnGoogle?: string;
    labelEmail?: string;
    labelPassword?: string;
    labellLinkEmailForm?: string;
    linkForgetPassword?: string;
    labelBtnFormEmail?: string;
    labelDivider?: string;
  } = $props();
</script>

<Card.Root class="sm:w-[448px]">
  <Card.Header>
    <Card.Title class="text-center text-2xl">{title}</Card.Title>
    <Card.Description class="text-center">
      {subtitle}
      <Button variant="link" href={link} class="p-0">{textLink}</Button>
    </Card.Description>
  </Card.Header>
  <Card.Content class="space-y-5">
    <SignInWithGoogle label={labelBtnGoogle} />

    <div
      class="before:muted-foreground after:muted-foreground flex items-center text-xs uppercase text-muted-foreground before:me-6 before:flex-1 before:border-t after:ms-6 after:flex-1 after:border-t dark:before:border-muted-foreground dark:after:border-muted-foreground"
    >
      {labelDivider}
    </div>

    <SignInForm
      {labelEmail}
      {labelPassword}
      {labellLinkEmailForm}
      {linkForgetPassword}
      {labelBtnFormEmail}
      {redirectTo}
    />
  </Card.Content>
</Card.Root>
