import { Box, ChartNoAxesCombined, ClipboardList, UserRoundCog, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logoRXmulti.png"

const NavLateral = () => {


    return (
        <div className="shadow-lg rounded-lg w-56">
            <div className="flex h-auto gap-6 px-6 py-4 flex-col items-center">
                {/* Imagem ajustada */}
                <div>
                    <img src={logo} alt="RX Multimarcas" className="w-48 mb-4" />   
                </div>

                {/* NavLink */}
                <div className="sm:flex items-center gap-2">
                    <nav className="">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 rounded-md mb-2 transition-colors duration-200 ${
                                isActive
                                ? "bg-[#EAF5FB] text-[#2D9CDB]"
                                : "text-[#000] hover:bg-[#EAF5FB] hover:text-[#2D9CDB]"
                            }`
                            }
                        >
                            <ChartNoAxesCombined className="h-5 w-5" />
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="/vendas"
                            className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 rounded-md mb-2 transition-colors duration-200 ${
                                isActive
                                ? "bg-[#EAF5FB] text-[#2D9CDB]"
                                : "text-[#000] hover:bg-[#EAF5FB] hover:text-[#2D9CDB]"
                            }`
                            }
                        >
                            <ClipboardList  className="h-5 w-5" />
                            Vendas
                        </NavLink>

                        <NavLink
                            to="/estoque"
                            className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 rounded-md mb-2 transition-colors duration-200 ${
                                isActive
                                ? "bg-[#EAF5FB] text-[#2D9CDB]"
                                : "text-[#000] hover:bg-[#EAF5FB] hover:text-[#2D9CDB]"
                            }`
                            }
                        >
                            <Box className="h-5 w-5" />
                            Estoque
                        </NavLink>

                        <NavLink
                            to="/clientes"
                            className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 rounded-md mb-2 transition-colors duration-200 ${
                                isActive
                                ? "bg-[#EAF5FB] text-[#2D9CDB]"
                                : "text-[#000] hover:bg-[#EAF5FB] hover:text-[#2D9CDB]"
                            }`
                            }
                        >
                            <Users className="h-5 w-5" />
                            Clientes
                        </NavLink>

                        <NavLink
                            to="/colaboradores"
                            className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 rounded-md mb-2 transition-colors duration-200 ${
                                isActive
                                ? "bg-[#EAF5FB] text-[#2D9CDB]"
                                : "text-[#000] hover:bg-[#EAF5FB] hover:text-[#2D9CDB]"
                            }`
                            }
                        >
                            <UserRoundCog className="h-5 w-5" />
                            Colaboradores
                        </NavLink>
                    </nav>

                </div>

                <p className="text-xs mt-36 text-center">
                    Desenvolvido por &copy; Cadu Lucena - {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
};

export default NavLateral;
