# @svelte-firekit/auth-guard

Authentication guard for Svelte applications using Firebase authentication, part of the svelte-firekit library.

## Installation

```bash
npm install @svelte-firekit/auth-guard
```

## Basic Usage

```typescript
import { firekitAuthGuard } from '@svelte-firekit/auth-guard';

// In your route component or load function
await firekitAuthGuard.requireAuth();
```

## API

### Main Methods

#### `validateAuth(config: GuardConfig)`

```typescript
interface GuardConfig {
    authRequired?: boolean;
    redirectTo?: string;
    requiredClaims?: string[];
    requiredData?: (data: DocumentData | null) => boolean;
    allowIf?: (user: typeof firekitUser) => boolean;
    redirectParams?: Record<string, string>;
}

await firekitAuthGuard.validateAuth({
    requiredClaims: ['admin'],
    redirectTo: '/unauthorized'
});
```

#### `requireAuth(redirectTo?: string, redirectParams?: Record<string, string>)`
```typescript
await firekitAuthGuard.requireAuth('/login');
```

#### `requireNoAuth(redirectTo?: string, redirectParams?: Record<string, string>)`
```typescript
await firekitAuthGuard.requireNoAuth('/dashboard');
```

#### `requireClaims(claims: string[], redirectTo?: string, redirectParams?: Record<string, string>)`
```typescript
await firekitAuthGuard.requireClaims(['admin'], '/unauthorized');
```

#### `requireData(validator: (data: DocumentData | null) => boolean, redirectTo?: string, redirectParams?: Record<string, string>)`
```typescript
await firekitAuthGuard.requireData(
    (data) => data?.isProfileComplete === true,
    '/complete-profile'
);
```

### Properties

- `loading`: Boolean indicating validation status
- `error`: Error object if validation fails

## Examples

### Protected Route
```typescript
// +page.ts
export const load = async () => {
    await firekitAuthGuard.requireAuth();
};
```

### Admin Route
```typescript
// +page.ts
export const load = async () => {
    await firekitAuthGuard.requireClaims(['admin']);
};
```

### Profile Completion Check
```typescript
// +page.ts
export const load = async () => {
    await firekitAuthGuard.requireData(
        (data) => data?.profileComplete === true
    );
};
```

## Features

- Route protection based on authentication status
- Custom claim validation
- Data-dependent access control 
- Configurable redirects with parameters
- Throttling to prevent redirect loops
- Type-safe configuration

## License
