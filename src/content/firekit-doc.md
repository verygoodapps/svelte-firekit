---
slug: firekit-doc
title: FirekitDoc Reactive Firestore Document Wrapper
description: A reactive document wrapper for Firestore that provides real-time updates and state management in Svelte 5 applications. FirekitDoc automatically handles document subscriptions, loading states, and error handling while maintaining full type safety.
---

# FirekitDoc

A reactive Firestore document wrapper for Svelte 5 applications that provides real-time updates and state management.


## Import

```typescript
import { firekitDoc } from 'svelte-firekit';
```

## Usage

The `firekitDoc` function creates a reactive wrapper around a Firestore document, automatically updating when the underlying data changes.

```typescript
// Basic usage with collection/document path
interface User {
  name: string;
  email: string;
}

const userDoc = firekitDoc<User>('users/123');

// Access reactive data
$: userData = userDoc.data;
$: isLoading = userDoc.loading;
$: error = userDoc.error;
```

## API Reference

### `firekitDoc<T>(ref, startWith?)`

Creates a new FirekitDoc instance for real-time document updates.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `ref` | `string \| DocumentReference<T>` | Either a document path string (e.g., 'users/123') or a Firestore DocumentReference |
| `startWith` | `T \| undefined` | Optional initial data while document is loading |

#### Returns

Returns a `FirekitDoc<T>` instance with reactive properties.

## Type Parameters

### T

Represents the type of data stored in the document. Must match your Firestore document structure.

```typescript
interface Product {
  name: string;
  price: number;
  inStock: boolean;
}

const productDoc = firekitDoc<Product>('products/xyz');
```

## Properties

All properties are reactive and can be used in Svelte's reactive statements.

| Property | Type | Description |
|----------|------|-------------|
| `data` | `T \| null` | The current document data or null if document doesn't exist |
| `loading` | `boolean` | True while initial data is being fetched |
| `error` | `Error \| null` | Error object if an error occurred, null otherwise |
| `id` | `string` | The document ID |
| `exists` | `boolean` | Whether the document exists |
| `ref` | `DocumentReference<T>` | The underlying Firestore document reference |

## Methods

### Constructor

```typescript
new FirekitDoc<T>(ref: string | DocumentReference<T>, startWith?: T)
```

Creates a new FirekitDoc instance. Note: You should use the `firekitDoc` function instead of constructing directly.

## Error Handling

FirekitDoc provides built-in error handling through the `error` property:

```typescript
const doc = firekitDoc<User>('users/123');

$: if (doc.error) {
    console.error('Error loading document:', doc.error);
}
```

## Examples

### Basic Document Subscription

```typescript
interface User {
    name: string;
    email: string;
    role: string;
}

const userDoc = firekitDoc<User>('users/123');

// In your Svelte component
{#if userDoc.loading}
    <p>Loading...</p>
{:else if userDoc.error}
    <p>Error: {userDoc.error.message}</p>
{:else if userDoc.exists}
    <div>
        <h2>{userDoc.data.name}</h2>
        <p>{userDoc.data.email}</p>
    </div>
{:else}
    <p>User not found</p>
{/if}
```

### With Initial Data

```typescript
const userDoc = firekitDoc<User>('users/123', {
    name: 'Loading...',
    email: '',
    role: 'user'
});
```

### Using with DocumentReference

```typescript
import { doc } from 'firebase/firestore';
import { firebaseService } from '../firebase';

const db = firebaseService.getDb();
const docRef = doc(db, 'users', '123');
const userDoc = firekitDoc<User>(docRef);
```

## Best Practices

1. **Type Safety**
   Always provide proper TypeScript interfaces for your documents:

```typescript
interface Document {
    // Define all expected fields
    field1: string;
    field2: number;
    // Make optional fields explicit
    field3?: boolean;
}

const doc = firekitDoc<Document>('collection/doc');
```

2. **Error Handling**
   Always handle potential errors in your components:

```typescript
{#if doc.error}
    <div class="error">
        {doc.error.message}
        <button onclick={() => window.location.reload()}>
            Retry
        </button>
    </div>
{/if}
```

3. **Loading States**
   Provide feedback during loading:

```typescript
const doc = firekitDoc<Data>('path/to/doc', {
    // Default data while loading
    field1: 'Loading...',
    field2: 0
});
```

4. **Browser-Only Usage**
   FirekitDoc is designed for browser-only usage. It automatically handles SSR environments by not subscribing to updates during server-side rendering.

5. **Cleanup**
   FirekitDoc automatically handles cleanup of Firestore subscriptions, so you don't need to manually unsubscribe.

## Debugging

To debug issues with FirekitDoc:

1. Check the `error` property for any error messages
2. Verify the document path or reference is correct
3. Ensure you have proper Firebase security rules set up
4. Verify your Firebase configuration

## Advanced Usage

### With Custom Configurations

```typescript
import { doc } from 'firebase/firestore';

// Using with specific collection/document references
interface CustomDoc {
    field: string;
}

const customDoc = firekitDoc<CustomDoc>(
    doc(firebaseService.getDb(), 'custom-collection', 'doc-id')
);

// Accessing document metadata
$: docId = customDoc.id;
$: docRef = customDoc.ref;
```

### Type Guard Usage

```typescript
function isComplete(doc: FirekitDoc<unknown>): doc is FirekitDoc<Document> {
    return !doc.loading && !doc.error && doc.exists;
}

// Usage
if (isComplete(myDoc)) {
    // TypeScript knows myDoc.data is Document type here
    console.log(myDoc.data);
}
```