import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { capitalizeName } from "@/services/formated-captalize-name";
import { UserPen } from "lucide-react";
import { UserDetailsDialog } from "@/components/user-details-dialog";

export interface UsersTableRowProps {
    users: {
        id: string;
        name: string;
        gender: string;
        email: string;
        status: "ACTIVE" | "INACTIVE";
        date_created: Date;
        sector: "RISCO" | "DESENVOLVIMENTO" | "TRAFEGO" | "FINANCEIRO" | "GERENCIAL" | "USER" | "AFILIADOS";
    }
}

const UsersTableRow = ({ users }: UsersTableRowProps) => {
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
                <TableCell className="font-medium">{capitalizeName(users.name)}</TableCell>
                <TableCell className="hidden lg:table-cell">{users.email}</TableCell>
                <TableCell className="hidden md:table-cell">{capitalizeName(users.status)}</TableCell>
                <TableCell className="hidden sm:table-cell">{capitalizeName(users.sector)}</TableCell>
                <TableCell>
                    <Button variant="outline" size="sm" onClick={handleDetailsClick}>
                        <UserPen className="h-4 w-4" />
                        <span className="sr-only">Detalhes do usuário</span>
                    </Button>
                </TableCell>
            </TableRow>

            {isModalOpen && (
                <UserDetailsDialog
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    userId={users.id} 
                />
            )}
        </>
    );
};

export default UsersTableRow;
