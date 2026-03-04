import { BarChart3, Upload, BookOpen } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const items = [
  { title: 'Dashboard', url: '/', icon: BarChart3 },
  { title: 'Upload Data', url: '/upload', icon: Upload },
  { title: 'Methodology', url: '/methodology', icon: BookOpen },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="pt-6">
        {!collapsed && (
          <div className="px-4 pb-6 mb-2 border-b border-border">
            <h2 className="text-sm font-semibold tracking-wide text-foreground">MOSAIC</h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">Next Big Product Radar</p>
          </div>
        )}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={`relative flex items-center gap-3 px-4 py-2.5 text-sm transition-colors rounded-none ${
                          isActive
                            ? 'text-primary bg-primary/5'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                        }`}
                        activeClassName=""
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1 bottom-1 w-[3px] bg-primary rounded-r" />
                        )}
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
