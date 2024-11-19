---
slug: firekit-collection
title: FirekitCollection Reactive Firestore Collection Wrapper
description: A reactive collection wrapper for Firestore that provides real-time updates and state management for collections in Svelte 5 applications. FirekitCollection handles collection queries, real-time updates, loading states, and error handling with full TypeScript support.
---

# FirekitCollection

A reactive Firestore collection wrapper for Svelte 5 applications that provides real-time updates and state management for collection data.

## Import

```typescript
import { firekitCollection } from 'svelte-firekit';
import { where, orderBy, limit } from 'firebase/firestore';
```

## Usage

The `firekitCollection` function creates a reactive wrapper around a Firestore collection, automatically updating when the underlying data changes.

```typescript
// Basic usage with collection path
interface User {
  id: string;
  name: string;
  email: string;
}

const users = firekitCollection<User>('users');

// With query constraints
const activeUsers = firekitCollection<User>(
  'users',
  where('status', '==', 'active'),
  orderBy('lastActive', 'desc'),
  limit(10)
);

// Access reactive data
$: userData = users.data;
$: isLoading = users.loading;
$: error = users.error;
```

## API Reference

### `firekitCollection<T>(path, ...queryConstraints)`

Creates a new FirekitCollection instance for real-time collection updates.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | `string` | Collection path (e.g., 'users') |
| `queryConstraints` | `...QueryConstraint` | Optional Firestore query constraints (where, orderBy, limit, etc.) |

#### Returns

Returns a `FirekitCollection<T>` instance with reactive properties.

## Type Parameters

### T extends DocumentData

Represents the type of documents stored in the collection. Must match your Firestore collection structure.

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

const products = firekitCollection<Product>('products');
```

## Properties

All properties are reactive and can be used in Svelte's reactive statements.

| Property | Type | Description |
|----------|------|-------------|
| `data` | `T[]` | Array of collection documents |
| `loading` | `boolean` | True while initial data is being fetched |
| `error` | `Error \| null` | Error object if an error occurred, null otherwise |
| `empty` | `boolean` | Whether the collection is empty |
| `size` | `number` | Number of documents in the collection |
| `ref` | `CollectionReference<T>` | The underlying Firestore collection reference |

## Methods

### Constructor

```typescript
new FirekitCollection<T>(path: string, ...queryConstraints: QueryConstraint[])
```

Creates a new FirekitCollection instance. Note: You should use the `firekitCollection` function instead of constructing directly.

## Error Handling

FirekitCollection provides built-in error handling through the `error` property:

```typescript
const collection = firekitCollection<User>('users');

$: if (collection.error) {
    console.error('Error loading collection:', collection.error);
}
```

## Examples

### Basic Collection Subscription

```typescript
interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

const users = firekitCollection<User>('users');

// In your Svelte component
{#if users.loading}
    <p>Loading...</p>
{:else if users.error}
    <p>Error: {users.error.message}</p>
{:else if users.empty}
    <p>No users found</p>
{:else}
    <ul>
        {#each users.data as user}
            <li>{user.name} ({user.email})</li>
        {/each}
    </ul>
{/if}
```

### With Query Constraints

```typescript
import { where, orderBy, limit } from 'firebase/firestore';

const activeUsers = firekitCollection<User>(
    'users',
    where('status', '==', 'active'),
    orderBy('lastLogin', 'desc'),
    limit(10)
);
```

## Best Practices

1. **Type Safety**
   Always provide proper TypeScript interfaces for your collections:

```typescript
interface Document {
    id: string;  // Always include id for collection documents
    // Define all expected fields
    field1: string;
    field2: number;
    // Make optional fields explicit
    field3?: boolean;
}

const collection = firekitCollection<Document>('collection');
```

2. **Query Optimization**
   Be mindful of query constraints to optimize performance:

```typescript
const optimizedQuery = firekitCollection<Data>(
    'collection',
    where('status', '==', 'active'),
    orderBy('timestamp', 'desc'),
    limit(20)  // Always limit large collections
);
```

3. **Error Handling**
   Always handle potential errors in your components:

```typescript
{#if collection.error}
    <div class="error">
        {collection.error.message}
        <button onclick={() => window.location.reload()}>
            Retry
        </button>
    </div>
{/if}
```

4. **Loading States**
   Provide feedback during loading:

```typescript
{#if collection.loading}
    <div class="loading-spinner">Loading...</div>
{/if}
```

5. **Empty State Handling**
   Always handle empty collections:

```typescript
{#if collection.empty}
    <div class="empty-state">
        <p>No items found</p>
    </div>
{/if}
```

## Debugging

To debug issues with FirekitCollection:

1. Check the `error` property for any error messages
2. Verify the collection path is correct
3. Ensure query constraints are valid
4. Verify your Firebase security rules
5. Check your Firebase configuration

## Advanced Usage

### Complex Queries

```typescript
import { where, orderBy, startAfter, limit } from 'firebase/firestore';

interface Post {
    id: string;
    title: string;
    authorId: string;
    published: boolean;
    views: number;
}

const trendingPosts = firekitCollection<Post>(
    'posts',
    where('published', '==', true),
    where('views', '>', 1000),
    orderBy('views', 'desc'),
    limit(20)
);
```

### Type Guard Usage

```typescript
function isLoaded<T>(collection: FirekitCollection<T>): boolean {
    return !collection.loading && !collection.error;
}

// Usage
if (isLoaded(myCollection)) {
    console.log(myCollection.data);
}
```