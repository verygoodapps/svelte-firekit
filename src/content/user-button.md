---
slug: "svelte-firekit-user-profile"
title: "Building User Profiles with Svelte Firekit"
description: "Learn how to implement a complete user profile system with avatar, dropdown menu, and authentication using Svelte Firekit and Firebase"
---

# User Profile System with Svelte Firekit

This guide explains how to implement a complete user profile system using Svelte Firekit, including avatar displays, dropdown menus, and authentication state management.

## Features Overview

- User avatar display with fallback initials
- Dropdown menu for user actions
- Profile dialog with user details
- Authentication state management
- Logout functionality
- Responsive design with dark mode support

## Prerequisites

- SvelteKit project setup
- Firebase project configured
- Svelte Firekit installed and initialized
- UI components from your component library

## Component Structure

The user profile component consists of three main parts:
1. Avatar dropdown trigger
2. Dropdown menu content
3. Profile dialog

## Basic Implementation

### 1. Import Required Components

```typescript
import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
import * as Avatar from "$lib/components/ui/avatar/index.js";
import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
import { firekitUser } from "$lib/firebase/auth/user.svelte.js";
import { firekitAuth } from "$lib/firebase/auth/auth.js";
```

### 2. User Authentication State

The component uses Firekit's authentication state management:

```typescript
{#if firekitUser.user}
    // Protected content here
{:else}
    <Button href="/login">Login</Button>
{/if}
```

### 3. Avatar Implementation

```svelte
<Avatar.Root>
    <Avatar.Image src={firekitUser.photoURL} alt="Avatar" />
    <Avatar.Fallback>
        {getInitials(firekitUser.displayName)}
    </Avatar.Fallback>
</Avatar.Root>
```

### 4. Dropdown Menu Structure

```svelte
<DropdownMenu.Root>
    <DropdownMenu.Trigger>
        <!-- Avatar component here -->
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
        <DropdownMenu.Group>
            <!-- Menu items here -->
        </DropdownMenu.Group>
    </DropdownMenu.Content>
</DropdownMenu.Root>
```

### 5. Profile Dialog

```svelte
<AlertDialog.Root bind:open={isOpen}>
    <AlertDialog.Content>
        <!-- Profile content here -->
    </AlertDialog.Content>
</AlertDialog.Root>
```

## Authentication Features

### Logout Implementation

```typescript
async function handleLogout() {
    await firekitAuth.logOut();
}
```

### User Data Access

Firekit provides easy access to user data:
- `firekitUser.displayName`: User's display name
- `firekitUser.email`: User's email address
- `firekitUser.photoURL`: User's profile photo URL

## Navigation Integration

The component accepts a navigation configuration array:

```typescript
type NavItem = {
    href: string;
    label: string;
};

let { nav }: { nav?: NavItem[] } = $props();
```

## Styling Guidelines

The component uses utility classes for consistent styling:
- `text-foreground-500` for secondary text
- `dark:text-neutral-200` for dark mode support
- `font-medium` for emphasis
- Flexible spacing with `gap-3`

## Best Practices

1. **Error Handling**
   - Always wrap authentication operations in try-catch blocks
   - Provide user feedback for failed operations

2. **Performance**
   - Use `$state` for reactive variables
   - Implement lazy loading for dialogs

3. **Accessibility**
   - Maintain proper ARIA labels
   - Ensure keyboard navigation support

4. **Security**
   - Validate user authentication state before displaying sensitive information
   - Implement proper route guards

## Common Issues and Solutions

1. **Avatar Fallback**
   ```typescript
   function getInitials(name: string) {
       // Implement fallback logic for missing display names
       return name ? name.split(' ').map(n => n[0]).join('') : '?';
   }
   ```

2. **State Management**
   ```typescript
   // Use $state for reactive variables
   let isOpen = $state(false);
   ```

## Example Usage

```svelte
<script>
    const navigationItems = [
        { href: "/settings", label: "Settings" },
        { href: "/billing", label: "Billing" }
    ];
</script>

<UserProfile nav={navigationItems} />
```

## TypeScript Support

The component includes full TypeScript support with proper type definitions:

```typescript
interface NavItem {
    href: string;
    label: string;
}
```

## Contributing

If you'd like to contribute to Svelte Firekit:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

Svelte Firekit is released under the MIT License.