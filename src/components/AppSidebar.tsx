import { Calculator, Home, CreditCard, LogIn, Menu, Star } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Formula Creator", url: "/", icon: Home },
  { title: "Multi-Calculadora", url: "/compound-interest-2", icon: Calculator },
  { title: "Planos", url: "/planos", icon: CreditCard },
];

const authItems = [
  { title: "Login", url: "/auth", icon: LogIn },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" : "hover:bg-primary/5 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar
      className="border-r border-primary/20 bg-gradient-sidebar"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-primary/20 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-accent rounded-lg shadow-glow">
            <Star className="h-6 w-6 text-primary-glow" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
                Formula Hub
              </h2>
              <p className="text-xs text-muted-foreground">
                Calculadoras Avançadas
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-3 mb-2">
            {!isCollapsed ? "Principais" : ""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11 px-3">
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className={`h-5 w-5 ${isCollapsed ? "mx-auto" : "mr-3"}`} />
                      {!isCollapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!user && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-3 mb-2">
              {!isCollapsed ? "Conta" : ""}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {authItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="h-11 px-3">
                      <NavLink to={item.url} className={getNavCls}>
                        <item.icon className={`h-5 w-5 ${isCollapsed ? "mx-auto" : "mr-3"}`} />
                        {!isCollapsed && <span className="font-medium">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {user && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-3 mb-2">
              {!isCollapsed ? "Usuário" : ""}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-3 py-2">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Conectado
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}