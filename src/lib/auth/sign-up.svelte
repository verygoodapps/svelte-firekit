<script lang="ts">
  import SignInWithGoogle from "$lib/components/auth/google-sign-in.svelte";
  import SignUpForm from "$lib/components/auth/sign-up-form.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  // let { title = "Sign up" }: { title: string } = $props();

  let {
    title = "Sign up",
    subtitle = "Already have an account?",
    labelLink = "Sign in here",
    link = "/sign-in",
    labelBtnGoogle = "Sign up with",
    labelFisrtName = "First Name",
    labelLastName = "Last Name",
    labelEmail = "Email",
    labelPassword = "Password",
    linkTerms = "/terms-and-conditions",
    labelTerms = "I accept the",
    labelLinkTerms = "Terms and Conditions",
    labelBtnFormEmail = "Sign up",
    labelDivider = "Or",
    redirectTo = "/dashboard",
  }: {
    title?: string;
    subtitle?: string;
    labelLink?: string;
    link?: string;
    labelBtnGoogle?: string;
    labelFisrtName?: string;
    labelLastName?: string;
    labelEmail?: string;
    labelPassword?: string;
    linkTerms?: string;
    labelTerms?: string;
    labelLinkTerms?: string;
    labelBtnFormEmail?: string;
    labelDivider?: string;
    redirectTo?: string;
  } = $props();
</script>

<Card.Root class="sm:w-[448px]">
  <Card.Header>
    <Card.Title class="text-center text-2xl">{title}</Card.Title>
    <Card.Description class="text-center">
      {subtitle}
      <Button variant="link" href={link} class="p-0">{labelLink}</Button>
    </Card.Description>
  </Card.Header>
  <Card.Content class="space-y-5">
    <SignInWithGoogle label={labelBtnGoogle} />

    <div
      class="before:muted-foreground after:muted-foreground flex items-center text-xs uppercase text-muted-foreground before:me-6 before:flex-1 before:border-t after:ms-6 after:flex-1 after:border-t dark:before:border-muted-foreground dark:after:border-muted-foreground"
    >
      {labelDivider}
    </div>

    <SignUpForm
      {labelFisrtName}
      {labelLastName}
      {labelEmail}
      {labelPassword}
      {linkTerms}
      {labelTerms}
      {labelLinkTerms}
      {labelBtnFormEmail}
      {redirectTo}
    />
  </Card.Content>
</Card.Root>
