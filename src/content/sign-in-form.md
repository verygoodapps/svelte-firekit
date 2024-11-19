---
slug: "svelte-firekit-signin-form"
title: "Implementing Sign In Forms with Svelte Firekit"
description: "Create secure and user-friendly sign-in forms using Svelte Firekit, SvelteKit SuperForms, and Firebase Authentication"
---

# Sign In Forms with Svelte Firekit

This guide demonstrates how to implement a secure sign-in form using Svelte Firekit with Firebase Authentication, featuring form validation and error handling.

## Features Overview

- Firebase Authentication integration
- Form validation with Valibot
- Password reset functionality
- SuperForms integration
- Toast notifications for user feedback
- Responsive design
- Error handling

## Prerequisites

- SvelteKit project setup
- Firebase project configured
- Svelte Firekit installed
- Required dependencies:
  - sveltekit-superforms
  - svelte-sonner
  - valibot

## Installation

```bash
npm install @firekit/auth sveltekit-superforms svelte-sonner valibot
```

## Basic Implementation

### 1. Import Required Dependencies

```typescript
import { firekitAuth } from "$lib/firebase/auth/auth.js";
import { signInSchema } from "../../schemas/sign-in.js";
import { superForm, defaults } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import * as Form from "../ui/form/index.js";
```

### 2. Sign In Schema

Create a validation schema using Valibot:

```typescript
// schemas/sign-in.js
import { object, string } from 'valibot';

export const signInSchema = object({
    email: string([email()]),
    password: string([minLength(1, "Password is required")])
});
```

### 3. Form Setup

```typescript
const data = defaults(valibot(signInSchema));
const form = superForm(data, {
    validators: valibot(signInSchema),
    dataType: "json",
    SPA: true,
    resetForm: false,
    clearOnSubmit: "errors-and-message"
});
```

### 4. Authentication Handler

```typescript
async onUpdate({ form }) {
    if (!form.valid) return;
    try {
        const { data } = form;
        const { email, password } = data;
        await firekitAuth.signInWithEmail(email, password);
        toast.success("Signed in successfully");
    } catch (error) {
        if (error instanceof Error) {
            toast.error(error.message);
        } else {
            toast.error("An error occurred");
        }
    }
}
```

## Form Structure

### Basic Form Layout

```svelte
<form method="POST" use:enhance class="space-y-2">
    <!-- Email Field -->
    <Form.Field {form} name="email">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Email</Form.Label>
                <Input
                    {...props}
                    bind:value={$formData.email}
                    placeholder="you@email.com"
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <!-- Password Field with Reset Link -->
    <Form.Field {form} name="password">
        <!-- Password field implementation -->
    </Form.Field>
</form>
```

### Password Field with Reset Link

```svelte
<Form.Field {form} name="password">
    <Form.Control>
        {#snippet children({ props })}
            <div class="flex w-full items-center justify-between">
                <Form.Label>Password</Form.Label>
                <Button
                    variant="link"
                    class="text-sm"
                    href="/reset-password"
                >
                    I forgot my password
                </Button>
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
```

## Form Validation

### Client-Side Validation

- Real-time validation using Valibot schemas
- Email format validation
- Required field validation

### Server-Side Validation

- Firebase Authentication validates credentials
- Proper error handling for invalid credentials

## Best Practices

1. **Security**
   - Never store passwords in client-side state
   - Implement proper rate limiting
   - Use HTTPS for all authentication requests
   - Clear sensitive data after form submission

2. **User Experience**
   - Clear error messages
   - Loading states during authentication
   - Toast notifications for success/failure
   - Accessible form controls

3. **Performance**
   - Efficient form state management
   - Proper error boundary implementation
   - Optimized re-rendering

4. **Accessibility**
   - Proper ARIA labels
   - Keyboard navigation
   - Focus management
   - Error announcements

## Error Handling

### Firebase Authentication Errors

```typescript
try {
    await firekitAuth.signInWithEmail(email, password);
    toast.success("Signed in successfully");
} catch (error) {
    if (error instanceof Error) {
        toast.error(error.message);
    } else {
        toast.error("An error occurred");
    }
}
```

## Styling Guidelines

The form uses utility classes for consistent styling:
- `space-y-2` for vertical spacing
- `w-full` for full-width elements
- Flexbox utilities for layout control

## Common Customizations

### 1. Custom Validation Messages

```typescript
const signInSchema = object({
    email: string([
        email("Please enter a valid email address")
    ]),
    password: string([
        minLength(1, "Password is required")
    ])
});
```

### 2. Custom Loading States

```svelte
<Form.Button class="w-full" disabled={loading}>
    {loading ? 'Signing in...' : 'Sign In'}
</Form.Button>
```

## Example Usage

```svelte
<script>
    import SignInForm from './SignInForm.svelte';
</script>

<div class="auth-container">
    <h1>Sign In</h1>
    <SignInForm />
</div>
```

## TypeScript Support

```typescript
interface SignInData {
    email: string;
    password: string;
}

interface SignInFormProps {
    redirectUrl?: string;
    onSuccess?: () => void;
}
```

## Troubleshooting

Common issues and solutions:

1. **Authentication Failures**
   - Verify Firebase configuration
   - Check network connectivity
   - Validate email format
   - Check password requirements

2. **Form Validation Issues**
   - Verify schema configuration
   - Check SuperForms setup
   - Validate form state management

3. **Reset Password Flow**
   - Ensure reset password route exists
   - Verify email service configuration
   - Test error handling

## Contributing

To contribute to Svelte Firekit:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

Svelte Firekit is released under the MIT License.