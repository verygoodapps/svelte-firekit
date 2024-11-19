---
slug: svelte-firekit-upload-task
title: Understanding FirekitUploadTask Reactive File Uploads in Svelte Firekit
description: A comprehensive guide to managing file uploads in Svelte Firekit using FirekitUploadTask. Learn how to implement reactive file uploads with progress tracking, error handling, and advanced features like batch uploads and type-safe paths.
---

# FirekitUploadTask Documentation

## Overview

`FirekitUploadTask` is a Svelte-powered class that provides a reactive interface for managing file uploads to Firebase Storage. It leverages Svelte's state management to provide real-time upload progress, status updates, and error handling.

## Usage

### Basic Upload

```typescript
import { firekitUploadTask } from 'svelte-firekit/storage';

function handleFileUpload(file: File) {
    const uploadTask = firekitUploadTask('path/to/file.jpg', file);
    
    // Access reactive states
    $: progress = uploadTask.progress;
    $: downloadURL = uploadTask.downloadURL;
    $: completed = uploadTask.completed;
}
```

### Complete Example

```svelte
<script lang="ts">
    import { firekitUploadTask } from 'svelte-firekit/storage';
    
    let uploadTask: ReturnType<typeof firekitUploadTask>;
    
    function handleFileSelect(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            const path = `uploads/${Date.now()}_${file.name}`;
            uploadTask = firekitUploadTask(path, file);
        }
    }
</script>

{#if uploadTask}
    <div class="upload-status">
        <progress value={uploadTask.progress} max="100" />
        <p>Progress: {uploadTask.progress.toFixed(1)}%</p>
        
        {#if uploadTask.error}
            <p class="error">Error: {uploadTask.error.message}</p>
        {/if}
        
        {#if uploadTask.completed}
            <p>Upload complete!</p>
            <img src={uploadTask.downloadURL} alt="Uploaded file" />
        {/if}
        
        <div class="controls">
            <button on:click={() => uploadTask.pause()}>Pause</button>
            <button on:click={() => uploadTask.resume()}>Resume</button>
            <button on:click={() => uploadTask.cancel()}>Cancel</button>
        </div>
    </div>
{/if}

<input type="file" on:change={handleFileSelect} />
```

## API Reference

### Constructor

```typescript
firekitUploadTask(path: string, file: File): FirekitUploadTask
```

- `path`: The storage path where the file will be uploaded
- `file`: The File object to upload

### Properties

All properties are reactive and can be accessed directly:

| Property | Type | Description |
|----------|------|-------------|
| `progress` | `number` | Upload progress from 0 to 100 |
| `error` | `Error \| null` | Error object if upload fails |
| `snapshot` | `UploadTaskSnapshot \| null` | Current upload snapshot |
| `downloadURL` | `string \| null` | URL of the uploaded file |
| `completed` | `boolean` | Whether the upload is complete |

### Methods

#### pause()
Pauses the current upload.

```typescript
const upload = firekitUploadTask('path/file.jpg', file);
upload.pause();
```

#### resume()
Resumes a paused upload.

```typescript
upload.resume();
```

#### cancel()
Cancels the current upload.

```typescript
upload.cancel();
```

## Advanced Usage

### Type-Safe Path Generation

```typescript
import { firekitUploadTask } from 'svelte-firekit/storage';

interface UploadPaths {
    userAvatars: `users/${string}/avatar/${string}`;
    productImages: `products/${string}/images/${string}`;
}

function uploadUserAvatar(userId: string, file: File) {
    const path: UploadPaths['userAvatars'] = 
        `users/${userId}/avatar/${file.name}`;
    return firekitUploadTask(path, file);
}
```

### Custom Upload Monitoring

```typescript
<script lang="ts">
    import { firekitUploadTask } from 'svelte-firekit/storage';
    import type { UploadTaskSnapshot } from 'firebase/storage';
    
    function monitorUpload(file: File) {
        const upload = firekitUploadTask(`uploads/${file.name}`, file);
        
        $: if (upload.snapshot) {
            handleSnapshotUpdate(upload.snapshot);
        }
        
        function handleSnapshotUpdate(snapshot: UploadTaskSnapshot) {
            const speed = calculateUploadSpeed(snapshot);
            const timeRemaining = estimateTimeRemaining(snapshot);
            // Update UI with detailed statistics
        }
    }
</script>
```

### Batch Uploads

```typescript
<script lang="ts">
    import { firekitUploadTask } from 'svelte-firekit/storage';
    
    type UploadStatus = {
        task: ReturnType<typeof firekitUploadTask>;
        file: File;
    };
    
    let uploads: UploadStatus[] = [];
    
    function handleMultipleFiles(files: FileList) {
        uploads = Array.from(files).map(file => ({
            file,
            task: firekitUploadTask(`batch/${file.name}`, file)
        }));
    }
    
    $: totalProgress = uploads.length 
        ? uploads.reduce((sum, { task }) => sum + task.progress, 0) / uploads.length 
        : 0;
</script>

<div class="batch-upload">
    <progress value={totalProgress} max="100" />
    
    {#each uploads as { task, file }}
        <div class="upload-item">
            <span>{file.name}</span>
            <progress value={task.progress} max="100" />
            {#if task.completed}
                <a href={task.downloadURL}>View File</a>
            {/if}
        </div>
    {/each}
</div>
```

## Error Handling

The `error` property provides detailed Firebase Storage error information:

```typescript
<script lang="ts">
    import { firekitUploadTask } from 'svelte-firekit/storage';
    
    function handleUploadError(error: Error) {
        if (error.name === 'StorageError') {
            switch (error.code) {
                case 'storage/unauthorized':
                    // Handle unauthorized access
                    break;
                case 'storage/canceled':
                    // Handle canceled upload
                    break;
                case 'storage/unknown':
                    // Handle unknown error
                    break;
            }
        }
    }
    
    $: if (uploadTask?.error) {
        handleUploadError(uploadTask.error);
    }
</script>
```

## Best Practices

1. **Path Generation**
   - Use consistent path patterns
   - Include timestamps or UUIDs to prevent collisions
   - Consider file type restrictions

2. **Error Handling**
   - Always handle potential errors
   - Provide user feedback for failures
   - Implement retry logic for failed uploads

3. **Performance**
   - Monitor file sizes
   - Implement client-side image compression when needed
   - Consider implementing upload queues for multiple files

4. **Security**
   - Validate file types before upload
   - Set appropriate Firebase Storage security rules
   - Implement maximum file size restrictions