---
slug: "sign-in-page"
title: "Authentication Components in Svelte Firekit"
description: "Learn how to implement authentication in your SvelteKit application using Svelte Firekit's pre-built authentication components, including Google Sign-in and email/password authentication."
---

# Authentication Components in Svelte Firekit

## Overview

The Svelte Firekit authentication system provides a set of pre-built components for implementing user authentication in your SvelteKit application. This guide covers the implementation of a complete authentication page with both Google OAuth and email/password sign-in options.

## Component Structure

```svelte
// src/routes/auth/sign-in.svelte
```

The sign-in page is composed of several modular components:

- `SignInWithGoogle`: Handles Google OAuth authentication
- `SignInForm`: Manages email/password authentication
- `Card` components: Provide consistent styling and layout

## Import

Import the necessary components:

```typescript
import SignInWithGoogle from "$lib/components/auth/google-sign-in.svelte";
import SignInForm from "$lib/components/auth/sign-in-form.svelte";
import Button from "$lib/components/ui/button/button.svelte";
import * as Card from "$lib/components/ui/card/index.js";
```

## Component Properties

The sign-in component accepts the following props:

```typescript
interface SignInProps {
    title?: string; // Optional title for the sign-in card (defaults to "Sign in")
}
```

## Usage

### Basic Implementation

```svelte
<script lang="ts">
    let { title = "Sign in" }: { title?: string } = $props();
</script>

<Card.Root class="sm:w-[448px]">
    <!-- Component content -->
</Card.Root>
```

### Component Breakdown

1. **Card Header**
```svelte
<Card.Header>
    <Card.Title class="text-center text-2xl">{title}</Card.Title>
    <Card.Description class="text-center">
        Don't have an account yet?
        <Button variant="link" href="/sign-up" class="p-0">
            Sign up here
        </Button>
    </Card.Description>
</Card.Header>
```

2. **Authentication Options**
```svelte
<Card.Content class="space-y-5">
    <SignInWithGoogle label="Sign in" />
    <!-- Divider -->
    <div class="before:muted-foreground after:muted-foreground flex items-center text-xs uppercase text-muted-foreground before:me-6 before:flex-1 before:border-t after:ms-6 after:flex-1 after:border-t dark:before:border-muted-foreground dark:after:border-muted-foreground">
        Or
    </div>
    <SignInForm />
</Card.Content>
```

## Styling

The component uses Tailwind CSS for styling with the following key classes:

- `sm:w-[448px]`: Sets the card width on small screens and up
- `space-y-5`: Adds vertical spacing between authentication options
- `text-center`: Centers text content
- `text-2xl`: Sets large text size for the title
- `text-muted-foreground`: Applies muted text color
- Dark mode support with `dark:` prefixed classes

## Best Practices

1. **Error Handling**
   - Implement proper error handling in both `SignInWithGoogle` and `SignInForm` components
   - Display user-friendly error messages
   - Handle network errors gracefully

2. **Security**
   - Always use HTTPS in production
   - Implement rate limiting for authentication attempts
   - Follow Firebase security best practices

3. **User Experience**
   - Provide clear feedback during authentication process
   - Implement proper loading states
   - Ensure responsive design works across all device sizes

4. **Accessibility**
   - Maintain proper heading hierarchy
   - Ensure all interactive elements are keyboard accessible
   - Include proper ARIA labels where necessary

## Related Components

- `SignUpForm`: For new user registration
- `PasswordReset`: For password recovery functionality
- `AuthGuard`: For protecting routes that require authentication

## Example: Complete Implementation

```svelte
<script lang="ts">
    import SignInWithGoogle from "$lib/components/auth/google-sign-in.svelte";
    import SignInForm from "$lib/components/auth/sign-in-form.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Card from "$lib/components/ui/card/index.js";
    
    let { title = "Sign in" }: { title?: string } = $props();
</script>

<Card.Root class="sm:w-[448px]">
    <Card.Header>
        <Card.Title class="text-center text-2xl">{title}</Card.Title>
        <Card.Description class="text-center">
            Don't have an account yet?
            <Button variant="link" href="/sign-up" class="p-0">
                Sign up here
            </Button>
        </Card.Description>
    </Card.Header>
    <Card.Content class="space-y-5">
        <SignInWithGoogle label="Sign in" />
        <div class="before:muted-foreground after:muted-foreground flex items-center text-xs uppercase text-muted-foreground before:me-6 before:flex-1 before:border-t after:ms-6 after:flex-1 after:border-t dark:before:border-muted-foreground dark:after:border-muted-foreground">
            Or
        </div>
        <SignInForm />
    </Card.Content>
</Card.Root>
```

## Troubleshooting

Common issues and their solutions:

1. **Google Sign-in Not Working**
   - Verify Firebase configuration
   - Check if Google Auth provider is enabled in Firebase Console
   - Ensure proper OAuth origins are configured

2. **Styling Issues**
   - Confirm Tailwind CSS is properly configured
   - Check for class name conflicts
   - Verify dark mode configuration

3. **Form Submission Errors**
   - Check Firebase rules
   - Verify email/password requirements
   - Console for detailed error messages

## Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)