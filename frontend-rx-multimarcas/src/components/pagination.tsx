import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "./ui/button";

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItens: number;
    onPageChange: (currentPage: number) => Promise<void> | void;
}

export function Pagination({ currentPage, totalPages, totalItens, onPageChange }: PaginationProps) {

    //const pages = Math.ceil(perPage / totalCount) || 1;

    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
                Total de {totalItens} item(s)
            </span>

            <div className="flex items-center gap-6 lg:gap-8">
                <div className="text-sm font-medium">
                    Página {currentPage} de {totalPages}
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-8 w-8 p-0" onClick={() => onPageChange(1)} disabled={currentPage === 1}>
                        <ChevronsLeft className="h-4 w-4"/>
                        <span className="sr-only">Primeira página</span>
                    </Button>
                    <Button variant="outline" className="h-8 w-8 p-0" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                        <ChevronLeft className="h-4 w-4"/>
                        <span className="sr-only">Página anterior</span>
                    </Button>
                    <Button variant="outline" className="h-8 w-8 p-0" onClick={() => onPageChange(currentPage + 1)} disabled={totalPages <= currentPage + 1}>
                        <ChevronRight className="h-4 w-4"/>
                        <span className="sr-only">Próxima página</span>
                    </Button>
                    <Button variant="outline" className="h-8 w-8 p-0" onClick={() => onPageChange(totalPages)} disabled={totalPages <= currentPage + 1}>
                        <ChevronsRight className="h-4 w-4"/>
                        <span className="sr-only">Última página</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}