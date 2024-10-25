import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { capitalizeName } from "@/services/formated-captalize-name";
import { formatCurrency } from "@/services/formated-currency-brl";
import { PackageSearch, Trash2 } from "lucide-react";
import { ProdutoDetailsDialog } from "./produtos-details-dialog";
import { useState } from "react";
import { queryClient } from "@/lib/react-query";
import { toast } from "sonner";
import { deletarProduto } from "@/api/produtos/deletar-produto";
import { DeleteConfirmationModal } from "@/components/card-confirmar-cancelar";


export interface ProdutosTableRowProps {
    produtos: {
        id: string;
        nome: string;
        descricao: string;
        preco: number;
        quantidadeDisponivel: number;
    }
}

const ProdutosTableRow = ({ produtos }: ProdutosTableRowProps) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDetailsClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
    };

    const handleConfirmDelete = async () => {
        try {
            await deletarProduto({ id_produto: produtos.id });
            setIsDeleteModalOpen(false);
            toast.success("Produto deletado com sucesso!");
            queryClient.invalidateQueries({ predicate: (query) => query.queryKey.includes("produtos") });
        } catch (error) {
            toast.error("Erro ao deletar produto");
        }
    };

    return (
        <>
            <TableRow>
                <TableCell className="font-medium">{capitalizeName(produtos.nome)}</TableCell>
                <TableCell className="hidden lg:table-cell">{produtos.descricao ?? "Não informado"}</TableCell>
                <TableCell className="hidden md:table-cell">{formatCurrency(produtos.preco)}</TableCell>
                <TableCell className="hidden sm:table-cell">{produtos.quantidadeDisponivel}</TableCell>
                <TableCell>
                    <Button variant="outline" size="sm" onClick={handleDetailsClick}>
                        <PackageSearch className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="sm" className="ml-1" onClick={handleDeleteClick}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Deletar usuário</span>
                    </Button>
                </TableCell>
            </TableRow>

            {isModalOpen && (
                <ProdutoDetailsDialog
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    produtoId={produtos.id} 
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

export default ProdutosTableRow;
