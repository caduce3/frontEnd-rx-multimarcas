import { pegarUnicaVenda } from "@/api/vendas/pegar-unica-venda";
import { Button } from "@/components/ui/button";
import { useAuthRedirect } from "@/middlewares/authRedirect";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTimeToPTBR } from "@/services/formated-data-pt-br";
import ProdutoCard from "../../produtos/produto-card-separado";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const DetalhesVenda = () => {
    const token = useAuthRedirect();

    if (!token) {
        return null;
    }

    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data, isLoading } = useQuery({
        queryKey: ['detalhes_venda', id],
        queryFn: async () => {
            if (!id) {
                navigate(`/vendas`);
                toast.error(`Venda não encontrado`);
                return Promise.reject("ID da venda não encontrado");
            }
            return pegarUnicaVenda({ id });
        },
        enabled: !! id 
    });

    const carrinho = data?.carrinho;

    return (
        <>
            <Helmet title="Detalhes da venda" />
            <Button onClick={() => navigate(-1)} type="button" variant="default" size="sm" className="mb-2 ml-2">
                <ChevronLeft size={18} className="mr-2" />
                Voltar
            </Button>
            <div className="flex justify-center">
                <Card className="w-full max-w-[500px] border-none items-center">
                    <CardContent className="rounded-lg max-w-[500px]">
                        <p className="font-semibold text-3xl mb-4 text-center">RX Multimarcas</p>
                        <Separator />
                        <div className="mt-7 mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Produtos</h3>
                            {
                                isLoading ? <Skeleton className="h-[30px] w-[300px]"/> : 

                                <div className="">
                                    {carrinho?.ItemCarrinho.map((item) => (
                                        <div className="m-1"> 
                                            <ProdutoCard key={item.id} idProduto={item.produtoId} />
                                        </div>
                                    ))}
                                </div>
                            }
                            
                        </div>

                        <div className="flex flex-col mb-4">
                            <Separator />
                            <div>
                                <div className="flex items-center justify-between p-3">
                                    <p className="text-normal font-semibold">Subtotal</p>
                                    {
                                        isLoading ? <Skeleton className="h-[30px] w-[300px]"/> :
                                        <p className="text-normal font-semibold">R$ {carrinho?.subtotal?.toFixed(2)}</p>
                                    }
                                </div>
                                
                                <div className="flex items-center justify-between p-3">
                                    <p className="text-normal  text-gray-400">Desconto</p>
                                    {
                                        isLoading ? <Skeleton className="h-[30px] w-[300px]"/> :
                                        <p className="text-normal  text-green-500">-{carrinho?.desconto?.toFixed(2)} %</p>
                                    }
                                </div>

                                <div className="flex items-center justify-between p-3">
                                    <p className="text-normal  text-gray-400">Forma de pagamento</p>
                                    {
                                        isLoading ? <Skeleton className="h-[30px] w-[300px]"/> :
                                        <p className="text-normal  text-gray-400">{carrinho?.tipoPagamento}</p> 
                                    }
                                </div>

                                <div className="flex items-center justify-between p-3">
                                    <p className="text-normal  font-semibold">Total:</p>
                                    {
                                        isLoading ? <Skeleton className="h-[30px] w-[300px]"/> :
                                        <p className="text-normal font-semibold">R$ {carrinho?.valorTotal?.toFixed(2)}</p>
                                    }
                                </div>
                            </div>
                        </div>
                        <Separator />

                        <p className="text-normal  font-semibold p-3">Dados do cliente</p>
                        <div className="flex flex-col">
                            <div className="flex items-center justify-between p-3">
                                <p className="text-normal  text-gray-400">Nome</p>
                                {
                                    isLoading ? <Skeleton className="h-[30px] w-[300px]"/> :
                                    <p className="text-normal  text-gray-400">{carrinho?.Clientes.nome}</p>
                                }
                            </div>

                            <div className="flex items-center justify-between p-3">
                                <p className="text-normal  text-gray-400">Email</p>
                                {
                                    isLoading ? <Skeleton className="h-[30px] w-[300px]"/> :
                                    <p className="text-normal  text-gray-400">{carrinho?.Clientes.email}</p>
                                }
                            </div>

                            <div className="flex items-center justify-between p-3">
                                <p className="text-normal  text-gray-400">Telefone</p>
                                {
                                    isLoading ? <Skeleton className="h-[30px] w-[300px]"/> :
                                    <p className="text-normal  text-gray-400">{carrinho?.Clientes.telefone}</p>
                                }
                            </div>
                            <Separator />
                        </div>

                        <p className="text-normal  font-semibold p-3">Informações complementares do pedido</p>
                        <div className="flex flex-col">
                            <div className="flex items-center justify-between p-3">
                                <p className="text-normal  text-gray-400">N° do pedido</p>
                                {
                                    isLoading ? <Skeleton className="h-[30px] w-[300px]"/> :
                                    <p className="text-normal  text-gray-400">{carrinho?.id}</p>
                                }
                            </div>

                            <div className="flex items-center justify-between p-3">
                                <p className="text-normal  text-gray-400">Data do pedido</p>
                                {
                                    isLoading ? <Skeleton className="h-[30px] w-[300px]"/> :
                                    <p className="text-normal  text-gray-400">{formatDateTimeToPTBR(carrinho?.dateCreated ?? "Não informado")}</p>
                                }
                            </div>

                            <div className="flex items-center justify-between p-3">
                                <p className="text-normal  text-gray-400">Status do pedido</p>
                                <p className="text-normal  text-gray-400">
                                    <Badge variant="default">Concluído</Badge>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default DetalhesVenda;
