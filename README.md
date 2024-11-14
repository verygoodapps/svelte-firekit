# Firekit

Firekit is a powerful Firebase toolkit for SvelteKit applications, providing a comprehensive set of utilities, stores, and components for Firebase integration.

<h2>🚧 Under Development 🚧</h2>

<p>
Please note that this library is still under development. Although it's functional and can be used, some features might be incomplete or subject to changes.
</p>
## Features

- 🔥 **Firebase Integration** - Seamless Firebase setup and configuration
- 🔐 **Authentication** - Complete auth system with built-in components
- 📚 **Firestore** - Reactive data stores and CRUD operations
- 📦 **Storage** - File upload and management utilities
- 🛡️ **Route Guards** - Protected routes and authorization
- ⚡ **SSR Compatible** - Full server-side rendering support
- 🎯 **Type Safe** - Built with TypeScript for better development experience

## Quick Start

```bash
# Install with your package manager of choice
npm install @firekit/sveltekit
pnpm install @firekit/sveltekit
yarn add @firekit/sveltekit
```

## Basic Usage

```typescript
// Configure Firebase
import { firebaseConfig } from '@firekit/sveltekit';
firebaseConfig.init({
    apiKey: 'your-api-key',
    // ... other firebase config
});

// Use Authentication
import { firekitAuth } from '@firekit/sveltekit';
await firekitAuth.signInWithEmail(email, password);

// Access User State
import { firekitUser } from '@firekit/sveltekit';
isLoggedIn = $derived(firekitUser.isLoggedIn);

// Protect Routes
import { firekitAuthGuard } from '@firekit/sveltekit';
await firekitAuthGuard.requireAuth();

// Use Firestore
import { firekitDoc, firekitCollection } from '@firekit/sveltekit';
const document = firekitDoc<UserData>('users/123');
const collection = firekitCollection<PostData>('posts');

// Handle File Uploads
import { firekitUploadTask } from '@firekit/sveltekit';
const uploadTask = firekitUploadTask('path/to/file', file);
```

## Available Services

### Firebase Configuration
- `firebaseConfig` - Firebase app configuration
- `firebaseService` - Core Firebase service initialization

### Authentication
- `firekitUser` - User state management
- `firekitAuth` - Authentication methods
- `firekitAuthGuard` - Route protection

### Firestore
- `firekitDoc` - Real-time document subscription
- `firekitAwaitableDoc` - Promise-based document operations
- `firekitCollection` - Real-time collection subscription
- `firekitDocMutations` - Document CRUD operations

### Storage
- `firekitDownloadUrl` - File URL management
- `firekitStorageList` - Storage browsing
- `firekitUploadTask` - File upload handling

## Built-in Components

### Authentication
- `SignInPage` - Complete sign-in page
- `SignUpPage` - User registration page
- `ResetPasswordPage` - Password reset flow
- `SignInForm` - Reusable sign-in form
- `SignUpForm` - Reusable registration form
- `ResetPasswordForm` - Password reset form
- `UserButton` - User profile button

### Firestore
- `Collection` - Collection data display
- `Doc` - Document data display

### Storage
- `Upload` - File upload component

## Documentation

Visit our [documentation site](https://firekit.codegio.com) for detailed guides and API references.

## Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) for details.