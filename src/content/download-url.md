---
slug: download-url
title: FirekitDownloadUrl- Firebase Storage Download URL Manager
description: A reactive Firebase Storage URL manager for Svelte 5 applications that handles downloading and caching of storage URLs. FirekitDownloadUrl provides automatic URL resolution, loading states, error handling, and refresh capabilities for Firebase Storage files.
---

# FirekitDownloadUrl

A reactive Firebase Storage URL manager for Svelte 5 applications that simplifies handling download URLs for stored files.


## Import

```typescript
import { firekitDownloadUrl } from 'svelte-firekit';
```

## Usage

The `firekitDownloadUrl` function creates a reactive wrapper around a Firebase Storage file path, automatically resolving the download URL.

```typescript
// Basic usage with storage path
const profileImage = firekitDownloadUrl('users/123/profile.jpg');

// Access reactive properties
$: imageUrl = profileImage.url;
$: isLoading = profileImage.loading;
$: error = profileImage.error;
```

## API Reference

### `firekitDownloadUrl(path)`

Creates a new FirekitDownloadUrl instance for handling storage file URLs.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | `string` | Storage file path (e.g., 'images/photo.jpg') |

#### Returns

Returns a `FirekitDownloadUrl` instance with reactive properties.

## Properties

All properties are reactive and can be used in Svelte's reactive statements.

| Property | Type | Description |
|----------|------|-------------|
| `url` | `string \| null` | The resolved download URL or null if not available |
| `loading` | `boolean` | True while URL is being resolved |
| `error` | `Error \| null` | Error object if an error occurred, null otherwise |

## Methods

### `refresh()`

Refreshes the download URL by re-fetching it from Firebase Storage.

```typescript
const imageUrl = firekitDownloadUrl('images/photo.jpg');
imageUrl.refresh(); // Re-fetches the URL
```

## Error Handling

```typescript
const imageUrl = firekitDownloadUrl('images/photo.jpg');

$: if (imageUrl.error) {
    console.error('Error loading URL:', imageUrl.error);
}
```

## Examples

### Basic Image Loading

```typescript
const profileImage = firekitDownloadUrl('profiles/user123.jpg');

// In your Svelte component
{#if profileImage.loading}
    <div class="skeleton">Loading...</div>
{:else if profileImage.error}
    <div class="error">
        Failed to load image: {profileImage.error.message}
    </div>
{:else if profileImage.url}
    <img src={profileImage.url} alt="Profile" />
{/if}
```

### With Refresh Functionality

```typescript
const avatarUrl = firekitDownloadUrl('avatars/user123.jpg');

function handleRefresh() {
    avatarUrl.refresh();
}

// In your component
<button on:click={handleRefresh}>
    Refresh Image
</button>
```

## Best Practices

1. **Error Handling**
   Always implement proper error handling:

```typescript
function ImageComponent({ path }: { path: string }) {
    const image = firekitDownloadUrl(path);

    return (
        <div>
            {#if image.loading}
                <div class="loading-spinner" />
            {:else if image.error}
                <div class="error-container">
                    <p>Failed to load image</p>
                    <button on:click={() => image.refresh()}>
                        Retry
                    </button>
                </div>
            {:else}
                <img 
                    src={image.url} 
                    alt="Image"
                    on:error={() => image.refresh()}
                />
            {/if}
        </div>
    );
}
```

2. **Loading States**
   Provide feedback during URL resolution:

```typescript
const fileUrl = firekitDownloadUrl('documents/report.pdf');

{#if fileUrl.loading}
    <div class="loading-indicator">
        <span>Preparing download...</span>
    </div>
{/if}
```

3. **URL Caching**
   Remember that Firebase Storage URLs are cached:

```typescript
// Create reusable URL instance
const sharedImage = firekitDownloadUrl('shared/logo.png');

// Use in multiple components
function Logo() {
    return (
        {#if sharedImage.url}
            <img src={sharedImage.url} alt="Logo" />
        {/if}
    );
}
```

4. **Refresh Strategy**
   Implement smart refresh strategies:

```typescript
function SmartImage({ path }: { path: string }) {
    const image = firekitDownloadUrl(path);
    
    // Refresh URL if image fails to load
    function handleImageError() {
        if (!image.loading && !image.error) {
            image.refresh();
        }
    }

    return (
        <img 
            src={image.url} 
            alt="Dynamic Image"
            on:error={handleImageError}
        />
    );
}
```

## Debugging

To debug issues with FirekitDownloadUrl:

1. Check the `error` property for specific error messages
2. Verify the storage path is correct
3. Ensure Firebase Storage rules allow access
4. Check your Firebase configuration
5. Verify the file exists in Firebase Storage

## Advanced Usage

### With Custom Error Handling

```typescript
function DownloadButton({ filePath }: { filePath: string }) {
    const download = firekitDownloadUrl(filePath);

    async function handleDownload() {
        if (download.error) {
            download.refresh();
            return;
        }

        if (download.url) {
            try {
                const response = await fetch(download.url);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = filePath.split('/').pop() || 'download';
                a.click();
                
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Download failed:', error);
            }
        }
    }

    return (
        <button 
            disabled={download.loading} 
            on:click={handleDownload}
        >
            {download.loading ? 'Preparing...' : 'Download'}
        </button>
    );
}
```

### With Timeout and Retry

```typescript
function ImageWithRetry({ path, timeout = 5000 }: { path: string, timeout?: number }) {
    const image = firekitDownloadUrl(path);
    let timeoutId: number;

    onMount(() => {
        timeoutId = setTimeout(() => {
            if (image.loading) {
                image.refresh();
            }
        }, timeout);

        return () => clearTimeout(timeoutId);
    });

    return (
        {#if image.url}
            <img src={image.url} alt="Retryable Image" />
        {/if}
    );
}
```