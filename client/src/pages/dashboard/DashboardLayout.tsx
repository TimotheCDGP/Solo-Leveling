import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSideBar";
import { SiteHeader } from "@/components/dashboard/SiteHeader";
import { Outlet } from "react-router-dom"; // 👈 L'élément magique

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
           <Outlet /> 
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}