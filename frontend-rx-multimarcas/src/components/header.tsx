import { Separator } from "./ui/separator";
import { ChartNoAxesCombined, Dices, Users } from "lucide-react";
import { NavLink } from "./nav-link";
import AccountMenu from "./account-menu";
// import logo from "../assets/logoTrofeu.svg";
// import { ThemeToggle } from "./theme/theme-toggle";

const Header = () => {
    return (
        <div className="border-b bg-[#18181B]">
            <div className="flex h-16 items-center gap-6 px-6 justify-between">
                <div className="flex justify-center w-full sm:w-auto">
                    {/* <img src={logo} alt="Trofeu.bet" className="h-6"/> */}
                </div>

                <div className="hidden sm:flex items-center space-x-4 lg:space-x-6">
                    <Separator orientation="vertical" className="h-6" />
                    <nav className="flex items-center space-x-4 lg:space-x-6">
                        <NavLink to="/">
                            <ChartNoAxesCombined className="h-4 w-4"/>
                            Dashboard
                        </NavLink>
                        <NavLink to="/players">
                            <Dices className="h-4 w-4"/>
                            Jogadores
                        </NavLink>
                        <NavLink to="/users">
                            <Users className="h-4 w-4"/>
                            Usuários
                        </NavLink>
                        {/* <ThemeToggle /> */}
                    </nav>
                </div>

                {/* Account Menu */}
                <div className="ml-auto sm:flex items-center gap-2">
                    <AccountMenu />
                </div>
            </div>
        </div>
    );
};

export default Header;
