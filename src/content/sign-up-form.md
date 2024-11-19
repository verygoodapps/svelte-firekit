---
slug: "svelte-firekit-signup-form"
title: "Implementing Sign Up Forms with Svelte Firekit"
description: "Learn how to create secure, validated sign-up forms with Svelte Firekit, SvelteKit SuperForms, and Firebase Authentication"
---

# Building Sign Up Forms with Svelte Firekit

This guide demonstrates how to implement a secure, validated sign-up form using Svelte Firekit, SvelteKit SuperForms, and Firebase Authentication.

## Features Overview

- Form validation with Valibot
- Real-time error handling
- Firebase Authentication integration
- Terms and conditions acceptance
- Toast notifications
- Responsive grid layout
- SuperForms integration for enhanced form handling

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

### 1. Import Dependencies

```typescript
import { firekitAuth } from "$lib/firebase/auth/auth.js";
import * as Form from "../ui/form/index.js";
import { superForm, defaults } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { signUpSchema } from "../../schemas/sign-up.js";
```

### 2. Form Schema Setup

Create a validation schema using Valibot:

```typescript
// schemas/sign-up.js
import { object, string, boolean } from 'valibot';

export const signUpSchema = object({
    firstName: string(),
    lastName: string(),
    email: string([email()]),
    password: string([minLength(8)]),
    agreeToTerms: boolean([value(true)])
});
```

### 3. Form Initialization

```typescript
const data = defaults(valibot(signUpSchema));
const form = superForm(data, {
    validators: valibot(signUpSchema),
    dataType: "json",
    SPA: true,
    resetForm: false,
    clearOnSubmit: "errors-and-message"
});
```

### 4. Form Submission Handler

```typescript
async onUpdate({ form }) {
    if (!form.valid) return;
    try {
        const { data } = form;
        const { email, password, firstName, lastName } = data;
        const displayName = `${firstName} ${lastName}`;
        
        await firekitAuth.registerWithEmail(
            email,
            password,
            displayName
        );
        toast.success("Account created successfully");
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

### Form Fields Implementation

```svelte
<form method="POST" use:enhance class="space-y-2">
    <!-- Name Fields Grid -->
    <div class="grid grid-cols-2 gap-4">
        <Form.Field {form} name="firstName">
            <Form.Control>
                {#snippet children({ props })}
                    <Form.Label>First Name</Form.Label>
                    <Input
                        {...props}
                        bind:value={$formData.firstName}
                        placeholder="John"
                    />
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
        <!-- Last Name field follows same pattern -->
    </div>

    <!-- Email and Password fields follow similar pattern -->
</form>
```

### Terms and Conditions Implementation

```svelte
<Form.Field {form} name="agreeToTerms">
    <Form.Control>
        {#snippet children({ props })}
            <Checkbox {...props} bind:checked={$formData.agreeToTerms} />
            <Form.Label>
                I accept the
                <Button variant="link" href="/terms-and-conditions">
                    Terms and Conditions
                </Button>
            </Form.Label>
        {/snippet}
    </Form.Control>
    <Form.FieldErrors />
</Form.Field>
```

## Form Validation

### Client-Side Validation

- Real-time validation using Valibot schemas
- Immediate feedback on input errors
- Custom error messages

### Server-Side Integration

- SuperForms handles form submission
- Firebase Authentication validates credentials
- Error handling for authentication failures

## Best Practices

1. **Security**
   - Always validate on both client and server
   - Implement proper password requirements
   - Handle authentication errors gracefully

2. **User Experience**
   - Clear error messages
   - Real-time validation feedback
   - Toast notifications for form submission status

3. **Performance**
   - Use SPA mode for better user experience
   - Implement proper form state management
   - Handle loading states appropriately

4. **Accessibility**
   - Proper ARIA labels
   - Keyboard navigation support
   - Clear error messages

## Error Handling

```typescript
try {
    // Authentication logic
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
- `grid grid-cols-2 gap-4` for responsive layout
- `w-full` for full-width buttons

## Common Customizations

### 1. Custom Validation Messages

```typescript
const signUpSchema = object({
    password: string([
        minLength(8, "Password must be at least 8 characters")
    ])
});
```

### 2. Custom Field Styling

```svelte
<Input
    class="custom-input-class"
    {...props}
    bind:value={$formData.email}
/>
```

## Example Usage

```svelte
<script>
    import SignUpForm from './SignUpForm.svelte';
</script>

<div class="auth-container">
    <h1>Create Account</h1>
    <SignUpForm />
</div>
```

## TypeScript Support

The component includes full TypeScript support:

```typescript
interface SignUpData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    agreeToTerms: boolean;
}
```

## Troubleshooting

Common issues and solutions:

1. **Form Validation Not Working**
   - Ensure schema is properly defined
   - Check SuperForms configuration

2. **Firebase Authentication Errors**
   - Verify Firebase configuration
   - Check network connectivity
   - Validate email format

## Contributing

To contribute to Svelte Firekit:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

Svelte Firekit is released under the MIT License.