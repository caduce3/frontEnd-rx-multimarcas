// import { Trophy } from "lucide-react";
import { Outlet } from "react-router-dom";

export function AuthLayout() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center antialiased">
            <div className="flex items-center gap-3 text-lg text-foreground mt-4">
                {/* <Trophy size={28} />
                <span className="font-semibold">Trofeu.bet</span> */}
            </div>
            <div>
                <Outlet />
            </div>

            <footer className="mt-5">
                Painel do usuário &copy; trofeu.bet - {new Date().getFullYear()}
            </footer>
        </div>
    )
}
