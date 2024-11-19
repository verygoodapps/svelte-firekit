---
slug: "svelte-firekit-password-reset"
title: "Implementing Password Reset with Svelte Firekit"
description: "Learn how to implement a secure password reset flow using Svelte Firekit and Firebase Authentication"
---

# Password Reset Implementation with Svelte Firekit

This guide demonstrates how to implement a password reset flow using Svelte Firekit and Firebase Authentication, including email verification and user feedback.

## Features Overview

- Password reset email functionality
- Form validation with Valibot
- Toast notifications for user feedback
- Automatic redirection after submission
- Error handling and validation
- SuperForms integration

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
import { goto } from "$app/navigation";
import { firekitAuth } from "$lib/firebase/auth/auth.js";
import { resetPasswordSchema } from "../../schemas/reset-password.js";
import { superForm, defaults } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
```

### 2. Password Reset Schema

```typescript
// schemas/reset-password.js
import { object, string } from 'valibot';

export const resetPasswordSchema = object({
    email: string([
        email("Please enter a valid email address")
    ])
});
```

### 3. Form Setup

```typescript
const data = defaults(valibot(resetPasswordSchema));
const form = superForm(data, {
    validators: valibot(resetPasswordSchema),
    dataType: "json",
    SPA: true,
    resetForm: false,
    clearOnSubmit: "errors-and-message"
});
```

### 4. Password Reset Handler

```typescript
async onUpdate({ form }) {
    if (!form.valid) return;
    try {
        const { data } = form;
        const { email } = data;
        await firekitAuth.sendPasswordReset(email);
        toast.success("Password reset email sent");
        goto("/sign-in");
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
<form method="POST" use:enhance class="space-y-4">
    <Form.Field {form} name="email">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Email address</Form.Label>
                <Input
                    {...props}
                    bind:value={$formData.email}
                    placeholder="you@email.com"
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Button class="w-full">Send Email</Form.Button>
</form>
```

## Password Reset Flow

### 1. User Request
1. User enters their email address
2. Form validates email format
3. Submit triggers password reset email

### 2. Email Delivery
1. Firebase sends reset email
2. User receives confirmation toast
3. Automatic redirect to sign-in page

### 3. User Action
1. User clicks reset link in email
2. Firebase handles password reset page
3. User sets new password

## Best Practices

1. **Security**
   - Rate limit reset requests
   - Validate email format
   - Don't reveal account existence
   - Use secure reset tokens

2. **User Experience**
   - Clear instructions
   - Immediate feedback
   - Helpful error messages
   - Automatic redirection

3. **Email Template**
   - Clear sender identification
   - Simple instructions
   - Time-limited reset links
   - Support contact information

4. **Accessibility**
   - Proper ARIA labels
   - Keyboard navigation
   - Focus management
   - Clear error announcements

## Error Handling

### Common Error Scenarios

```typescript
try {
    await firekitAuth.sendPasswordReset(email);
    toast.success("Password reset email sent");
    goto("/sign-in");
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
- `space-y-4` for vertical spacing
- `w-full` for full-width elements

## Common Customizations

### 1. Custom Email Template

```typescript
// Configure in Firebase Console
const actionCodeSettings = {
    url: 'https://your-app.com/finish-reset-password',
    handleCodeInApp: true
};
```

### 2. Custom Validation Messages

```typescript
const resetPasswordSchema = object({
    email: string([
        email("Please enter the email address associated with your account")
    ])
});
```

## Example Usage

```svelte
<script>
    import PasswordResetForm from './PasswordResetForm.svelte';
</script>

<div class="auth-container">
    <h1>Reset Password</h1>
    <p class="text-muted">
        Enter your email address and we'll send you instructions
        to reset your password.
    </p>
    <PasswordResetForm />
</div>
```

## TypeScript Support

```typescript
interface ResetPasswordData {
    email: string;
}

interface ResetPasswordFormProps {
    redirectUrl?: string;
    onSuccess?: () => void;
}
```

## Firebase Configuration

### 1. Email Template Setup

```typescript
// In Firebase Console
// Authentication > Templates > Password reset

const emailTemplate = {
    subject: "Reset your password",
    message: "Click this link to reset your password: {resetLink}"
};
```

### 2. Action URL Configuration

```typescript
// In Firebase Console
// Authentication > Settings > Action URL
const actionUrl = "https://your-app.com/password-reset";
```

## Troubleshooting

Common issues and solutions:

1. **Email Not Received**
   - Check spam folder
   - Verify email service configuration
   - Check Firebase quotas
   - Validate email format

2. **Reset Link Expired**
   - Configure appropriate token lifetime
   - Clear instructions for users
   - Provide retry option

3. **Rate Limiting**
   - Implement proper cooldown periods
   - Clear user feedback
   - Retry mechanisms

## Security Considerations

1. **Rate Limiting**
   - Implement request limits
   - Use exponential backoff
   - Monitor for abuse

2. **Email Verification**
   - Validate email format
   - Check domain existence
   - Prevent email enumeration

3. **Token Security**
   - Time-limited tokens
   - Single-use tokens
   - Secure token storage

## Contributing

To contribute to Svelte Firekit:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

Svelte Firekit is released under the MIT License.