import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPen } from "lucide-react";
import { useState } from "react";
import { ClienteInformacoesPessoaisDialog } from "./cliente-dialog-info-pessoais";
import AdicionarEnderecoClientes from "./endereco/client-dialog-adicionar-endereco";

interface ClienteDetalhesPessoaisProps {
    nome?: string;
    email?: string;
    telefone?: string;
    cpf?: string;
    clienteId: string;
}

const ClienteDetalhesPessoaisCard: React.FC<ClienteDetalhesPessoaisProps> = ({ nome, email, telefone, cpf, clienteId }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDetailsClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Card className="w-[40vw] mb-3">
                <CardHeader>
                    <div className="flex justify-between">
                        <div>
                            <CardTitle>Detalhes do cliente</CardTitle>
                            <CardDescription>Informações pessoais</CardDescription>
                        </div>
                        {/* Evento onClick para abrir o modal */}
                        <Button variant="outline" size="sm" onClick={handleDetailsClick}>
                            <UserPen className="h-4 w-4 mr-2" />
                            <p className="text-sm">Editar</p>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="rounded-lg">
                    <p className="font-bold text-lg">{nome}</p>
                    <p className="text-sm font-normal mt-1"><span className="font-medium">E-mail: </span>{email}</p>
                    <p className="text-sm"><span className="font-medium">Telefone:</span> {telefone}</p>
                    <p className="text-sm"><span className="font-medium">CPF:</span> {cpf}</p>
                </CardContent>
            </Card>

            {isModalOpen && (
                <ClienteInformacoesPessoaisDialog
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    clienteId={clienteId}  
                />
            )}
        </>
    );
};

export default ClienteDetalhesPessoaisCard;
