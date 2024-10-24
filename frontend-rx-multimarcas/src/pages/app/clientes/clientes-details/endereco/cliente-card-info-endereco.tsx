import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClienteInformacoesEnderecoDialog } from "./cliente-dialog-info-endereco";
import { useState } from "react";
import { Trash2, UserPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationModal } from "@/components/card-confirmar-cancelar";
import { queryClient } from "@/lib/react-query";
import { deletarEnderecoCliente } from "@/api/enderecos/deletar-unico-endereco";
import { toast } from "sonner";

interface Endereco {
    id: string;
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
}

interface ClienteEnderecosCardProps {
    enderecos: Endereco[];
}

const ClienteEnderecosCard: React.FC<ClienteEnderecosCardProps> = ({ enderecos }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEnderecoId, setSelectedEnderecoId] = useState<string | null>(null); // Estado para guardar o ID do endereço selecionado
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDetailsClick = (enderecoId: string) => {
        setSelectedEnderecoId(enderecoId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEnderecoId(null); // Limpa o estado ao fechar o modal
    };

    const handleDeleteClick = (enderecoId: string) => {
        setSelectedEnderecoId(enderecoId);
        setIsDeleteModalOpen(true);
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
    };

    const handleConfirmDelete = async () => {
        try {
            if (selectedEnderecoId) {
                await deletarEnderecoCliente({ id_endereco: selectedEnderecoId });
                setIsDeleteModalOpen(false);
                queryClient.invalidateQueries({ predicate: (query) => query.queryKey.includes("cliente_info_pessoais") });
                toast.success("Endereço deletado com sucesso!");
            }
        } catch (error) {
            toast.error("Erro ao deletar Endereço");
        }
    };
    

    return (
        <>
            <Card className="w-[40vw]">
                <CardHeader>
                    <CardTitle>Endereço(s)</CardTitle>
                    <CardDescription>Lista de endereços do cliente</CardDescription>
                </CardHeader>
                <CardContent className="mt-1 rounded-lg">
                    {enderecos && enderecos.length > 0 ? (
                        enderecos.map((endereco) => (
                            <div key={endereco.id} className="mb-3">
                                <div className="mb-3 border p-2 rounded-md flex justify-between">
                                    <div>
                                        <p className="font-bold">{endereco.rua}, {endereco.numero}</p>
                                        <p className="text-sm">Bairro {endereco.bairro}, {endereco.cidade} {endereco.estado} / {endereco.cep}</p>
                                    </div>
                                    <div>
                                        <Button variant="outline" size="sm" onClick={() => handleDetailsClick(endereco.id)}>
                                            <UserPen className="h-4 w-4" />
                                        </Button>
                                        <Button variant="secondary" size="sm" className="ml-1" onClick={() => handleDeleteClick(endereco.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-700">Nenhum endereço informado</p>
                    )}
                </CardContent>
            </Card>

            {isModalOpen && selectedEnderecoId && (
                <ClienteInformacoesEnderecoDialog
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    enderecoId={selectedEnderecoId}
                />
            )}

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen} 
                onConfirm={handleConfirmDelete} 
                onCancel={handleCancelDelete} 
            />
        </>
    );
};

export default ClienteEnderecosCard;
