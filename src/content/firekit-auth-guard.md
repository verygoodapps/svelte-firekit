---
slug: auth-guard
title: Authentication Guard
description: Protect your routes and implement complex authorization rules with Svelte Firekit's Auth Guard system. Learn how to secure your SvelteKit application with type-safe, flexible route protection.
---
# Svelte Firekit Auth Guard Documentation

## Overview

The `FirekitAuthGuard` is a powerful authentication and authorization management utility for Svelte Firekit applications. It provides a singleton class for handling route guards, authentication state, and custom authorization rules.

## Features

- 🔒 Route protection
- ⚡ Reactive authentication state
- 🎯 Custom authorization rules
- 📊 Data validation
- 🔑 Claims verification
- 🚦 Navigation control

## Basic Usage

### Setting Up Auth Guard

```typescript
import { firekitAuthGuard } from 'svelte-firekit/auth';

// In your +page.ts or +layout.ts
export const load = async () => {
  await firekitAuthGuard.requireAuth();
};
```

## Core Methods

### validateAuth

The primary method for validating authentication and authorization rules.

```typescript
const config: GuardConfig = {
  authRequired?: boolean;      // Whether authentication is required
  redirectTo?: string;        // Redirect path if validation fails
  requiredClaims?: string[];  // Required Firebase claims
  requiredData?: (data: DocumentData | null) => boolean;  // Custom data validation
  allowIf?: (user: typeof firekitUser) => boolean;       // Custom condition
};

await firekitAuthGuard.validateAuth(config);
```

### Convenience Methods

```typescript
// Require authentication
await firekitAuthGuard.requireAuth('/login');

// Require no authentication (for login pages)
await firekitAuthGuard.requireNoAuth('/dashboard');

// Require specific claims
await firekitAuthGuard.requireClaims(['admin'], '/unauthorized');

// Require specific data conditions
await firekitAuthGuard.requireData(
  (data) => data?.isProfileComplete === true,
  '/complete-profile'
);
```

## Examples

### Basic Route Protection

```typescript
// +layout.ts
export const load = async () => {
  await firekitAuthGuard.requireAuth();
};
```

### Admin Route Protection

```typescript
// admin/+layout.ts
export const load = async () => {
  await firekitAuthGuard.requireClaims(['admin'], '/unauthorized');
};
```

### Profile Completion Check

```typescript
// dashboard/+layout.ts
export const load = async () => {
  await firekitAuthGuard.requireData(
    (data) => {
      return data?.profileComplete === true;
    },
    '/complete-profile'
  );
};
```

### Custom Authorization Rules

```typescript
// premium/+layout.ts
export const load = async () => {
  await firekitAuthGuard.validateAuth({
    allowIf: (user) => user.data?.subscriptionStatus === 'active',
    redirectTo: '/pricing'
  });
};
```

### Login Page Protection

```typescript
// login/+page.ts
export const load = async () => {
  await firekitAuthGuard.requireNoAuth('/dashboard');
};
```

## Error Handling

The guard provides reactive error and loading states:

```typescript
import { firekitAuthGuard } from 'svelte-firekit/auth';

// In your Svelte component
$: loading = firekitAuthGuard.loading;
$: error = firekitAuthGuard.error;
```

### Example with Loading State

```svelte
<script lang="ts">
  import { firekitAuthGuard } from 'svelte-firekit/auth';
</script>

{#if firekitAuthGuard.loading}
  <LoadingSpinner />
{:else if firekitAuthGuard.error}
  <ErrorAlert message={firekitAuthGuard.error.message} />
{:else}
  <slot />
{/if}
```

## Type Definitions

```typescript
type GuardConfig = {
  authRequired?: boolean;
  redirectTo?: string;
  requiredClaims?: string[];
  requiredData?: (data: DocumentData | null) => boolean;
  allowIf?: (user: typeof firekitUser) => boolean;
};
```

## Best Practices

### 1. Centralize Guard Configuration

Create a guard configuration file for your application:

```typescript
// lib/guards.ts
import { firekitAuthGuard } from 'svelte-firekit/auth';

export const guards = {
  async requireAdmin() {
    return firekitAuthGuard.requireClaims(['admin'], '/unauthorized');
  },
  
  async requireSubscription() {
    return firekitAuthGuard.validateAuth({
      allowIf: (user) => user.data?.subscriptionStatus === 'active',
      redirectTo: '/pricing'
    });
  },
  
  async requireCompleteProfile() {
    return firekitAuthGuard.requireData(
      (data) => data?.isProfileComplete === true,
      '/complete-profile'
    );
  }
};
```

### 2. Use in Layouts

Implement guards at the layout level when protecting multiple routes:

```typescript
// routes/admin/+layout.ts
import { guards } from '$lib/guards';

export const load = async () => {
  await guards.requireAdmin();
};
```

### 3. Combine Multiple Conditions

Use `validateAuth` for complex authorization rules:

```typescript
await firekitAuthGuard.validateAuth({
  authRequired: true,
  requiredClaims: ['premium'],
  requiredData: (data) => data?.emailVerified === true,
  allowIf: (user) => user.data?.termsAccepted === true,
  redirectTo: '/unauthorized'
});
```

## Advanced Usage

### Custom Navigation Handling

```typescript
await firekitAuthGuard.validateAuth({
  allowIf: async (user) => {
    const result = await someAsyncCheck(user);
    if (!result.allowed) {
      // Custom navigation logic
      await goto(`/error?reason=${result.reason}`);
      return false;
    }
    return true;
  }
});
```

### Conditional Redirects

```typescript
await firekitAuthGuard.validateAuth({
  redirectTo: (user) => {
    if (!user.isEmailVerified) return '/verify-email';
    if (!user.data?.profileComplete) return '/complete-profile';
    return '/login';
  }
});
```

## Security Considerations

1. Always implement corresponding server-side validation
2. Use Firebase Security Rules as the primary security mechanism
3. Don't rely solely on client-side guards for security
4. Implement proper error handling for failed authentications
5. Consider rate limiting for authentication attempts

## Performance Tips

1. Use layout-level guards for shared protection
2. Implement caching for frequently checked conditions
3. Avoid unnecessary redirects
4. Handle loading states appropriately

For more detailed information and examples, visit the [official documentation](https://svelte-firekit.dev/docs/auth-guard).