import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";

export function AppLayout() {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen flex-col antialiased">
                <div className="flex h-screen w-screen">
                    <AppSidebar />
                    <div className="p-8 pt-6 flex-1">
                        <SidebarTrigger />
                        <Outlet />
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
