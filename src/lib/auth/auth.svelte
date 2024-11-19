<script lang="ts">
    import SignInWithGoogle from "$lib/components/auth/google-sign-in.svelte";
    import ResetPasswordForm from "$lib/components/auth/reset-password-form.svelte";
    import SignInForm from "$lib/components/auth/sign-in-form.svelte";
    import SignUpForm from "$lib/components/auth/sign-up-form.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Card from "$lib/components/ui/card/index.js";
    let currentForm = $state("sign-in");
</script>

<Card.Root class="sm:w-[448px]">
    <Card.Header>
        <Card.Title class="text-center text-2xl">
            {#if currentForm === "sign-in"}
                Sign in
            {:else if currentForm === "sign-up"}
                Sign up
            {:else if currentForm === "forgot-password"}
                Forgot password
            {/if}
        </Card.Title>
        <Card.Description class="text-center">
            {#if currentForm === "sign-in"}
                Don't have an account yet?
                <Button
                    variant="link"
                    onclick={() => (currentForm = "sign-up")}
                    class="p-0">Sign up here</Button
                >
            {:else if currentForm === "sign-up"}
                Already have an account?
                <Button
                    variant="link"
                    onclick={() => (currentForm = "sign-in")}
                    class="p-0">Sign in here</Button
                >
            {:else if currentForm === "forgot-password"}
                Remember your password?
                <Button
                    variant="link"
                    onclick={() => (currentForm = "sign-in")}
                    class="p-0">Sign in here</Button
                >
            {/if}
        </Card.Description>
    </Card.Header>
    <Card.Content class="space-y-5">
        {#if currentForm !== "forgot-password"}
            <SignInWithGoogle label="Sign in" />

            <div
                class="before:muted-foreground after:muted-foreground flex items-center text-xs uppercase text-muted-foreground before:me-6 before:flex-1 before:border-t after:ms-6 after:flex-1 after:border-t dark:before:border-muted-foreground dark:after:border-muted-foreground"
            >
                Or
            </div>
        {/if}
        {#if currentForm === "sign-in"}
            <SignInForm />
        {:else if currentForm === "sign-up"}
            <SignUpForm />
        {:else if currentForm === "forgot-password"}
            <ResetPasswordForm />
        {/if}
    </Card.Content>
</Card.Root>
