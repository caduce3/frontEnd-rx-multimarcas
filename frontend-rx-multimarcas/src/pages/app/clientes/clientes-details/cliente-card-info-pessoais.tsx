import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPen } from "lucide-react";
import { useState } from "react";
import { ClienteInformacoesPessoaisDialog } from "./cliente-dialog-info-pessoais";
import { Skeleton } from "@/components/ui/skeleton";

interface ClienteDetalhesPessoaisProps {
    nome?: string;
    email?: string;
    telefone?: string;
    cpf?: string;
    clienteId: string;
    isLoading: boolean;
}

const ClienteDetalhesPessoaisCard: React.FC<ClienteDetalhesPessoaisProps> = ({ nome, email, telefone, cpf, clienteId, isLoading }) => {

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
                        <Button variant="default" size="sm" onClick={handleDetailsClick}>
                            <UserPen className="h-4 w-4 mr-2" />
                            <p className="text-sm">Editar</p>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="rounded-lg">
                    {isLoading ? <Skeleton className="h-3 w-40 mb-1" /> : <p className="text-sm"><span className="font-medium">Nome:</span> {nome}</p>}
                    {isLoading ? <Skeleton className="h-3 w-40 mb-1" /> : <p className="text-sm"><span className="font-medium">Email:</span> {email}</p>}
                    { isLoading ? <Skeleton className="h-3 w-40 mb-1" /> : <p className="text-sm"><span className="font-medium">Telefone:</span> {telefone}</p> }
                    {isLoading  ? <Skeleton className="h-3 w-40 mb-1" /> : <p className="text-sm"><span className="font-medium">CPF:</span> : {cpf}</p>}
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
