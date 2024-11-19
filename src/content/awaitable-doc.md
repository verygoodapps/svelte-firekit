---
slug: awaitable-doc
title: Awaitable Document
description: Work with real-time Firestore documents using a reactive, type-safe wrapper that provides loading states, error handling, and automatic data synchronization in your Svelte applications.
---

# Awaitable Document

Svelte Firekit's Awaitable Document provides a reactive, type-safe wrapper for working with Firestore documents in real-time. It handles loading states, error management, and automatic data synchronization.

## Features

- 🔄 Real-time document synchronization
- 💪 Type-safe document handling
- ⚡ Reactive state management
- 🚦 Built-in loading states
- ❌ Automatic error handling
- 🎯 Initial data support

## Basic Usage

### Creating an Awaitable Document

```typescript
import { firekitAwaitableDoc } from 'svelte-firekit';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// Create a typed document reference
const userDoc = firekitAwaitableDoc<User>('users/123');
```

### Using in Svelte Components

```svelte
<script lang="ts">
  import { firekitAwaitableDoc } from 'svelte-firekit';
  
  const userDoc = firekitAwaitableDoc<User>('users/123');
</script>

{#if userDoc.loading}
  <LoadingSpinner />
{:else if userDoc.error}
  <ErrorMessage error={userDoc.error} />
{:else if userDoc.data}
  <div>
    <h2>{userDoc.data.name}</h2>
    <p>{userDoc.data.email}</p>
  </div>
{:else}
  <p>No user found</p>
{/if}
```

## API Reference

### Constructor Options

```typescript
firekitAwaitableDoc<T>(
  path: string | DocumentReference<T>,
  startWith?: T
)
```

- `path`: Document path or reference
- `startWith`: Optional initial data before first fetch

### Properties

```typescript
// Current document data
userDoc.data: T | null

// Loading state
userDoc.loading: boolean

// Error state
userDoc.error: Error | null
```

### Methods

```typescript
// Force fetch latest data
const data = await userDoc.getData(): Promise<T | null>
```

## Advanced Usage

### With Initial Data

```typescript
const userDoc = firekitAwaitableDoc<User>('users/123', {
  id: '123',
  name: 'Loading...',
  email: 'loading@example.com',
  createdAt: new Date()
});
```

### Custom Type Definitions

```typescript
interface UserDocument {
  id: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  settings: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  metadata: {
    createdAt: Date;
    lastLogin: Date;
  };
}

const userDoc = firekitAwaitableDoc<UserDocument>('users/123');
```

### Error Handling

```typescript
<script lang="ts">
  import { firekitAwaitableDoc } from 'svelte-firekit';
  
  const userDoc = firekitAwaitableDoc<User>('users/123');
  
  $: if (userDoc.error) {
    console.error('Document error:', userDoc.error);
  }
</script>

{#if userDoc.error}
  {#if userDoc.error.code === 'permission-denied'}
    <AlertError message="You don't have permission to view this user" />
  {:else}
    <AlertError message={userDoc.error.message} />
  {/if}
{/if}
```

## Best Practices

### 1. Type Safety

Always define interfaces for your documents:

```typescript
interface User {
  id: string;
  email: string;
  profile: UserProfile;
  settings: UserSettings;
}

const userDoc = firekitAwaitableDoc<User>('users/123');
```

### 2. Loading States

Handle loading states appropriately:

```svelte
<script lang="ts">
  import { firekitAwaitableDoc } from 'svelte-firekit';
  const userDoc = firekitAwaitableDoc<User>('users/123');
</script>

<div class="user-card {userDoc.loading ? 'loading' : ''}">
  {#if userDoc.loading}
    <Skeleton />
  {:else}
    <UserProfile user={userDoc.data} />
  {/if}
</div>
```

### 3. Error Boundaries

Use Svelte error boundaries with awaitable documents:

```svelte
<script lang="ts">
  import { ErrorBoundary } from 'svelte-firekit/components';
</script>

<ErrorBoundary let:error>
  {#if error}
    <AlertError error={error} />
  {:else}
    <slot />
  {/if}
</ErrorBoundary>
```

### 4. Cleanup

The document subscription is automatically cleaned up when the component is destroyed.

## Examples

### User Profile Management

```svelte
<script lang="ts">
  export let userId: string;
  
  interface UserProfile {
    id: string;
    displayName: string;
    email: string;
    photoURL?: string;
    bio?: string;
    lastUpdated: Date;
  }
  
  const profile = firekitAwaitableDoc<UserProfile>(
    `users/${userId}/profile`
  );
</script>

<div class="profile-card">
  {#if profile.loading}
    <ProfileSkeleton />
  {:else if profile.error}
    <ErrorAlert message="Failed to load profile" />
  {:else if profile.data}
    <img 
      src={profile.data.photoURL ?? '/default-avatar.png'} 
      alt={profile.data.displayName}
    />
    <h2>{profile.data.displayName}</h2>
    <p>{profile.data.bio ?? 'No bio provided'}</p>
    <small>
      Last updated: {profile.data.lastUpdated.toLocaleDateString()}
    </small>
  {:else}
    <p>Profile not found</p>
  {/if}
</div>
```

### Settings Document

```svelte
<script lang="ts">
  interface UserSettings {
    id: string;
    theme: 'light' | 'dark';
    notifications: boolean;
    privacy: {
      profileVisibility: 'public' | 'private';
      showEmail: boolean;
    };
  }
  
  const settings = firekitAwaitableDoc<UserSettings>(
    'users/123/settings',
    {
      id: '123',
      theme: 'light',
      notifications: true,
      privacy: {
        profileVisibility: 'public',
        showEmail: false
      }
    }
  );
</script>

<div class="settings-panel">
  {#if settings.loading}
    <SettingsSkeleton />
  {:else if settings.data}
    <ThemeToggle 
      value={settings.data.theme} 
    />
    <NotificationSettings 
      enabled={settings.data.notifications}
    />
    <PrivacySettings 
      settings={settings.data.privacy}
    />
  {/if}
</div>
```

## Performance Considerations

1. Use `startWith` for better initial loading experience
2. Implement appropriate loading states
3. Handle errors gracefully
4. Consider implementing data caching if needed
5. Use type definitions for better development experience

## Security Notes

1. Always implement proper Firestore security rules
2. Handle permission-denied errors appropriately
3. Validate data types server-side
4. Consider implementing rate limiting
5. Use appropriate Firebase indexes

For more information and advanced usage examples, visit our [official documentation](https://svelte-firekit.dev/docs/awaitable-doc).