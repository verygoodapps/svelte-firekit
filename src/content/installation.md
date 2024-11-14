---
title: Installation
description: Learn how to install and set up Svelte Firekit with Firebase and shadcn-svelte components.
---

## Prerequisites

Before you begin, make sure you have:
- Node.js 16.x or later
- npm, pnpm, or yarn
- A Firebase project created in the Firebase Console

## Step 1: Install Firekit

```bash
# Using npm
npm install @firekit/sveltekit

# Using pnpm
pnpm add @firekit/sveltekit

# Using yarn
yarn add @firekit/sveltekit
```

## Step 2: Firebase Configuration

Create a `.env` file in your project root and add the following Firebase configuration variables:

```env
PUBLIC_FIREBASE_API_KEY=your-api-key
PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
PUBLIC_FIREBASE_PROJECT_ID=your-project-id
PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
PUBLIC_FIREBASE_APP_ID=your-app-id
PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

You can find these values in your Firebase project settings under "Project Settings" > "General" > "Your apps" > "Web app".

## Step 3: Install shadcn-svelte

Initialize shadcn-svelte in your project:

```bash
npx shadcn-svelte@next init
```

During initialization, select the following options:
- Style: Default (or your preferred style)
- Base color: Default (or your preferred color)
- Location of components: src/lib/components
- Include example components: No
- CSS Reset: Yes
- Import aliases: Yes

## Step 4: Install Required Components

Install all the necessary shadcn-svelte components:

```bash
npx shadcn-svelte@next add alert-dialog
npx shadcn-svelte@next add avatar
npx shadcn-svelte@next add breadcrumb
npx shadcn-svelte@next add button
npx shadcn-svelte@next add card
npx shadcn-svelte@next add checkbox
npx shadcn-svelte@next add dropdown-menu
npx shadcn-svelte@next add form
npx shadcn-svelte@next add input
npx shadcn-svelte@next add label
npx shadcn-svelte@next add separator
npx shadcn-svelte@next add sheet
npx shadcn-svelte@next add skeleton
npx shadcn-svelte@next add sonner
npx shadcn-svelte@next add tooltip
```



## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [shadcn-svelte Documentation](https://next.shadcn-svelte.com/)
- [SvelteKit Documentation](https://kit.svelte.dev/docs)

## Troubleshooting

If you encounter any issues:

1. Make sure all environment variables are correctly set
2. Verify that Firebase configuration matches your project settings
3. Check that all shadcn-svelte components are properly installed
4. Ensure your `app.postcss` includes the necessary Tailwind directives
5. Verify that `tailwind.config.js` is properly configured for shadcn-svelte

For additional help, please refer to our [GitHub issues](https://github.com/your-repo/issues) or [Discord community](https://discord.gg/your-server).