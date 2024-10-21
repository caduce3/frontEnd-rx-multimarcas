import { Boxes, ChartNoAxesCombined, ChevronUp, LogOut, ShoppingCart, User2, Users } from "lucide-react"
import logo from "../assets/logoRXmulti.png"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuthRedirect } from "@/middlewares/authRedirect"
import { getProfileFuncionario } from "@/api/get-profile-funcionario"
import { useQuery } from "@tanstack/react-query";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Skeleton } from "./ui/skeleton"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Vendas",
    url: "#",
    icon: ShoppingCart,
  },
  {
    title: "Produtos",
    url: "#",
    icon: Boxes,
  },
  {
    title: "Colaboradores",
    url: "/colaboradores",
    icon: Users,
  }
]

export function AppSidebar() {

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
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mt-9 mb-9">
            <div>
                <img src={logo} alt="RX Multimarcas" className="w-48 mb-4" />   
            </div>
          </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu className="">
                    {items.map((item) => {
                    const location = useLocation();
                    const isActive = location.pathname === item.url;

                    return (
                        <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                            <a 
                            href={item.url}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md mb-2 transition-colors duration-200 ${
                                isActive
                                ? "bg-[#EAF5FB] text-[#2D9CDB]"  // Estilo aplicado quando ativo
                                : "text-[#000] hover:bg-[#EAF5FB] hover:text-[#2D9CDB]"  // Estilo hover
                            }`}
                            >
                            <item.icon />
                            <span>{item.title}</span>
                            </a>
                        </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
      <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> 
                    <div className="flex flex-col mr-">
                        <span>{isLoadingProfile ? <Skeleton className="h-4 w-40"/> : profileFuncionario?.nome }</span>
                        <span className="text-xs font-normal text-muted-foreground">{profileFuncionario?.email}</span>
                    </div>
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem className="text-rose-500 dark:text-rose-400 cursor-pointer" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4"/>
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
