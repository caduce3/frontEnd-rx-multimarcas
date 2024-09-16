import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatPhoneNumber } from "@/services/formated-tell"
import { capitalizeName } from "@/services/formated-captalize-name"
import { formatCPF } from "@/services/formated-cpf"


export interface PlayersTableRowProps {
    players: {
        id: string;
        id_platform: number;
        name: string;
        cpf: string | null;
        tell: string;
        email: string;
        date_created: Date;
        date_birth: Date | null;
        platform_regitration_date: Date | null;
    }
}

const PlayersTableRow = ({ players }: PlayersTableRowProps) => {

    const navigate = useNavigate();

    const handleDetailsClick = () => {
        navigate(`/players/${players.id}`);
    }

    return ( 
        <TableRow className="bg-[#18181B] rounded-xl">
            <TableCell className="font-medium text-xs font-mono">{players.id_platform}</TableCell>
            <TableCell className="font-medium">{capitalizeName(players.name)}</TableCell>
            <TableCell className="hidden lg:table-cell">{formatPhoneNumber(players.tell ?? "Não informado")}</TableCell>
            <TableCell className="hidden md:table-cell">{players.email}</TableCell>
            <TableCell className="hidden sm:table-cell">{formatCPF(players.cpf ?? "Não informado")}</TableCell>
            <TableCell>
                <Button variant="outline" size="sm" onClick={handleDetailsClick}>
                    <Search className="h-4 w-4"/>
                    <span className="sr-only">Detalhes do jogador</span>
                </Button>
            </TableCell>
        </TableRow>
    );
}
 
export default PlayersTableRow;
