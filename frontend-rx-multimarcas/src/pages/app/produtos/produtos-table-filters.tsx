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

const produtosFilterSchema = z.object({
    nome: z.string().optional(),
    descricao: z.string().optional()
});

type ProdutosFilterSchema = z.infer<typeof produtosFilterSchema>;

const ProdutosTableFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);

    const nome = searchParams.get("nome");
    const descricao = searchParams.get("descricao");

    const { register, handleSubmit, reset } = useForm<ProdutosFilterSchema>({
        resolver: zodResolver(produtosFilterSchema),
        defaultValues: {
            nome: nome ?? "",
            descricao: descricao ?? ""
        }
    });

    function handleFilter(data:ProdutosFilterSchema) {
        setSearchParams((state) => {
            Object.entries(data).forEach(([key, value]) => {
                if (value) {
                    state.set(key, String(value));
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
            nome: "",
            descricao: ""
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
                                placeholder="Nome do produto"
                                className="h-9 w-full"
                                {...register("nome")}
                            />
                        </div>

                        <div className="flex gap-4 w-full">
                            <Input
                                placeholder="Descrição do produto"
                                className="h-9 w-full"
                                {...register("descricao")}
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

export default ProdutosTableFilters;
