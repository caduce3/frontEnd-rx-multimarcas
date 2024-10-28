import { Pagination } from "@/components/pagination";
import { useAuthRedirect } from "@/middlewares/authRedirect";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { PlayersTableSkeleton } from "../players/players-table-skeleton";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { pegarVendas } from "@/api/vendas/pegar-vendas";
import VendasTableRow from "./vendas-table-row";

const Vendas = () => {

    const token = useAuthRedirect();

    if (!token) {
        return null;
    }

    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get('page') ?? 1;

    const clienteId = searchParams.get('clienteId') ?? undefined;
    const funcionarioId = searchParams.get('funcionarioId') ?? undefined;

    const {data, isLoading} = useQuery({
        queryKey: ['vendas', page, clienteId, funcionarioId],
        queryFn: () => pegarVendas({page: Number(page), clienteId, funcionarioId}),
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
                {/* <ClientesTableFilters />
                <AdicionarClientes /> */}
            </div>
            {
                isLoading ? <PlayersTableSkeleton /> 
                :
                <Table className=" rounded-md border mt-5">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Cliente</TableHead>
                            <TableHead className="hidden lg:table-cell">Colaborador</TableHead>
                            <TableHead className="hidden md:table-cell">Data da venda</TableHead>
                            <TableHead className="hidden sm:table-cell">Valor total</TableHead>
                            <TableHead>Detalhes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data && data.carrinhosList.map(vendas => {
                            return <VendasTableRow key={vendas.id} vendas={vendas}/>
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
 
export default Vendas;