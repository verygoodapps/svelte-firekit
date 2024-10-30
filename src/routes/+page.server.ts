import { signInSchema } from '$lib/schemas/sign-in.js';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { fail, superValidate } from 'sveltekit-superforms';

import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(signInSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(signInSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}
	}
};
