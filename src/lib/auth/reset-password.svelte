<script lang="ts">
  import ResetPasswordForm from "$lib/components/auth/reset-password-form.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card/index.js";


  let {
    title="Forgot password?",
    subtitle="Remember your password?",
    labelLink="Sign in here",
    link="/sign-in",
    redirect="/sign-in"
  }: {
    title?: string;
    subtitle?: string;
    labelLink?: string;
    link?: string;
    redirect?: string;
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
  <Card.Content>
    <ResetPasswordForm {redirect} />
  </Card.Content>
</Card.Root>
