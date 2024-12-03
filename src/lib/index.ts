// Firebase config
export { firebaseConfig } from './config.js'
export { firebaseService } from './firebase.js'

// auth services
export { firekitUser } from './auth/user.svelte.js'
export { firekitAuth } from './auth/auth.js'

// firestore services
export { firekitAwaitableDoc } from './firestore/awaitable-doc.svelte.js'
export { firekitDocMutations } from './firestore/document-mutations.svelte';
export { firekitCollection } from './firestore/collection.svelte.js';
export { firekitDoc } from './firestore/doc.svelte.js';

// Storage services
export { firekitDownloadUrl } from './storage/download-url.svelte.js';
export { firekitStorageList } from './storage/storage-list.svelte.js';
export { firekitUploadTask } from './storage/upload-task.svelte.js';


