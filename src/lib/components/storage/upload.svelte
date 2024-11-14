<script lang="ts">
    import { firekitUploadTask } from "$lib/firebase/storage/upload-task.svelte.js";
    import type { Snippet } from "svelte";

    let {
        path = "",
        accept = "*",
        maxSize = 5242880, // 5MB
        children,
        progress,
        error,
    }: {
        path: string;
        accept?: string;
        maxSize?: number;
        children?: Snippet<[uploadTask: ReturnType<typeof firekitUploadTask>]>;
        progress?: Snippet<[percent: number]>;
        error?: Snippet<[error: Error]>;
    } = $props();

    let dragover = $state(false);
    let uploadTask: ReturnType<typeof firekitUploadTask> | null = $state(null);

    function onDrop(e: DragEvent) {
        e.preventDefault();
        dragover = false;
        const file = e.dataTransfer?.files[0];
        if (file) handleFile(file);
    }

    function onFileSelect(e: Event) {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) handleFile(file);
    }

    function handleFile(file: File) {
        if (file.size > maxSize) {
            const error = new Error(
                `File size exceeds ${maxSize / 1024 / 1024}MB limit`,
            );
        }

        const timestamp = Date.now();
        const fileName = file.name.replace(/[^a-zA-Z0-9.]/g, "-");
        const fullPath = `${path}/${timestamp}-${fileName}`;
        uploadTask = firekitUploadTask(fullPath, file);
    }
</script>

<div
    role="button"
    tabindex="0"
    aria-label="Upload file dropzone"
    class="p-12 flex justify-center border-2 border-dashed rounded-xl transition-colors"
    class:border-blue-500={dragover}
    class:bg-blue-50={dragover}
    ondragover={() => (dragover = true)}
    ondragleave={() => (dragover = false)}
    ondrop={onDrop}
>
    {#if !uploadTask}
        <div class="text-center">
            <svg
                class="w-16 text-gray-400 mx-auto dark:text-neutral-400"
                width="70"
                height="46"
                viewBox="0 0 70 46"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M6.05172 9.36853L17.2131 7.5083V41.3608L12.3018 42.3947C9.01306 43.0871 5.79705 40.9434 5.17081 37.6414L1.14319 16.4049C0.515988 13.0978 2.73148 9.92191 6.05172 9.36853Z"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="2"
                    class="fill-white stroke-gray-400 dark:fill-neutral-800 dark:stroke-neutral-500"
                />
                <path
                    d="M63.9483 9.36853L52.7869 7.5083V41.3608L57.6982 42.3947C60.9869 43.0871 64.203 40.9434 64.8292 37.6414L68.8568 16.4049C69.484 13.0978 67.2685 9.92191 63.9483 9.36853Z"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="2"
                    class="fill-white stroke-gray-400 dark:fill-neutral-800 dark:stroke-neutral-500"
                />
                <rect
                    x="17.0656"
                    y="1.62305"
                    width="35.8689"
                    height="42.7541"
                    rx="5"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="2"
                    class="fill-white stroke-gray-400 dark:fill-neutral-800 dark:stroke-neutral-500"
                />
                <path
                    d="M47.9344 44.3772H22.0655C19.3041 44.3772 17.0656 42.1386 17.0656 39.3772L17.0656 35.9161L29.4724 22.7682L38.9825 33.7121C39.7832 34.6335 41.2154 34.629 42.0102 33.7025L47.2456 27.5996L52.9344 33.7209V39.3772C52.9344 42.1386 50.6958 44.3772 47.9344 44.3772Z"
                    stroke="currentColor"
                    stroke-width="2"
                    class="stroke-gray-400 dark:stroke-neutral-500"
                />
                <circle
                    cx="39.5902"
                    cy="14.9672"
                    r="4.16393"
                    stroke="currentColor"
                    stroke-width="2"
                    class="stroke-gray-400 dark:stroke-neutral-500"
                />
            </svg>
            <div class="mt-4 text-sm">
                <span>Drop your files here or</span>
                <label class="text-blue-600 hover:underline cursor-pointer">
                    browse
                    <input
                        type="file"
                        {accept}
                        class="hidden"
                        onchange={onFileSelect}
                    />
                </label>
            </div>
            <p class="mt-1 text-xs text-gray-400">
                Maximum file size: {maxSize / 1024 / 1024}MB
            </p>
        </div>
    {:else if children}
        {@render children(uploadTask)}
    {:else if uploadTask.error}
        {@render error?.(uploadTask.error)}
    {:else}
        {@render progress?.(uploadTask.progress)}
    {/if}
</div>
