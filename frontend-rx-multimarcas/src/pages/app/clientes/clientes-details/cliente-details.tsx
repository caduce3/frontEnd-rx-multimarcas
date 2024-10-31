import { pegarUnicoCliente } from "@/api/clientes/pegar-unico-cliente";
import { Button } from "@/components/ui/button";
import { useAuthRedirect } from "@/middlewares/authRedirect";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import ClienteDetalhesPessoaisCard from "./cliente-card-info-pessoais";
import ClienteEnderecosCard from "./endereco/cliente-card-info-endereco";
import HistoricoComprasCliente from "./cliente-historico-compras";

const DetalhesCliente = () => {
    const token = useAuthRedirect();

    if (!token) {
        return null;
    }

    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data, isLoading } = useQuery({
        queryKey: ['cliente_info_pessoais', id],
        queryFn: async () => {
            if (!id) {
                navigate(`/clientes`);
                toast.error(`Cliente não encontrado`);
                return Promise.reject("ID do cliente não encontrado");
            }
            return pegarUnicoCliente({ id });
        },
        enabled: !! id 
    });

    const cliente = data?.cliente;

    return (
        <>
            <Helmet title="Detalhes do cliente" />
            <Button onClick={() => navigate(-1)} type="button" variant="default" size="sm" className="mb-2 ml-2">
                <ChevronLeft size={18} className="mr-2" />
                Voltar
            </Button>
            <div className="flex">
                <div className="mr-3">
                    <ClienteDetalhesPessoaisCard 
                        nome={cliente?.nome}
                        email={cliente?.email}
                        telefone={cliente?.telefone}
                        cpf={cliente?.cpf}
                        clienteId={cliente?.id ?? ""}
                        isLoading={isLoading}
                    />
                    <ClienteEnderecosCard 
                        enderecos={cliente?.Enderecos ?? []}
                        isLoading={isLoading}
                    />
                </div>
                <HistoricoComprasCliente 
                    cliente={cliente} 
                />
            </div>
        </>
    );
}

export default DetalhesCliente;
