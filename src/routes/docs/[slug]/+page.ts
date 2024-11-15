import type { EntryGenerator, PageLoad } from './$types.js';
import { getDoc } from '$lib/utils.js';

export const load: PageLoad = async ({ params }) => {
    const { component, title, metadata } = await getDoc(params.slug);
    return {
        component,
        metadata,
        title
    };
};

export const entries: EntryGenerator = () => {
    const modules = import.meta.glob('/src/content/**/*.md');
    const entries = [];

    for (const path of Object.keys(modules)) {
        const slug = path.replace('/src/content/', '').replace('.md', '').replace('/index', '');
        entries.push({ slug });
    }

    return entries;
};
