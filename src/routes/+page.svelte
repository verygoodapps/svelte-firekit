<script lang="ts">
    import FooterMain from "$lib/components/public/footer-main.svelte";
    import NavMain from "$lib/components/public/nav-main.svelte";

    const features: Feature[] = [
        {
            title: "Authentication",
            description: "Complete auth system with built-in components.",
            emoji: "🔐",
            url: "/docs/auth/firekit-auth",
        },
        {
            title: "Firestore Integration",
            description: "Reactive data stores and CRUD operations.",
            emoji: "🔥",
            url: "/docs/firestore/firekit-doc",
        },
        {
            title: "Storage Management",
            description: "File upload and management utilities.",
            emoji: "📦",
            url: "/docs/storage/upload-task",
        },
        {
            title: "Route Protection",
            description: "Protected routes and authorization controls.",
            emoji: "🛡️",
            url: "/docs/auth/auth-guard",
        },
        {
            title: "Type Safety",
            description: "Built with TypeScript for better development.",
            emoji: "⚡",
            url: "/docs/configuration",
        },
        {
            title: "SSR Support",
            description: "Full server-side rendering compatibility.",
            emoji: "🚀",
            url: "/docs/advanced/custom-firebase-integration",
        },
        {
            title: "UI Components",
            description: "Pre-built components for common use cases.",
            emoji: "🎨",
            url: "/docs/auth/sign-in-page",
        },
        {
            title: "Real-time Updates",
            description: "Live data synchronization with Firestore.",
            emoji: "🔄",
            url: "/docs/firestore/firekit-collection",
        },
    ];
</script>

<NavMain />

<!-- Hero -->
<div
    class="relative overflow-hidden before:absolute before:top-0 before:start-1/2 before:bg-[url('/polygon-bg-element.svg')] dark:before:bg-[url('/polygon-bg-element-dark.svg')] before:bg-no-repeat before:bg-top before:bg-cover before:size-full before:-z-[1] before:transform before:-translate-x-1/2"
>
    <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        <!-- Announcement Banner -->
        <div class="flex justify-center">
            <a
                class="inline-flex items-center gap-x-2 bg-white border border-gray-200 text-sm text-gray-800 p-1 ps-3 rounded-full transition hover:border-gray-300 focus:outline-none focus:border-gray-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-neutral-600 dark:focus:border-neutral-600"
                href="#"
            >
                Free SASS template - Join to waitlist
                <span
                    class="py-1.5 px-2.5 inline-flex justify-center items-center gap-x-2 rounded-full bg-gray-200 font-semibold text-sm text-gray-600 dark:bg-neutral-700 dark:text-neutral-400"
                >
                    <svg
                        class="shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg
                    >
                </span>
            </a>
        </div>
        <!-- End Announcement Banner -->

        <!-- Title -->
        <div class="mt-5 max-w-2xl text-center mx-auto">
            <h1
                class="block font-bold text-gray-800 text-4xl md:text-5xl lg:text-6xl dark:text-neutral-200"
            >
                Firebase Toolkit for
                <span
                    class="bg-clip-text bg-gradient-to-tl from-blue-600 to-violet-600 text-transparent"
                >
                    SvelteKit</span
                >
            </h1>
        </div>
        <!-- End Title -->

        <div class="mt-5 max-w-3xl text-center mx-auto">
            <p class="text-lg text-gray-600 dark:text-neutral-400">
                Firebase toolkit designed for seamless integration with
                SvelteKit applications. Empower your projects with robust
                Firebase utilities, reactive data handling, and components.
            </p>
        </div>

        <!-- Buttons -->
        <div class="mt-8 gap-3 flex justify-center">
            <a
                class="inline-flex justify-center items-center gap-x-3 text-center bg-gradient-to-tl from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 border border-transparent text-white text-sm font-medium rounded-md focus:outline-none focus:from-violet-600 focus:to-blue-600 py-3 px-4"
                href="/docs"
            >
                Get started
                <svg
                    class="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg
                >
            </a>
            <button
                type="button"
                class="relative group p-2 ps-3 inline-flex items-center gap-x-2 text-sm font-mono rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            >
                $ npm i svelte-firekit
                <span
                    class="flex justify-center items-center bg-gray-200 rounded-md size-7 dark:bg-neutral-700 dark:text-neutral-400"
                >
                    <svg
                        class="shrink-0 size-4 group-hover:rotate-6 transition"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        ><rect
                            width="8"
                            height="4"
                            x="8"
                            y="2"
                            rx="1"
                            ry="1"
                        /><path
                            d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                        /></svg
                    >
                </span>
            </button>
        </div>
        <!-- End Buttons -->
    </div>
</div>
<section class="max-w-6xl mx-auto py-20">
    <div class="max-w-3xl mb-10 lg:mb-14">
        <h2 class=" font-semibold text-2xl md:text-4xl md:leading-tigh">
            Features
        </h2>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each features as feature}
            <a
                href={feature.url}
                class="group hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all p-4 border border-gray-200 rounded-lg dark:border-neutral-700"
            >
                <div>
                    <div>
                        <h3
                            class="block font-bold text-gray-800 dark:text-white"
                        >
                            <span class="mr-2">{feature.emoji}</span>
                            {feature.title}
                        </h3>
                        <p class="text-gray-600 dark:text-neutral-400">
                            {feature.description}
                        </p>
                    </div>
                    <p
                        class="mt-3 inline-flex items-center gap-x-1 text-sm font-semibold text-gray-800 dark:text-neutral-200"
                    >
                        Learn more
                        <svg
                            class="shrink-0 w-4 h-4 transition ease-in-out group-hover:translate-x-1 group-focus:translate-x-1"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </p>
                </div>
            </a>
        {/each}
    </div>
</section>
