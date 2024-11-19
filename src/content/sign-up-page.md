---
slug: "sign-up-page"
title: "Sign Up Page in Svelte Firekit"
description: "Comprehensive guide to implementing user registration in your SvelteKit application using Svelte Firekit's authentication components, including Google OAuth and email/password registration."
---

# Sign Up Page in Svelte Firekit

## Overview

The Svelte Firekit sign-up page provides a flexible and secure user registration interface that supports multiple authentication methods, including Google OAuth and email/password registration.

## Component Structure

```svelte
// src/routes/auth/sign-up.svelte
```

Key components:
- `SignInWithGoogle`: Handles Google OAuth registration
- `SignUpForm`: Manages email/password registration
- `Card` components: Provide consistent styling and layout

## Installation

1. Install dependencies:

```bash
npm install @svelte-firekit/auth
```

2. Import components:

```typescript
import SignInWithGoogle from "$lib/components/auth/google-sign-in.svelte";
import SignUpForm from "$lib/components/auth/sign-up-form.svelte";
import Button from "$lib/components/ui/button/button.svelte";
import * as Card from "$lib/components/ui/card";
```

## Component Properties

```typescript
interface SignUpProps {
    title?: string; // Optional title, defaults to "Sign up"
}
```

## Basic Implementation

```svelte
<script lang="ts">
    let { title = "Sign up" }: { title: string } = $props();
</script>

<Card.Root class="sm:w-[448px]">
    <Card.Header>
        <Card.Title class="text-center text-2xl">{title}</Card.Title>
        <Card.Description>
            Already have an account?
            <Button variant="link" href="/sign-in">Sign in here</Button>
        </Card.Description>
    </Card.Header>
    <Card.Content class="space-y-5">
        <SignInWithGoogle label="Sign up" />
        <div>Or</div>
        <SignUpForm />
    </Card.Content>
</Card.Root>
```

## Authentication Flow

1. **Google OAuth Registration**
   - Click "Sign up with Google"
   - Authenticate via Google account
   - Create or link Firebase account

2. **Email/Password Registration**
   - Enter email and password
   - Validate input
   - Create Firebase user account

## Security Considerations

1. **Input Validation**
   ```typescript
   const validateSignUp = (email: string, password: string) => {
     // Implement robust validation
     if (!isValidEmail(email)) throw new Error('Invalid email');
     if (password.length < 8) throw new Error('Password too short');
   };
   ```

2. **Error Handling**
   ```typescript
   try {
     await createUserWithEmailAndPassword(auth, email, password);
   } catch (error) {
     switch (error.code) {
       case 'auth/email-already-in-use':
         // Handle existing account
         break;
       // Other error cases
     }
   }
   ```

## Customization Options

1. **Styling**
   ```typescript
   <Card.Root class="custom-signup-card sm:w-[448px]">
     {/* Custom card styling */}
   </Card.Root>
   ```

2. **Additional Fields**
   ```typescript
   <SignUpForm 
     additionalFields={[
       { name: 'fullName', type: 'text', required: true }
     ]} 
   />
   ```

## Best Practices

1. Validate all user inputs
2. Implement strong password requirements
3. Use HTTPS for all authentication routes
4. Add rate limiting to prevent abuse
5. Provide clear error messaging

## Testing Strategies

```typescript
import { render, fireEvent } from '@testing-library/svelte';

test('signup form submission', async () => {
  const { getByLabelText, getByText } = render(SignUpPage);
  // Test form submission logic
});
```

## Common Troubleshooting

1. **OAuth Issues**
   - Verify Firebase configuration
   - Check Google Developer Console settings

2. **Form Submission Errors**
   - Validate Firebase rules
   - Check network connectivity
   - Review error logs

## Related Components

- `SignInForm`: User login component
- `PasswordResetForm`: Password recovery
- `AuthGuard`: Route protection

## Additional Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [SvelteKit Authentication Guide](https://kit.svelte.dev/docs/authentication)