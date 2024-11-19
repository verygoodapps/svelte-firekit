---
slug: document-mutations
title: Document Mutations API Reference
description: Comprehensive guide to performing CRUD operations with Svelte Firekit's Document Mutations API, including TypeScript support, automatic timestamps, and best practices for managing Firestore documents in your Svelte applications.
---

# Document mutations

The Document Mutations API provides a set of methods for performing CRUD (Create, Read, Update, Delete) operations on Firestore documents within your Svelte application.


## Basic Usage

```typescript
import { firekitDocMutations } from 'svelte-firekit';

// Example usage
const addDocument = async () => {
  const newDoc = await firekitDocMutations.add('users', {
    name: 'John Doe',
    email: 'john@example.com'
  });
};
```

## API Methods

### add()

Adds a new document to a collection with an auto-generated ID.

```typescript
async add<T extends DocumentData>(
    collectionPath: string,
    data: WithFieldValue<T>,
    options?: { timestamps?: boolean }
): Promise<DocumentReference>
```

**Parameters:**
- `collectionPath`: String path to the collection
- `data`: Document data to add
- `options`: Configuration object
  - `timestamps`: (default: `true`) Automatically add timestamp and user metadata

**Example:**
```typescript
const newUser = await firekitDocMutations.add('users', {
  name: 'Jane Smith',
  age: 25
});
```

### set()

Sets a document's data at the specified path.

```typescript
async set<T extends DocumentData>(
    path: string,
    data: WithFieldValue<T>,
    options?: { 
      merge?: boolean;
      timestamps?: boolean 
    }
): Promise<void>
```

**Parameters:**
- `path`: Full document path (e.g., 'users/user123')
- `data`: Document data to set
- `options`:
  - `merge`: (default: `false`) Merge with existing data
  - `timestamps`: (default: `true`) Add timestamp and user metadata

**Example:**
```typescript
await firekitDocMutations.set('users/user123', {
  name: 'John Updated',
  role: 'admin'
}, { merge: true });
```

### update()

Updates specific fields of a document without overwriting the entire document.

```typescript
async update<T extends DocumentData>(
    path: string,
    data: PartialWithFieldValue<T>,
    options?: { timestamps?: boolean }
): Promise<void>
```

**Parameters:**
- `path`: Full document path
- `data`: Partial document data to update
- `options`:
  - `timestamps`: (default: `true`) Update timestamp and user metadata

**Example:**
```typescript
await firekitDocMutations.update('users/user123', {
  age: 26,
  lastLogin: new Date()
});
```

### delete()

Deletes a document at the specified path.

```typescript
async delete(path: string): Promise<void>
```

**Parameters:**
- `path`: Full document path

**Example:**
```typescript
await firekitDocMutations.delete('users/user123');
```

### exists()

Checks if a document exists at the specified path.

```typescript
async exists(path: string): Promise<boolean>
```

**Parameters:**
- `path`: Full document path

**Example:**
```typescript
const doesExist = await firekitDocMutations.exists('users/user123');
if (doesExist) {
  console.log('Document exists!');
}
```

## TypeScript Support

The API includes full TypeScript support with generic types for better type safety:

```typescript
interface User {
  name: string;
  age: number;
  email: string;
}

// Type-safe document operations
await firekitDocMutations.add<User>('users', {
  name: 'John Doe',
  age: 30,
  email: 'john@example.com'
});
```

## Automatic Timestamps

When `timestamps` option is enabled (default), the following metadata is automatically added:

For `add()` and `set()`:
- `createdAt`: Server timestamp
- `createdBy`: Current user's UID
- `updatedAt`: Server timestamp
- `updatedBy`: Current user's UID

For `update()`:
- `updatedAt`: Server timestamp
- `updatedBy`: Current user's UID

To disable automatic timestamps:

```typescript
await firekitDocMutations.add('users', userData, { timestamps: false });
```

## Best Practices

1. **Error Handling**: Always wrap mutation operations in try-catch blocks:
```typescript
try {
  await firekitDocMutations.add('users', userData);
} catch (error) {
  console.error('Failed to add user:', error);
}
```

2. **Type Safety**: Utilize TypeScript interfaces for your document types:
```typescript
interface Product {
  name: string;
  price: number;
  stock: number;
}

const addProduct = async (productData: Product) => {
  return firekitDocMutations.add<Product>('products', productData);
};
```

3. **Path Construction**: Use consistent path formatting:
```typescript
// Good
const userPath = `users/${userId}`;
const documentPath = `organizations/${orgId}/members/${memberId}`;

// Avoid
const badPath = 'users/' + userId;
```