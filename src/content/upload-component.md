---
slug: upload-dropzone-component  
title: Upload Dropzone Component  
description: A user-friendly Svelte component for file uploads with drag-and-drop functionality, progress tracking, and error handling. Ideal for Svelte Firekit applications.  
---

# Upload Dropzone Component

## Overview

The Upload Dropzone component provides a user-friendly interface for file uploads in Svelte Firekit applications. It combines drag-and-drop functionality with traditional file selection, progress tracking, and error handling.

## Features

- 🎯 Drag-and-drop file uploads
- 📁 Traditional file browser support
- 📊 Built-in progress tracking
- ⚠️ File size validation
- 🎨 Customizable UI and feedback
- 🔄 Reactive state management


## Basic Usage

```svelte
<script lang="ts">
    import { UploadDropzone } from 'svelte-firekit/components';
</script>

<UploadDropzone 
    path="uploads/images"
    accept="image/*"
    maxSize={5 * 1024 * 1024}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `path` | `string` | `""` | Storage path for uploaded files |
| `accept` | `string` | `"*"` | Accepted file types |
| `maxSize` | `number` | `5242880` | Maximum file size in bytes (5MB) |
| `children` | `Snippet` | `undefined` | Custom upload task UI |
| `progress` | `Snippet` | `undefined` | Custom progress UI |
| `error` | `Snippet` | `undefined` | Custom error UI |

## Customization Examples

### Custom Progress UI

```svelte
<UploadDropzone 
    path="uploads/images"
    let:progress
>
    <div class="progress-bar">
        <div 
            class="progress-fill"
            style="width: {progress}%"
        />
        <span>{progress.toFixed(1)}%</span>
    </div>
</UploadDropzone>
```

### Custom Error Handling

```svelte
<UploadDropzone
    path="uploads/images"
    let:error
>
    <div class="error-message">
        <span>Upload failed: {error.message}</span>
        <button on:click={retryUpload}>Retry</button>
    </div>
</UploadDropzone>
```

### Complete Custom UI

```svelte
<UploadDropzone
    path="uploads/images"
    maxSize={10 * 1024 * 1024}
    let:uploadTask
>
    {#if uploadTask.error}
        <div class="error">
            {uploadTask.error.message}
        </div>
    {:else if uploadTask.completed}
        <div class="success">
            <img src={uploadTask.downloadURL} alt="Uploaded file" />
        </div>
    {:else}
        <div class="upload-progress">
            <progress value={uploadTask.progress} max="100" />
            <span>{uploadTask.progress.toFixed(1)}%</span>
        </div>
    {/if}
</UploadDropzone>
```

## Styling

The component uses Tailwind CSS classes by default but can be customized:

```svelte
<UploadDropzone
    class="custom-dropzone"
    activeClass="dropzone-active"
>
    <!-- Content -->
</UploadDropzone>
```

### Default Classes
- Base container: `p-12 flex justify-center border-2 border-dashed rounded-xl`
- Active drag state: `border-blue-500 bg-blue-50`
- File icon: `w-16 text-gray-400`
- Text: `text-sm` and `text-xs text-gray-400`

## Events

The component handles several drag-and-drop events:

- `ondragover`
- `ondragleave`
- `ondrop`
- `onchange` (file input)

## File Handling

```typescript
function handleFile(file: File) {
    // Size validation
    if (file.size > maxSize) {
        throw new Error(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
    }

    // File name sanitization
    const timestamp = Date.now();
    const fileName = file.name.replace(/[^a-zA-Z0-9.]/g, "-");
    const fullPath = `${path}/${timestamp}-${fileName}`;
    
    return firekitUploadTask(fullPath, file);
}
```

## Best Practices

1. **File Size Limits**
   - Set appropriate `maxSize` based on your storage quotas
   - Provide clear feedback when files exceed limits

2. **Path Management**
   - Use structured paths with timestamps to prevent collisions
   - Sanitize file names to ensure compatibility

3. **Error Handling**
   - Implement comprehensive error messages
   - Provide retry mechanisms for failed uploads

4. **Progress Feedback**
   - Always show upload progress
   - Provide clear success/failure states

## TypeScript Support

The component includes full TypeScript support with proper type definitions:

```typescript
interface UploadDropzoneProps {
    path: string;
    accept?: string;
    maxSize?: number;
    children?: Snippet<[uploadTask: ReturnType<typeof firekitUploadTask>]>;
    progress?: Snippet<[percent: number]>;
    error?: Snippet<[error: Error]>;
}
```

## Security Considerations

1. **File Type Validation**
   - Use the `accept` prop to restrict file types
   - Implement server-side validation

2. **Size Limits**
   - Set appropriate `maxSize` limits
   - Configure Firebase Storage rules accordingly

3. **Path Security**
   - Sanitize file paths
   - Implement proper Firebase Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```