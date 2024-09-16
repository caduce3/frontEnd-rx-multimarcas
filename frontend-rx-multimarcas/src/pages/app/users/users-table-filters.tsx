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

const usersFilterSchema = z.object({
    name: z.string().optional(),
    email: z.string().optional()
});

type UsersFilterSchema = z.infer<typeof usersFilterSchema>;

const UsersTableFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);

    const name = searchParams.get("name");
    const email = searchParams.get("email");

    const { register, handleSubmit, reset } = useForm<UsersFilterSchema>({
        resolver: zodResolver(usersFilterSchema),
        defaultValues: {
            name: name ?? "",
            email: email ?? ""
        }
    });

    function handleFilter(data: UsersFilterSchema) {
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
            name: "",
            email: ""
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
                                placeholder="Nome do jogador"
                                className="h-9 w-full"
                                {...register("name")}
                            />
                        </div>

                        <div className="flex gap-4 w-full">
                            <Input
                                placeholder="E-mail do jogador"
                                className="h-9 w-full"
                                {...register("email")}
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

export default UsersTableFilters;
