import { useEffect, useState } from "react";
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
import { getFuncionarios, GetFuncionariosResponse } from "@/api/get-funcionarios";
import { debounce } from "lodash";
import { getClientes, GetClientesResponse } from "@/api/clientes/get-clientes";

const vendasFilterSchema = z.object({
    nome_cliente: z.string().optional(),
    nome_funcionario: z.string().optional()
});

type VendasFilterSchema = z.infer<typeof vendasFilterSchema>;

const VendasTableFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);

    // States para armazenar sugestões
    const [funcionarios, setFuncionarios] = useState<GetFuncionariosResponse["funcionariosList"]>([]);
    const [clientes, setClientes] = useState<GetClientesResponse["clientesList"]>([]);
    const [showFuncionarioSuggestions, setShowFuncionarioSuggestions] = useState(false);
    const [showClienteSuggestions, setShowClienteSuggestions] = useState(false);

    const nome_cliente = searchParams.get("nome_cliente");
    const nome_funcionario = searchParams.get("nome_funcionario");

    const { register, handleSubmit, reset, setValue, watch } = useForm<VendasFilterSchema>({
        resolver: zodResolver(vendasFilterSchema),
        defaultValues: {
            nome_cliente: nome_cliente ?? "",
            nome_funcionario: nome_funcionario ?? ""
        }
    });

    // Funções para buscar funcionários e clientes
    const fetchFuncionarios = async (nome: string) => {
        try {
            const response = await getFuncionarios({ page: 1, nome });
            setFuncionarios(response.funcionariosList);
            setShowFuncionarioSuggestions(true);
        } catch (error) {
            console.error("Erro ao buscar funcionários:", error);
        }
    };

    const fetchClientes = async (nome: string) => {
        try {
            const response = await getClientes({ page: 1, nome });
            setClientes(response.clientesList);
            setShowClienteSuggestions(true);
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
        }
    };

    // Debounce para otimizar chamadas à API
    const debouncedFetchFuncionarios = debounce(fetchFuncionarios, 300);
    const debouncedFetchClientes = debounce(fetchClientes, 300);

    // Monitorar mudanças nos campos
    const nomeFuncionarioValue = watch("nome_funcionario");
    const nomeClienteValue = watch("nome_cliente");

    useEffect(() => {
        if (nomeFuncionarioValue) {
            debouncedFetchFuncionarios(nomeFuncionarioValue);
        } else {
            setShowFuncionarioSuggestions(false);
        }
    }, [nomeFuncionarioValue]);

    useEffect(() => {
        if (nomeClienteValue) {
            debouncedFetchClientes(nomeClienteValue);
        } else {
            setShowClienteSuggestions(false);
        }
    }, [nomeClienteValue]);

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

    function handleSelectFuncionario(nome: string) {
        setValue("nome_funcionario", nome);
        setShowFuncionarioSuggestions(false);
    }

    function handleSelectCliente(nome: string) {
        setValue("nome_cliente", nome);
        setShowClienteSuggestions(false);
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
                        {/* Input para Nome do Cliente */}
                        <div className="flex gap-4 w-full relative">
                            <Input
                                placeholder="Nome do cliente"
                                className="h-9 w-full"
                                {...register("nome_cliente")}
                                onFocus={() => nomeClienteValue && setShowClienteSuggestions(true)}
                                onBlur={() => setShowClienteSuggestions(false)}
                            />
                            {showClienteSuggestions && (
                                <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 shadow-md mt-1 max-h-48 overflow-y-auto z-10 rounded-sm">
                                    {clientes.map((cliente) => (
                                        <li
                                            key={cliente.id}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 rounded-sm"
                                            onMouseDown={() => handleSelectCliente(cliente.nome)}
                                        >
                                            {cliente.nome}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Input para Nome do Funcionário */}
                        <div className="flex gap-4 w-full relative">
                            <Input
                                placeholder="Nome do funcionário"
                                className="h-9 w-full"
                                {...register("nome_funcionario")}
                                onFocus={() => nomeFuncionarioValue && setShowFuncionarioSuggestions(true)}
                                onBlur={() => setShowFuncionarioSuggestions(false)}
                            />
                            {showFuncionarioSuggestions && (
                                <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 shadow-md mt-1 max-h-48 overflow-y-auto z-10 rounded-sm">
                                    {funcionarios.map((funcionario) => (
                                        <li
                                            key={funcionario.id}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 rounded-sm"
                                            onMouseDown={() => handleSelectFuncionario(funcionario.nome)}
                                        >
                                            {funcionario.nome}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 mt-4">
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
