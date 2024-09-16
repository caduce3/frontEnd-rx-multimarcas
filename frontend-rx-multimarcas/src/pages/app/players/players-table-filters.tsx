import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Filter, Search, X } from "lucide-react";
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

const playersFilterSchema = z.object({
    id_platform: z.string().optional(),
    name: z.string().optional(),
    tell: z.string().optional(),
    cpf: z.string().optional(),
    email: z.string().optional(),
});

type PlayersFilterSchema = z.infer<typeof playersFilterSchema>;

const PlayersTableFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);

    const id_platform = searchParams.get("id_platform");
    const name = searchParams.get("name");
    const tell = searchParams.get("tell");
    const email = searchParams.get("email");
    const cpf = searchParams.get("cpf");

    const { register, handleSubmit, reset } = useForm<PlayersFilterSchema>({
        resolver: zodResolver(playersFilterSchema),
        defaultValues: {
            id_platform: id_platform ?? "",
            name: name ?? "",
            tell: tell ?? "",
            email: email ?? "",
            cpf: cpf ?? "",
        },
    });

    function handleFilter(data: PlayersFilterSchema) {
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
            id_platform: "",
            name: "",
            tell: "",
            email: "",
            cpf: "",
        });
        setSearchParams({});
        setIsOpen(false);

    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center bg-[#18181B] rounded-lg" onClick={() => setIsOpen(true)}>
                    <span className="text-sm font-semibold mr-2">Filtros</span>
                    <Filter className="h-4 w-4" />
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
                                placeholder="ID da plataforma"
                                className="h-9 w-full"
                                {...register("id_platform")}
                            />
                            <Input
                                placeholder="Nome do jogador"
                                className="h-9 w-full"
                                {...register("name")}
                            />
                        </div>

                        <div className="flex gap-4 w-full">
                            <Input
                                placeholder="Telefone do jogador"
                                className="h-9 w-full"
                                {...register("tell")}
                            />
                            <Input
                                placeholder="E-mail do jogador"
                                className="h-9 w-full"
                                {...register("email")}
                            />
                        </div>

                        <div className="flex gap-4 w-full lg:w-1/2">
                            <Input
                                placeholder="CPF do jogador"
                                className="h-9 w-full"
                                {...register("cpf")}
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

export default PlayersTableFilters;
