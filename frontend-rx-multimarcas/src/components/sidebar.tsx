import { Boxes, ChartNoAxesCombined, LogOut, ShoppingCart, User2, UserRoundCog, Users } from "lucide-react"
import logo from "../assets/logoRXbranca.png"
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
    title: "Clientes",
    url: "#",
    icon: Users,
  },
  {
    title: "Produtos",
    url: "#",
    icon: Boxes,
  },
  {
    title: "Colaboradores",
    url: "/colaboradores",
    icon: UserRoundCog,
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
      <SidebarContent className="bg-black">
        <SidebarGroup>
          <SidebarGroupLabel className="m-auto mt-9 mb-9">
            <div>
                <img src={logo} alt="RX Multimarcas" className="w-40 mb-4" />   
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
                                  ? "bg-[#FFFFFF] text-[#000000]"  // Estilo quando o item está ativo
                                  : "text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#000000]"  // Estilo padrão com hover (texto cinza)
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
      <SidebarFooter className="bg-black">
          <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-black">
                  <User2 className="text-[#FFFFFF]"/> 
                  <div className="flex flex-col text-[#FFFFFF]">
                      <span className="">{isLoadingProfile ? <Skeleton className="h-4 w-40"/> : profileFuncionario?.nome }</span>
                      <span className="text-xs font-normal">{profileFuncionario?.email}</span>
                  </div>
                  <LogOut className="ml-12 h-6 w-6 text-rose-500 dark:text-rose-400 cursor-pointer" onClick={handleLogout}/>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  )
}
