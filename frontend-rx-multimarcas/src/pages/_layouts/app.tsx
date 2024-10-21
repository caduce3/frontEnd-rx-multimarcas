import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";

export function AppLayout() {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen flex-col antialiased">
                <div className="flex h-screen">
                    <AppSidebar />
                    <div className="flex-1 p-8 pt-6 bg-white">
                        <SidebarTrigger />
                        <Outlet />
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
