import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Search } from "lucide-react";

export function TableSkeleton() {
    return (
        <Table className="border rounded-md">
            <TableCaption>Lista de Jogadores.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead className="hidden lg:table-cell">Telefone</TableHead>
                    <TableHead className="hidden md:table-cell">E-mail</TableHead>
                    <TableHead className="hidden sm:table-cell">CPF</TableHead>
                    <TableHead>Detalhes</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 10 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell>
                            <Skeleton className="h-3 w-3" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-40" />
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                            <Skeleton className="h-4 w-40" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            <Skeleton className="h-4 w-40" />
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                            <Skeleton className="h-4 w-40" />
                        </TableCell>
                        <TableCell>
                            <Button disabled variant="outline" size="sm">
                                <Search className="h-3 w-3" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}