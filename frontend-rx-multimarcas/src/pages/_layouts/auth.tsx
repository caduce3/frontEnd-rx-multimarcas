import { Outlet } from "react-router-dom";

export function AuthLayout() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center antialiased">
            <div>
                <Outlet />
            </div>

            <footer className="mt-5">
                Desenvolvido por &copy; Cadu Lucena - {new Date().getFullYear()}
            </footer>
        </div>
    )
}
