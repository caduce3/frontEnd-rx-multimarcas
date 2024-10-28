import { Helmet } from "react-helmet-async";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Pagination } from "@/components/pagination";
import { useAuthRedirect } from "@/middlewares/authRedirect";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getFuncionarios } from "@/api/get-funcionarios";
import { PlayersTableSkeleton } from "../players/players-table-skeleton";
import FuncionariosTableRow from "./funcionarios-table-row";
import FuncionariosTableFilters from "./funcionarios-table-filters";
import { verifyAccessByJwt } from "@/services/verificar-acesso-pagina";
import { useEffect } from "react";
import { toast } from "sonner";
  

export function Funcionarios() {
    const token = useAuthRedirect();
    const navigate = useNavigate();

    if (!token) {
        return null;
    }

    useEffect(() => {
        if (verifyAccessByJwt(token ?? '', ["PROPRIETARIO", "ADMINISTRADOR"]) === false) {
            navigate("/");
            toast.error("Você não tem permissão para acessar essa página");
        }
    }, [token, navigate]); 

    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get('page') ?? 1;

    const nome = searchParams.get('nome') ?? undefined;
    const email = searchParams.get('email') ?? undefined;


    const { data, isLoading } = useQuery({
        queryKey: ['funcionarios', page, nome, email],
        queryFn: () => getFuncionarios({page: Number(page), nome, email})
    });

    function handlePaginate(page: number) {
        setSearchParams(prev => {
            prev.set('page', (page).toString());

            return prev
        })
    }

    return (
        <div className="shadow-lg rounded-lg p-4 w-full">
            <Helmet title="Colaboradores"/>
            <div className="flex flex-row gap-4 items-center">
                <FuncionariosTableFilters />
            </div>
            {
                isLoading ? <PlayersTableSkeleton /> 
                :
                <Table className=" rounded-md border mt-5">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead className="hidden lg:table-cell">E-mail</TableHead>
                            <TableHead className="hidden md:table-cell">Status</TableHead>
                            <TableHead className="hidden sm:table-cell">Cargo</TableHead>
                            <TableHead>Detalhes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data && data.funcionariosList.map(funcionarios => {
                            return <FuncionariosTableRow key={funcionarios.id} funcionarios={funcionarios}/>
                        })}
                    </TableBody>
                </Table>

            }
            {data && (
                <Pagination currentPage={data.currentPage} totalPages={data.totalPages} totalItens={data.totalItens} onPageChange={handlePaginate}/>
            )}

        </div>
    )
}