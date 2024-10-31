export type NavItem = {
	title: string;
	href?: string;
	disabled?: boolean;
	external?: boolean;
	icon?: any;
	label?: string;
	items?: NavItem[];
};
