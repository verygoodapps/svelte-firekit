import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { error } from '@sveltejs/kit';
import type { DocResolver } from '$lib/types/docs.js';

type Modules = Record<string, () => Promise<unknown>>;

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Options for initial generation
 */
type InitialsOptions = {
	maxLength?: number;
	fallback?: string;
};

/**
 * Extracts initials from a given name string
 * @param name - Full name to extract initials from
 * @param options - Optional configuration for initial generation
 * @returns Generated initials or fallback value
 * @example
 * getInitials("John Doe") // returns "JD"
 * getInitials("Jane") // returns "J"
 * getInitials("") // returns ""
 * getInitials(null, { fallback: "NA" }) // returns "NA"
 */
export function getInitials(
	name: string | null | undefined,
	options: InitialsOptions = {}
): string {
	const { maxLength = 2, fallback = '' } = options;

	try {
		// Handle empty/invalid input
		if (!name?.trim()) {
			return fallback;
		}

		// Split and filter out empty parts
		const nameParts = name
			.trim()
			.split(' ')
			.filter(part => part.length > 0);

		// Handle empty array after filtering
		if (nameParts.length === 0) {
			return fallback;
		}

		// Handle single word
		if (nameParts.length === 1) {
			const initial = nameParts[0].charAt(0).toUpperCase();
			return initial || fallback;
		}

		// Get first and last initials
		const firstInitial = nameParts[0].charAt(0).toUpperCase();
		const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();

		// Combine initials and ensure max length
		const initials = (firstInitial + lastInitial).slice(0, maxLength);

		return initials || fallback;
	} catch (error) {
		console.error('Error generating initials:', error);
		return fallback;
	}
}



export function slugFromPath(path: string) {
	return path.replace('/src/content/', '').replace('.md', '');
}

export async function getDoc(slug: string) {
	const modules = import.meta.glob(`/src/content/**/*.md`);
	const match = findMatch(slug, modules);
	const doc = await match?.resolver?.();

	if (!doc || !doc.metadata) {
		error(404);
	}

	return {
		component: doc.default,
		metadata: doc.metadata,
		title: doc.metadata.title
	};
}

function findMatch(slug: string, modules: Modules) {
	let match: { path?: string; resolver?: DocResolver } = {};

	for (const [path, resolver] of Object.entries(modules)) {
		if (slugFromPath(path) === slug) {
			match = { path, resolver: resolver as unknown as DocResolver };
			break;
		}
	}
	if (!match.path) {
		match = getIndexDocIfExists(slug, modules);
	}

	return match;
}

export function slugFromPathname(pathname: string) {
	return pathname.split('/').pop() ?? '';
}

function getIndexDocIfExists(slug: string, modules: Modules) {
	let match: { path?: string; resolver?: DocResolver } = {};

	for (const [path, resolver] of Object.entries(modules)) {
		if (path.includes(`/${slug}/index.md`)) {
			match = { path, resolver: resolver as unknown as DocResolver };
			break;
		}
	}

	return match;
}