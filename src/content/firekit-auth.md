---
slug: firekit-auth-docs
title: Firebase Authentication Service for Svelte Firekit
description: Complete guide to implementing Firebase authentication flows, user management, and data synchronization in Svelte applications using the FirekitAuth service
---

# Firebase Authentication Service for Svelte Firekit

## Overview
The `FirekitAuth` class provides a complete authentication service for Firebase integration in Svelte applications, implementing common auth flows and user management.

## Methods

### Authentication

#### Sign In with Google
```typescript
await firekitAuth.signInWithGoogle();
```
Initiates Google OAuth popup and stores user data in Firestore upon success.

#### Email/Password Authentication
```typescript
// Sign in
await firekitAuth.signInWithEmail(email, password);

// Register new user
await firekitAuth.registerWithEmail(email, password, displayName);
```
- Sign in authenticates existing users
- Register creates new users, sets display name, and sends verification email

#### Sign Out
```typescript
await firekitAuth.logOut();
```

### User Management

#### Email Verification
```typescript
// Send verification email to current user
await firekitAuth.sendEmailVerificationToUser();
```

#### Password Management
```typescript
// Reset password
await firekitAuth.sendPasswordReset(email);

// Update password for authenticated user
await firekitAuth.updateUserPassword(newPassword);
```

#### Profile Management
```typescript
await firekitAuth.updateUserProfile({
  displayName: "New Name",
  photoURL: "https://example.com/photo.jpg"
});
```

## User Data Structure
When users authenticate, their data is automatically synced to Firestore with the following structure:

```typescript
interface UserData {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  providerId: string;
  phoneNumber: string | null;
  providerData: UserInfo[];
}
```

## Usage Examples

### Complete Authentication Flow
```typescript
try {
  // Register new user
  await firekitAuth.registerWithEmail(
    "user@example.com",
    "password123",
    "John Doe"
  );
  
  // Update profile
  await firekitAuth.updateUserProfile({
    photoURL: "https://example.com/avatar.jpg"
  });
  
  // Send verification email
  await firekitAuth.sendEmailVerificationToUser();
} catch (error) {
  console.error("Authentication error:", error);
}
```

### Social Authentication
```typescript
try {
  await firekitAuth.signInWithGoogle();
  console.log("Successfully signed in with Google");
} catch (error) {
  console.error("Google sign-in failed:", error);
}
```

## Error Handling
All methods throw Firebase Auth errors that should be caught and handled appropriately:

```typescript
try {
  await firekitAuth.signInWithEmail(email, password);
} catch (error: any) {
  switch (error.code) {
    case 'auth/wrong-password':
      // Handle invalid password
      break;
    case 'auth/user-not-found':
      // Handle non-existent user
      break;
    default:
      // Handle other errors
  }
}
```