import { getClientes } from "@/api/clientes/get-clientes";
import { Pagination } from "@/components/pagination";
import { useAuthRedirect } from "@/middlewares/authRedirect";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { PlayersTableSkeleton } from "../players/players-table-skeleton";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ClientesTableFilters from "./clientes-table-filters";
import ClientesTableRow from "./clientes-table-row";

const Clientes = () => {

    const token = useAuthRedirect();

    if (!token) {
        return null;
    }

    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get('page') ?? 1;

    const nome = searchParams.get('nome') ?? undefined;
    const telefone = searchParams.get('telefone') ?? undefined;
    const email = searchParams.get('email') ?? undefined;
    const cpf = searchParams.get('cpf') ?? undefined;

    const {data, isLoading} = useQuery({
        queryKey: ['clientes', page, nome, telefone, email, cpf],
        queryFn: () => getClientes({page: Number(page), nome, telefone, email, cpf}),
    })

    function handlePaginate(page: number) {
        setSearchParams(prev => {
            prev.set('page', (page).toString());

            return prev
        })
    }

    return ( 
        <div className="shadow-lg rounded-lg p-4 w-full">
            <Helmet title="Clientes"/>
            <div className="flex flex-row gap-4 items-center">
                <ClientesTableFilters />
            </div>
            {
                isLoading ? <PlayersTableSkeleton /> 
                :
                <Table className=" rounded-md border mt-5">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead className="hidden lg:table-cell">E-mail</TableHead>
                            <TableHead className="hidden md:table-cell">Telefone</TableHead>
                            <TableHead className="hidden sm:table-cell">CPF</TableHead>
                            <TableHead>Detalhes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data && data.clientesList.map(clientes => {
                            return <ClientesTableRow key={clientes.id} clientes={clientes}/>
                        })}
                    </TableBody>
                </Table>

            }
            {data && (
                <Pagination currentPage={data.currentPage} totalPages={data.totalPages} totalItens={data.totalItens} onPageChange={handlePaginate}/>
            )}

        </div>
     );
}
 
export default Clientes;