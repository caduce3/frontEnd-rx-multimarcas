import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { capitalizeName } from "@/services/formated-captalize-name";
import { UserPen } from "lucide-react";
import { FuncionarioDetailsDialog } from "@/components/funcionario-details-dialog";

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

    const handleDetailsClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <TableRow>
                <TableCell className="font-medium">{capitalizeName(funcionarios.nome)}</TableCell>
                <TableCell className="hidden lg:table-cell">{funcionarios.email}</TableCell>
                <TableCell className="hidden md:table-cell">{capitalizeName(funcionarios.status)}</TableCell>
                <TableCell className="hidden sm:table-cell">{capitalizeName(funcionarios.cargo)}</TableCell>
                <TableCell>
                    <Button variant="outline" size="sm" onClick={handleDetailsClick}>
                        <UserPen className="h-4 w-4" />
                        <span className="sr-only">Detalhes do usuário</span>
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
        </>
    );
};

export default FuncionariosTableRow;
