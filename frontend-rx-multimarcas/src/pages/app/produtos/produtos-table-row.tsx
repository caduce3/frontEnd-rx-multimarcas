import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { capitalizeName } from "@/services/formated-captalize-name";
import { formatCurrency } from "@/services/formated-currency-brl";
import { PackageSearch } from "lucide-react";


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

    return (
        <>
            <TableRow>
                <TableCell className="font-medium">{capitalizeName(produtos.nome)}</TableCell>
                <TableCell className="hidden lg:table-cell">{produtos.descricao ?? "Não informado"}</TableCell>
                <TableCell className="hidden md:table-cell">{formatCurrency(produtos.preco)}</TableCell>
                <TableCell className="hidden sm:table-cell">{produtos.quantidadeDisponivel}</TableCell>
                <TableCell>
                    <Button variant="outline" size="sm">
                        <PackageSearch className="h-4 w-4" />
                    </Button>
                </TableCell>
            </TableRow>
        </>
    );
};

export default ProdutosTableRow;
