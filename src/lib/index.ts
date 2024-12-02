// Firebase config
export { firebaseConfig } from './firebase/config.js'
export { firebaseService } from './firebase/firebase.js'

// auth services
// export { firekitUser } from './firebase/auth/user.svelte.js'
// export { firekitAuthGuard } from './firebase/auth/auth-guard.svelte.js'
export { firekitAuthManager } from './firebase/auth/auth-manager.svelte.js'

// firestore services
export { firekitAwaitableDoc } from './firebase/firestore/awaitable-doc.svelte.js'
export { firekitDocMutations } from './firebase/firestore/document-mutations.svelte';
export { firekitCollection } from './firebase/firestore/collection.svelte.js';
export { firekitDoc } from './firebase/firestore/doc.svelte.js';

// Storage services
export { firekitDownloadUrl } from './firebase/storage/download-url.svelte.js';
export { firekitStorageList } from './firebase/storage/storage-list.svelte.js';
export { firekitUploadTask } from './firebase/storage/upload-task.svelte.js';

// auth components
export { default as SignInPage } from './auth/sign-in.svelte';
export { default as SignUpPage } from './auth/sign-up.svelte';
export { default as ResetPassWordPage } from './auth/reset-password.svelte';
export { default as AuthPage } from './auth/auth.svelte';
export { default as RequireAuth } from './auth/require-auth.svelte';
export { default as RequireNoAuth } from './auth/require-no-auth.svelte';


export { default as ResetPassWordForm } from './components/auth/reset-password-form.svelte';
export { default as SignInForm } from './components/auth/sign-in-form.svelte';
export { default as SignUpForm } from './components/auth/sign-up-form.svelte';


export { default as UserButton } from './components/auth/user-button/user-button.svelte';

// firestore components
export { default as Collection } from './components/firestore/collection.svelte'
export { default as Doc } from './components/firestore/doc.svelte'

// storage 
export { default as Upload } from './components/storage/upload.svelte'


