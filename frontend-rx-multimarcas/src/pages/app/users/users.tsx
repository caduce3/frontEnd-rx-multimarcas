import { Helmet } from "react-helmet-async";
import {
    Table,
    TableBody,
    TableCaption, TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Pagination } from "@/components/pagination";
import { useAuthRedirect } from "@/middlewares/authRedirect";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getUsers } from "@/api/get-users";
import UsersTableFilters from "./users-table-filters";
import UsersTableRow from "./users-table-row";
import { PlayersTableSkeleton } from "../players/players-table-skeleton";
  

export function Users() {
    const token = useAuthRedirect();

    if (!token) {
        return null;
    }

    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get('page') ?? 1;

    const name = searchParams.get('name') ?? undefined;
    const email = searchParams.get('email') ?? undefined;


    const { data, isLoading } = useQuery({
        queryKey: ['users', page, name, email],
        queryFn: () => getUsers({page: Number(page), name, email})
    });

    function handlePaginate(page: number) {
        setSearchParams(prev => {
            prev.set('page', (page).toString());

            return prev
        })
    }

    return (
        <>
            <Helmet title="Users"/>
            <div className="flex flex-row gap-4 items-center">
                <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
                <UsersTableFilters />
            </div>
            {
                isLoading ? <PlayersTableSkeleton /> 
                :
                <Table className=" bg-[#18181B] rounded-xl ">
                    <TableCaption>Lista de Usuários.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead className="hidden lg:table-cell">E-mail</TableHead>
                            <TableHead className="hidden md:table-cell">Status</TableHead>
                            <TableHead className="hidden sm:table-cell">Setor</TableHead>
                            <TableHead>Detalhes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data && data.usersList.map(users => {
                            return <UsersTableRow key={users.id} users={users}/>
                        })}
                    </TableBody>
                </Table>

            }
            {data && (
                <Pagination currentPage={data.currentPage} totalPages={data.totalPages} totalItens={data.totalItens} onPageChange={handlePaginate}/>
            )}

        </>
    )
}