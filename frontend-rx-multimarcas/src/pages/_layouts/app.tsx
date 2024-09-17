import Header from "@/components/header";
import NavLateral from "@/components/navegador-lateral";
import { Outlet } from "react-router-dom";

export function AppLayout() {
    return (
        <div className="flex min-h-screen flex-col antialiased">
            <Header />
            <div className="flex h-screen">
                <div className="p-4">
                    <NavLateral />
                </div>

                <div className="flex-1 p-8 pt-6 bg-white">
                    <Outlet />
                </div>
            </div>

        </div>
    )
}