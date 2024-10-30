<script lang="ts">
    import type { PageData } from "./$types.js";
    import SignInWithGoogle from "$lib/components/auth/google-sign-in.svelte";
    import SignInForm from "$lib/components/auth/sign-in-form.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import { ChevronsRight } from "lucide-svelte";
    import * as Card from "$lib/components/ui/card";

    let { data }: { data: PageData[] } = $props();
</script>

<Card.Root class="sm:w-[448px]">
    <Card.Header>
        <Card.Title>Sign in to access your account.</Card.Title>
        <Card.Description>Keep your links in one place with</Card.Description>
    </Card.Header>
    <Card.Content class="space-y-5">
        <SignInWithGoogle />

        <div
            class="before:muted-foreground after:muted-foreground flex items-center text-xs uppercase text-muted-foreground before:me-6 before:flex-1 before:border-t after:ms-6 after:flex-1 after:border-t dark:before:border-muted-foreground dark:after:border-muted-foreground"
        >
            Or
        </div>

        <SignInForm data={data.form} />
        <p class="text-sm text-muted-foreground">
            New to my app?
            <Button variant="link" href="/sign-up" class="p-0">
                Sign up
                <ChevronsRight class="size-4" />
            </Button>
        </p>
    </Card.Content>
</Card.Root>
