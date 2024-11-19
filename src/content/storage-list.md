---
slug: firekit-storage-list
title: FirekitStorageList- Firebase Storage Directory Explorer
description: A reactive Firebase Storage directory explorer for Svelte 5 applications that provides listing capabilities for files and folders. FirekitStorageList handles directory traversal, file listing, loading states, and error handling with automatic updates.
---

# FirekitStorageList

A reactive Firebase Storage directory explorer for Svelte 5 applications that enables listing and traversal of storage directories.

## Import

```typescript
import { firekitStorageList } from 'svelte-firekit';
```

## Usage

The `firekitStorageList` function creates a reactive wrapper around a Firebase Storage directory path, listing all files and subdirectories.

```typescript
// Basic usage with storage path
const storageDirectory = firekitStorageList('images/');

// Access reactive properties
$: files = storageDirectory.items;
$: folders = storageDirectory.prefixes;
$: isLoading = storageDirectory.loading;
$: error = storageDirectory.error;
```

## API Reference

### `firekitStorageList(path)`

Creates a new FirekitStorageList instance for exploring storage directories.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | `string` | Storage directory path (e.g., 'images/') |

#### Returns

Returns a `FirekitStorageList` instance with reactive properties.

## Properties

All properties are reactive and can be used in Svelte's reactive statements.

| Property | Type | Description |
|----------|------|-------------|
| `items` | `StorageReference[]` | Array of file references in the directory |
| `prefixes` | `StorageReference[]` | Array of subdirectory references |
| `loading` | `boolean` | True while directory is being listed |
| `error` | `Error \| null` | Error object if an error occurred, null otherwise |

## Methods

### `refresh()`

Refreshes the directory listing by re-fetching all items and prefixes.

```typescript
const directory = firekitStorageList('uploads/');
directory.refresh(); // Re-fetches the directory contents
```

## Error Handling

```typescript
const directory = firekitStorageList('documents/');

$: if (directory.error) {
    console.error('Error listing directory:', directory.error);
}
```

## Examples

### Basic Directory Explorer

```typescript
const rootDirectory = firekitStorageList('public/');

// In your Svelte component
{#if rootDirectory.loading}
    <div class="loading">Loading directory contents...</div>
{:else if rootDirectory.error}
    <div class="error">
        Failed to load directory: {rootDirectory.error.message}
    </div>
{:else}
    <div class="directory-explorer">
        <h3>Folders</h3>
        <ul>
            {#each rootDirectory.prefixes as folder}
                <li>{folder.name}</li>
            {/each}
        </ul>

        <h3>Files</h3>
        <ul>
            {#each rootDirectory.items as file}
                <li>{file.name}</li>
            {/each}
        </ul>
    </div>
{/if}
```

### Interactive File Browser

```typescript
function FileBrowser({ path = '' }: { path: string }) {
    const directory = firekitStorageList(path);
    
    function getFileName(ref: StorageReference) {
        return ref.name;
    }
    
    function getFolderName(ref: StorageReference) {
        return ref.name.replace(/\/$/, '');
    }

    return (
        <div class="file-browser">
            <div class="header">
                <h2>Browsing: {path || 'Root'}</h2>
                <button on:click={() => directory.refresh()}>
                    Refresh
                </button>
            </div>

            {#if directory.loading}
                <div class="loading">Loading...</div>
            {:else if directory.error}
                <div class="error">
                    {directory.error.message}
                </div>
            {:else}
                <div class="contents">
                    {#if directory.prefixes.length > 0}
                        <div class="folders">
                            {#each directory.prefixes as folder}
                                <div class="folder-item">
                                    📁 {getFolderName(folder)}
                                </div>
                            {/each}
                        </div>
                    {/if}

                    {#if directory.items.length > 0}
                        <div class="files">
                            {#each directory.items as file}
                                <div class="file-item">
                                    📄 {getFileName(file)}
                                </div>
                            {/each}
                        </div>
                    {/if}

                    {#if directory.prefixes.length === 0 && directory.items.length === 0}
                        <div class="empty">
                            This directory is empty
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
    );
}
```

## Best Practices

1. **Error Handling**
   Implement comprehensive error handling:

```typescript
function DirectoryViewer({ path }: { path: string }) {
    const directory = firekitStorageList(path);

    function handleError(error: Error) {
        console.error('Directory error:', error);
        // Implement retry logic or user notification
    }

    $: if (directory.error) handleError(directory.error);

    return (
        <div>
            {#if directory.error}
                <div class="error-container">
                    <p>Failed to load directory contents</p>
                    <button on:click={() => directory.refresh()}>
                        Retry
                    </button>
                </div>
            {/if}
        </div>
    );
}
```

2. **Loading States**
   Provide clear loading feedback:

```typescript
{#if directory.loading}
    <div class="loading-state">
        <div class="spinner"></div>
        <p>Loading directory contents...</p>
    </div>
{/if}
```

3. **Empty State Handling**
   Handle empty directories gracefully:

```typescript
function EmptyStateHandler() {
    const directory = firekitStorageList('some/path');

    return (
        {#if !directory.loading && !directory.error}
            {#if directory.items.length === 0 && directory.prefixes.length === 0}
                <div class="empty-state">
                    <p>This directory is empty</p>
                    <button on:click={() => directory.refresh()}>
                        Refresh
                    </button>
                </div>
            {/if}
        {/if}
    );
}
```

4. **Periodic Refresh**
   Implement automatic refresh for directories that might change:

```typescript
function AutoRefreshDirectory({ path, interval = 30000 }: { path: string, interval?: number }) {
    const directory = firekitStorageList(path);
    
    onMount(() => {
        const refreshInterval = setInterval(() => {
            directory.refresh();
        }, interval);

        return () => clearInterval(refreshInterval);
    });

    return (
        // Directory listing component
    );
}
```

## Debugging

To debug issues with FirekitStorageList:

1. Check the `error` property for specific error messages
2. Verify the storage path is correct
3. Ensure Firebase Storage rules allow listing
4. Check your Firebase configuration
5. Verify the directory exists in Firebase Storage

## Advanced Usage

### With Path Navigation

```typescript
function StorageNavigator() {
    let currentPath = $state('');
    const directory = firekitStorageList(currentPath);

    function navigateToFolder(folder: StorageReference) {
        currentPath = folder.fullPath;
    }

    function navigateUp() {
        const parts = currentPath.split('/');
        parts.pop();
        currentPath = parts.join('/');
    }

    return (
        <div class="storage-navigator">
            <div class="navigation-header">
                <button 
                    disabled={!currentPath}
                    on:click={navigateUp}
                >
                    ⬆️ Up
                </button>
                <span>Current: /{currentPath}</span>
            </div>

            {#if !directory.loading && !directory.error}
                <div class="contents">
                    {#each directory.prefixes as folder}
                        <div 
                            class="folder"
                            on:click={() => navigateToFolder(folder)}
                        >
                            📁 {folder.name}
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    );
}
```