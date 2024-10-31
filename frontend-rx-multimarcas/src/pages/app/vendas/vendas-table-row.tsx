import { deletarVenda } from "@/api/vendas/deletar-venda";
import { DeleteConfirmationModal } from "@/components/card-confirmar-cancelar";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { queryClient } from "@/lib/react-query";
import { capitalizeName } from "@/services/formated-captalize-name";
import { formatCurrency } from "@/services/formated-currency-brl";
import { formatDateTimeToPTBR } from "@/services/formated-data-pt-br";
import { Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export interface VendasTableRowProps {
    vendas: {
        id: string;
        clienteId: string;
        funcionarioId: string;
        valorTotal: number;
        subtotal: number;
        desconto: number;
        dateCreated: string; // Altere para string
        dateUpdated: string; // Altere para string
        tipoPagamento: "CREDITO" | "DEBITO" | "DINHEIRO";
        itemCarrinho: {
            id: string;
            carrinhoId: string;
            produtoId: string;
            unidadesProduto: number;
            totalItemCarrinho: number;
            dateCreated: string; // Altere para string
            dateUpdated: string; // Altere para string
        }[];
        Clientes: {
            id: string;
            nome: string;
            email: string;
            telefone: string;
            cpf: string;
            dateCreated: string; // Altere para string
            dateUpdated: string; // Altere para string
        };
        Funcionario: {
            id: string;
            nome: string;
            email: string;
            telefone: string;
            cpf: string;
            status: string;
            cargo: string;
        };
    };
}

const VendasTableRow = ({ vendas }: VendasTableRowProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
    };

    const handleConfirmDelete = async () => {
        try {
            await deletarVenda({ id_carrinho: vendas.id });
            setIsDeleteModalOpen(false);
            toast.success("Venda deletado com sucesso!");
            queryClient.invalidateQueries({ predicate: (query) => query.queryKey.includes("vendas") });
        } catch (error) {
            toast.error("Erro ao deletar venda");
        }
    };

    return (
        <>
            <TableRow>
                <TableCell className="font-medium">{capitalizeName(vendas.Clientes.nome)}</TableCell>
                <TableCell className="hidden lg:table-cell">{vendas.Funcionario.nome}</TableCell>
                <TableCell className="hidden md:table-cell">
                    {formatDateTimeToPTBR(vendas.dateCreated)}
                </TableCell>
                <TableCell className="hidden sm:table-cell">{formatCurrency(vendas.valorTotal)}</TableCell>
                <TableCell>
                    <Button variant="outline" size="sm">
                        <Search className="h-4 w-4" />
                        <span className="sr-only">Detalhes do cliente</span>
                    </Button>
                    <Button variant="secondary" size="sm" className="ml-1" onClick={handleDeleteClick}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Deletar usuário</span>
                    </Button>
                </TableCell>
            </TableRow>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen} 
                onConfirm={handleConfirmDelete} 
                onCancel={handleCancelDelete} 
            />
        </>
    );
};

export default VendasTableRow;
