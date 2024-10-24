import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { capitalizeName } from "@/services/formated-captalize-name";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";


export interface ClientesTableRowProps {
    clientes: {
        id: string;
        nome: string;
        email: string;
        telefone: string;
        cpf: string;
    }
}

const ClientesTableRow = ({ clientes }: ClientesTableRowProps) => {

    const navigate = useNavigate();

    const handleDetailsClick = () => {
        navigate(`/clientes/${clientes.id}`);
    }

    return (
        <>
            <TableRow>
                <TableCell className="font-medium">{capitalizeName(clientes.nome)}</TableCell>
                <TableCell className="hidden lg:table-cell">{clientes.email}</TableCell>
                <TableCell className="hidden md:table-cell">{clientes.telefone}</TableCell>
                <TableCell className="hidden sm:table-cell">{clientes.cpf}</TableCell>
                <TableCell>
                    <Button variant="outline" size="sm" onClick={handleDetailsClick}>
                        <Search className="h-4 w-4" />
                        <span className="sr-only">Detalhes do cliente</span>
                    </Button>
                </TableCell>
            </TableRow>
        </>
    );
};

export default ClientesTableRow;
