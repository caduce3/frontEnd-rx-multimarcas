import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { capitalizeName } from "@/services/formated-captalize-name";
import { formatCurrency } from "@/services/formated-currency-brl";
import { formatDateTimeToPTBR } from "@/services/formated-data-pt-br";
import { Search } from "lucide-react";

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

    return (
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
            </TableCell>
        </TableRow>
    );
};

export default VendasTableRow;
