import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTimeToPTBR } from "@/services/formated-data-pt-br";
import { Search } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCallback } from "react";

interface Compra {
    id: string;
    clientId: string;
    funcionarioId: string;
    valorTotal: number;
    total_deposit_amount: number;
    dateCreated: string;
    dateUpdated: string;
}

interface HistoricoComprasProps {
    cliente?: {
        nome: string;
        Carrinho: Compra[];
    };
}

const ITEMS_PER_PAGE = 5;

const HistoricoComprasCliente = ({ cliente }: HistoricoComprasProps) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') ?? '1', 10);

    const navigate = useNavigate();

    const handlePaginate = useCallback(
        (newPage: number) => {
            setSearchParams((prev) => {
                prev.set('page', newPage.toString());
                return prev;
            });
        },
        [setSearchParams]
    );

    if (!cliente?.Carrinho || cliente.Carrinho.length === 0) {
        return <p className="text-gray-700 text-center">Nenhum histórico de compras encontrado</p>;
    }

    // Cálculo de índices para a paginação
    const totalItems = cliente.Carrinho.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const comprasParaExibir = cliente.Carrinho.slice(startIndex, endIndex);

    const handleDetailsClick = (id: string) => {
        navigate(`/vendas/${id}`);
    };

    return (
        <>
            <Card className="w-[39vw] p-2">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Histórico de compras</CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                        Histórico de compras de {cliente?.nome}
                    </CardDescription>
                </CardHeader>
                <CardContent className="mt-2 mb-1 rounded-lg">
                    {comprasParaExibir.length > 0 ? (
                        comprasParaExibir.map((compra) => (
                            <div
                                key={compra.id}
                                className="mb-4 p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex justify-between items-center"
                            >
                                <div className="mb-2">
                                    <p className="text-lg font-bold">R$ {compra.valorTotal.toFixed(2)}</p>
                                    <p className="text-sm text-gray-500">
                                        Data: {formatDateTimeToPTBR(compra.dateCreated)}
                                    </p>
                                </div>
                                <div>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => handleDetailsClick(compra.id)}
                                    >
                                        <Search className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-700 text-center">Nenhum histórico de compras encontrado</p>
                    )}
                </CardContent>
                {totalPages > 1 && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        totalItens={totalItems} // Corrigido aqui
                        onPageChange={handlePaginate}
                    />
                )}
            </Card>
        </>
    );
};

export default HistoricoComprasCliente;
