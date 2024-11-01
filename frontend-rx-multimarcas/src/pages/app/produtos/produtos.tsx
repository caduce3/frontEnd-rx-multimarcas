import { pegarProdutos } from "@/api/produtos/pegar-produtos";
import { Pagination } from "@/components/pagination";
import { useAuthRedirect } from "@/middlewares/authRedirect";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ProdutosTableRow from "./produtos-table-row";
import ProdutosTableFilters from "./produtos-table-filters";
import CadastrarProdutos from "./produtos-adicionar";
import { TableSkeleton } from "@/components/table-skeleton";

const Produtos = () => {

    const token = useAuthRedirect();

    if (!token) {
        return null;
    }

    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get('page') ?? 1;

    const nome = searchParams.get('nome') ?? undefined;
    const descricao = searchParams.get('descricao') ?? undefined;
    const preco = searchParams.get('preco') ?? undefined;
    const quantidadeDisponivel = searchParams.get('quantidadeDisponivel') ?? undefined;

    const { data, isLoading } = useQuery({
        queryKey: ['produtos', page, nome, descricao, preco, quantidadeDisponivel],
        queryFn: () => pegarProdutos({
            page: Number(page),
            nome,
            descricao,
            preco: preco ? Number(preco) : undefined,
            quantidadeDisponivel: quantidadeDisponivel ? Number(quantidadeDisponivel) : undefined
        }),
    });

    function handlePaginate(page: number) {
        setSearchParams(prev => {
            prev.set('page', (page).toString());

            return prev
        })
    }

    

    return ( 
        <div className="shadow-lg rounded-lg p-4 w-full">
            <Helmet title="Produtos"/>
            <div className="flex flex-row gap-4 items-center">
                <ProdutosTableFilters />
                <CadastrarProdutos />
            </div>
            {
                isLoading ? <TableSkeleton /> 
                :
                <Table className=" rounded-md border mt-5">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead className="hidden lg:table-cell">Descrição</TableHead>
                            <TableHead className="hidden md:table-cell">Preço</TableHead>
                            <TableHead className="hidden sm:table-cell">Estoque</TableHead>
                            <TableHead>Detalhes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data && data.produtosList.map(produtos => {
                            return <ProdutosTableRow key={produtos.id} produtos={produtos}/>
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
 
export default Produtos;