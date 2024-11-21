import type { NavGroup, NavItem } from "$lib/types/nav";
import {
  CircleUserRound,
  BookOpen,
  Bot,
  Settings2,
  SquareTerminal,
  ChartPie,
  Frame,
  Map,
  User,
  LayoutDashboard,
  StickyNote,
} from "lucide-svelte";

export const navMain: NavGroup[] = [
  {
    title: "Platform",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Posts",
        href: "/posts",
        icon: StickyNote,
      },
    ],
  },
  //   {
  //     title: "Account",
  //     items: [
  //       {
  //         title: "Profile",
  //         href: "/account/profile",
  //         icon: User,
  //       },
  //     ],
  //   },
];
