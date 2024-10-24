import { pegarUnicoCliente } from "@/api/clientes/pegar-unico-cliente";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthRedirect } from "@/middlewares/authRedirect";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const DetalhesCliente = () => {
    const token = useAuthRedirect();

    if (!token) {
        return null;
    }

    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data, isLoading } = useQuery({
        queryKey: ['cliente', id],
        queryFn: async () => {
            if (!id) {
                navigate(`/clientes`);
                toast.error(`Cliente não encontrado`);
                return Promise.reject("ID do cliente não encontrado");
            }
            return pegarUnicoCliente({ id });
        },
        enabled: !!id // Executa a consulta somente se id estiver definido
    });

    const cliente = data?.cliente;

    return (
        <>
            <Helmet title="Detalhes do cliente" />
            <Button onClick={() => navigate(-1)} type="button" variant="outline" size="sm" className="mb-2 ml-2">
                <ChevronLeft size={18} className="mr-2" />
                Voltar
            </Button>
            <div className="flex">
                <div className="mr-3">
                    <Card className="w-[40vw] mb-3">
                        <CardHeader>
                            <CardTitle>Detalhes do cliente</CardTitle>
                            <CardDescription>Informações pessoais</CardDescription>
                        </CardHeader>
                        <CardContent className="rounded-lg">
                            <p className="font-bold text-lg">{cliente?.nome}</p>
                            <p className="text-sm font-normal mt-1"><span className="font-medium">E-mail: </span>{cliente?.email}</p>
                            <p className="text-sm"><span className="font-medium">Telefone:</span> {cliente?.telefone}</p>
                            <p className="text-sm"><span className="font-medium">CPF:</span> {cliente?.cpf}</p>
                        </CardContent>
                    </Card>
                    <Card className="w-[40vw]">
                        <CardHeader>
                            <CardTitle>Endereço(s)</CardTitle>
                            <CardDescription>Lista de endereços do cliente</CardDescription>
                        </CardHeader>
                        <CardContent className="mt-2 mb-1 rounded-lg">
                            {cliente?.Enderecos && cliente.Enderecos.length > 0 ? (
                                cliente.Enderecos.map((endereco: any, index: number) => (
                                    <div key={index} className="mb-3">
                                        <div className="mb-3">
                                            <p className="font-bold">{endereco.rua},{endereco.numero}</p>
                                            <p className="text-sm">Bairro {endereco.bairro}, {endereco.cidade} {endereco.estado} / {endereco.cep}</p>
                                        </div>
                                        <Separator />
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-700">Nenhum endereço informado</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card className="w-[40vw]">
                        <CardHeader>
                            <CardTitle>Histórico de compras</CardTitle>
                            <CardDescription>Histórico de compras de {cliente?.nome}</CardDescription>
                        </CardHeader>
                        <CardContent className="mt-2 mb-1 rounded-lg">
                            {cliente?.Carrinho && cliente.Carrinho.length > 0 ? (
                                cliente.Carrinho.map((compra: any, index: number) => (
                                    <div key={index} className="mb-3">
                                        <div className="mb-3">
                                            <p className="text-sm">Valor Total: R$ {compra.valorTotal.toFixed(2)}</p>
                                            <p className="text-sm">Data de Criação: {new Date(compra.date_created).toLocaleDateString()}</p>
                                        </div>
                                        <Separator />
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-700">Nenhum histórico de compras encontrado</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

        </>
    );
}

export default DetalhesCliente;
