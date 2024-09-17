import { ChartNoAxesCombined, ChevronDown, Dices, LogOut, UserRoundPen, Users } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { getProfileFuncionario } from "@/api/get-profile-funcionario";
import { useAuthRedirect } from "@/middlewares/authRedirect";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { FuncionarioProfileDialog } from "./funcionario-profile-dialog";
import { NavLink } from "./nav-link";

const AccountMenu = () => {
    const navigate = useNavigate();
    const token = useAuthRedirect();

    if (!token) {
        return null;
    }

    const { data: profileFuncionario, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['profileFuncionario'],
        queryFn: getProfileFuncionario,
        staleTime: Infinity
    });

    const handleLogout = () => {
        localStorage.removeItem('authToken');  // Remove o token do armazenamento local
        navigate('/sign-in');  // Redireciona para a página inicial
    };

    return ( 
        <Dialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex select-none items-center gap-2 rounded-xl">
                        
                        <ChevronDown className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                    
                    <DropdownMenuLabel className="flex flex-col">
                        <span>{isLoadingProfile ? <Skeleton className="h-4 w-40"/> : profileFuncionario?.nome }</span>
                        <span className="text-xs font-normal text-muted-foreground">{profileFuncionario?.email}</span>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="cursor-pointer">
                        <NavLink to="/" className="flex items-center">
                            <ChartNoAxesCombined className="mr-2 h-4 w-4" />
                            Dashboard
                        </NavLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                        <NavLink to="/players" className="flex items-center">
                            <Dices  className="mr-2 h-4 w-4"/>
                            Jogadores
                        </NavLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                        <NavLink to="/colaboradores" className="flex items-center">
                            <Users className="mr-2 h-4 w-4"/>
                            Colaboradores
                        </NavLink>
                    </DropdownMenuItem>
                    <DialogTrigger asChild>
                        <DropdownMenuItem className="cursor-pointer">
                            <UserRoundPen className="mr-2 h-4 w-4"/>
                            <span>Meu perfil</span>
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DropdownMenuItem className="text-rose-500 dark:text-rose-400 cursor-pointer" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4"/>
                        <span>Sair</span>
                    </DropdownMenuItem>
                    
                </DropdownMenuContent>
            </DropdownMenu>

            <FuncionarioProfileDialog />
        </Dialog>
     );
}
 
export default AccountMenu;
