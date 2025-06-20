"use client";
import {
  Bean,
  Book,
  ChevronRight,
  FileChartPie,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { slugToTitle } from "@/lib/utils";

type NavigationSection = {
  title: string;
  path: string;
  icon: LucideIcon;
  isActive: boolean;
  items: { path: string; label: string }[];
};

const sidebarContent = {
  navigation: [
    {
      title: "Bookkeeping",
      path: "/dashboard/bookkeeping",
      icon: Book,
      isActive: true,
      items: [
        {
          path: "/journal",
          label: "Journal",
        },
        {
          path: "/accounts",
          label: "Accounts",
        },
      ],
    },
    {
      title: "Reports",
      path: "/dashboard/reports",
      icon: FileChartPie,
      isActive: false,
      items: [
        {
          path: "/balance-sheet",
          label: "Balance Sheet",
        },
        {
          path: "/cash-flow-statement",
          label: "Cash Flow Statement",
        },
        {
          path: "/income-statement",
          label: "Income Statement",
        },
        {
          path: "/trial-balance",
          label: "Trial Balance",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const path = usePathname().slice(1).split("/");

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={`/${path[0]}/dashboard`}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-red-800 text-sidebar-primary-foreground">
                  <Bean className="size-4" />
                </div>

                <div className="font-mono font-semibold text-xl">heroni</div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {sidebarContent.navigation.map((section) => (
          <SidebarSection key={section.path} section={section} path={path} />
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

function SidebarSection({
  section,
  path,
}: {
  section: NavigationSection;
  path: string[];
}) {
  const [lang, ...routes] = path;

  return (
    <SidebarGroup>
      <SidebarMenu>
        <Collapsible
          asChild
          defaultOpen={routes.includes(section.path.slice(1))}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={section.title}>
                {section.icon && <section.icon />}
                <span>{section.title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <SidebarMenuSub>
                {section.items?.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.label}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={routes.includes(subItem.path.slice(1))}
                    >
                      <Link
                        href={`/${lang}${section.path === "/" ? "" : section.path}${subItem.path}`}
                      >
                        {subItem.label}
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function AppHeader() {
  const [_, ...routes] = usePathname().slice(1).split("/");

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {routes.map((route, i) => (
              <Fragment key={route}>
                <BreadcrumbItem className="hidden md:block">
                  {slugToTitle(route)}
                </BreadcrumbItem>
                {i < routes.length - 1 && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
