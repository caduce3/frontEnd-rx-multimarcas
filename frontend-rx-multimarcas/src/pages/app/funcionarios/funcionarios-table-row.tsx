import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { capitalizeName } from "@/services/formated-captalize-name";
import { Trash2, UserPen } from "lucide-react";
import { FuncionarioDetailsDialog } from "@/components/funcionario-details-dialog";
import { deletarFuncionario } from "@/api/delete-unique-funcionario";
import { DeleteConfirmationModal } from "@/components/card-confirmar-cancelar";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge"
import { queryClient } from "@/lib/react-query";


export interface FuncionariosTableRowProps {
    funcionarios: {
        id: string;
        nome: string;
        email: string;
        telefone: string;
        cpf: string;
        status: "ATIVO" | "INATIVO";
        cargo: "PROPRIETARIO" | "ADMINISTRADOR" | "COLABORADOR";
    }
}

const FuncionariosTableRow = ({ funcionarios }: FuncionariosTableRowProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDetailsClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleDeleteClick = () => {
        queryClient.invalidateQueries({ predicate: (query) => query.queryKey.includes("funcionarios") });
        setIsDeleteModalOpen(true);
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
    };

    const handleConfirmDelete = async () => {
        try {
            await deletarFuncionario({ id: funcionarios.id });
            setIsDeleteModalOpen(false);
            toast.success("Colaborador deletado com sucesso!");
        } catch (error) {
            toast.error("Erro ao deletar colaborador");
            console.error('Erro ao deletar funcionário:', error);
        }
    };

    return (
        <>
            <TableRow>
                <TableCell className="font-medium">{capitalizeName(funcionarios.nome)}</TableCell>
                <TableCell className="hidden lg:table-cell">{funcionarios.email}</TableCell>
                <TableCell className="hidden md:table-cell">
                    <Badge variant={funcionarios.status === "ATIVO" ? "default" : "destructive"}>
                        {capitalizeName(funcionarios.status)}
                    </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{capitalizeName(funcionarios.cargo)}</TableCell>
                <TableCell>
                    <Button variant="outline" size="sm" onClick={handleDetailsClick}>
                        <UserPen className="h-4 w-4" />
                        <span className="sr-only">Detalhes do usuário</span>
                    </Button>
                    <Button variant="secondary" size="sm" className="ml-1" onClick={handleDeleteClick}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Deletar usuário</span>
                    </Button>
                </TableCell>
            </TableRow>

            {isModalOpen && (
                <FuncionarioDetailsDialog
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    funcionarioId={funcionarios.id} 
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

export default FuncionariosTableRow;
