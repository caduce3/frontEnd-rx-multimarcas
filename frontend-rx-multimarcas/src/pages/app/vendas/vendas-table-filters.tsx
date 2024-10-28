import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Search, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const vendasFilterSchema = z.object({
    nome_cliente: z.string().optional(),
    nome_funcionario: z.string().optional()
});

type VendasFilterSchema = z.infer<typeof vendasFilterSchema>;

const VendasTableFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);

    const nome_cliente = searchParams.get("nome_cliente");
    const nome_funcionario = searchParams.get("nome_funcionario");

    const { register, handleSubmit, reset } = useForm<VendasFilterSchema>({
        resolver: zodResolver(vendasFilterSchema),
        defaultValues: {
            nome_cliente: nome_cliente ?? "",
            nome_funcionario: nome_funcionario ?? ""
        }
    });

    function handleFilter(data: VendasFilterSchema) {
        setSearchParams((state) => {
            Object.entries(data).forEach(([key, value]) => {
                if (value) {
                    state.set(key, value);
                } else {
                    state.delete(key);
                }
            });

            state.set("page", "1");
            return state;
        });
        setIsOpen(false); 
    }

    function handleClearFilters() {
        reset({
            nome_cliente: "",
            nome_funcionario: ""
        });
        setSearchParams({});
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center justify-between w-48" onClick={() => setIsOpen(true)}>
                    <span className="text-sm font-semibold">Filtros</span>
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Filtros</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(handleFilter)}
                    className="flex flex-col gap-4 p-4"
                >
                    <div className="flex flex-wrap gap-4">
                        <div className="flex gap-4 w-full">
                            <Input
                                placeholder="Nome do cliente"
                                className="h-9 w-full"
                                {...register("nome_cliente")}
                            />
                        </div>

                        <div className="flex gap-4 w-full">
                            <Input
                                placeholder="Nome do funcionário"
                                className="h-9 w-full"
                                {...register("nome_funcionario")}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button type="submit" variant="secondary" size="sm" className="flex-1">
                            <Search className="mr-2 h-4 w-4" />
                            Filtrar resultados
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={handleClearFilters}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Remover filtros
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default VendasTableFilters;
