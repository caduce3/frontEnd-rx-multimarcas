import { Separator } from "./ui/separator";
import AccountMenu from "./account-menu";
import { useQuery } from "@tanstack/react-query";
import { getProfileFuncionario } from "@/api/get-profile-funcionario";
import { Skeleton } from "./ui/skeleton";

const Header = () => {

    const { data: profileFuncionario, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['profileFuncionario'],
        queryFn: getProfileFuncionario,
        staleTime: Infinity
    });


    return (
        <div className="border-b bg-[#FFFFFF]">
            <div className="flex h-16 gap-6 px-6">
                <div className="ml-auto sm:flex items-center gap-2">
                    <span>{isLoadingProfile ? <Skeleton className="h-4 w-40"/> : profileFuncionario?.nome }</span>
                    <Separator orientation="vertical" className="h-6" />
                    <AccountMenu />
                </div>
            </div>
        </div>
    );
};

export default Header;
