---
slug: svelte-firekit-docs 
title: Svelte Firekit - Firebase Integration for Svelte 5 
description: Comprehensive guide for integrating Firebase authentication and user management in SvelteKit and Svelte 5 applications using the Svelte Firekit library
---


### Initializing FirekitUser

```typescript
import { firekitUser } from 'svelte-firekit';

// Instance is automatically initialized and manages auth state
```

### User State Properties

Access reactive user states:
- `firekitUser.isLoggedIn`: Boolean indicating authentication status
- `firekitUser.uid`: Current user's ID
- `firekitUser.email`: User's email address
- `firekitUser.displayName`: User's display name
- `firekitUser.photoURL`: User's profile photo URL
- `firekitUser.emailVerified`: Email verification status
- `firekitUser.claims`: User's custom claims
- `firekitUser.data`: Additional user data from Firestore

### User Management Methods

#### Update User Profile
```typescript
await firekitUser.updateProfile({
  displayName: 'New Name',
  photoURL: 'https://example.com/photo.jpg'
});
```

#### Update Email
```typescript
await firekitUser.updateEmail('newemail@example.com');
```

#### Update Password
```typescript
await firekitUser.updatePassword('newPassword123');
```

### User Data Management

#### Save User Data
```typescript
await firekitUser.saveUserData({
  displayName: 'John Doe',
  email: 'john@example.com',
  settings: {
    theme: 'dark',
    notifications: true
  }
});
```

#### Update User Data
```typescript
await firekitUser.updateUserData({
  settings: {
    theme: 'light'
  }
});
```

### Authorization Checks

#### Check Admin Status
```typescript
if (firekitUser.isAdmin()) {
  // Handle admin-only functionality
}
```

#### Check Premium Status
```typescript
if (firekitUser.isPremium()) {
  // Handle premium-only features
}
```

#### Check Multiple Claims
```typescript
const hasAccess = firekitUser.hasRequiredClaims(['premium', 'beta']);
```

## TypeScript Interfaces

### UserData Interface
```typescript
interface UserData extends DocumentData {
    displayName?: string;
    email?: string;
    photoURL?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isProfileComplete?: boolean;
    role?: string;
    settings?: Record<string, any>;
    [key: string]: any;
}
```

### UserClaims Interface
```typescript
interface UserClaims {
    [key: string]: any;
    admin?: boolean;
    premium?: boolean;
}
```

## Best Practices

1. **State Management**
   - Use reactive properties (`$derived` values) for UI updates
   - Avoid direct access to internal user state

2. **Error Handling**
   - Always wrap async operations in try-catch blocks
   - Check authentication state before operations

3. **Data Updates**
   - Use `updateUserData` for partial updates
   - Use `saveUserData` for full document updates

4. **Claims Management**
   - Implement backend validation for critical operations
   - Don't rely solely on client-side claim checks

## Examples

### Profile Update Form
```typescript
async function updateUserProfile(formData: FormData) {
  try {
    await firekitUser.updateUserData({
      displayName: formData.get('displayName'),
      settings: {
        newsletter: formData.get('newsletter') === 'on'
      }
    });
  } catch (error) {
    console.error('Failed to update profile:', error);
  }
}
```

### Protected Route Guard
```typescript
function checkAccess() {
  if (!firekitUser.isLoggedIn) {
    return redirect(302, '/login');
  }
  
  if (!firekitUser.isPremium()) {
    return redirect(302, '/upgrade');
  }
}
```