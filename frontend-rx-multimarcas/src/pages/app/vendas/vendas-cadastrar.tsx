import { cadastrarVenda } from "@/api/vendas/cadastrar-venda";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"; // Importando Select
import { queryClient } from "@/lib/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { PackagePlus, ShoppingBag, X, XIcon } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getClientes } from "@/api/clientes/get-clientes";
import { debounce } from "lodash";
import { getFuncionarios } from "@/api/get-funcionarios";
import { mascaraNumero } from "@/services/onChangeNumero";
import { pegarProdutos } from "@/api/produtos/pegar-produtos";

// Definir schema para cadastrar uma venda
const cadastrarVendaSchema = z.object({
    clienteId: z.string(),
    funcionarioId: z.string(),
    tipoPagamento: z.union([z.literal("CREDITO"), z.literal("DEBITO"), z.literal("DINHEIRO")]),
    desconto: z.number().min(0, { message: "O desconto deve ser maior ou igual a 0." }),
    itens: z.array(z.object({
        produtoId: z.string(),
        unidadesProduto: z.number().min(1, { message: "Deve ser maior ou igual a 1." }),
    }))
});

type CadastrarVendaFormValues = z.infer<typeof cadastrarVendaSchema>;

const CadastrarVendas = () => {
    const form = useForm<CadastrarVendaFormValues>({
        resolver: zodResolver(cadastrarVendaSchema),
        defaultValues: {
            clienteId: "",
            funcionarioId: "",
            tipoPagamento: "CREDITO",
            desconto: 0,
            itens: []
        }
    });

    const { control, handleSubmit, reset, setValue } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "itens",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const { mutateAsync: cadastrarVendaFn } = useMutation({
        mutationFn: cadastrarVenda
    });

    async function onSubmit(values: CadastrarVendaFormValues) {
        setIsSubmitting(true);

        try {
            await cadastrarVendaFn(values);
            toast.success("Venda cadastrada com sucesso!");
            queryClient.invalidateQueries({ predicate: (query) => query.queryKey.includes("vendas") });
            reset();
            setSelectedClienteNome("");
            setShowClienteSuggestions(false);
            setSelectedFuncionarioNome("");
            setShowFuncionarioSuggestions(false);
            setIsOpen(false);
            setSelectedProdutoNomes([]);
            setShowProdutoSuggestions(false);
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : "Erro inesperado ao cadastrar venda.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }

    const [isOpen, setIsOpen] = useState(false);
    
    // Estados para sugestões de clientes
    const [clientes, setClientes] = useState<Array<{ id: string; nome: string }>>([]);
    const [showClienteSuggestions, setShowClienteSuggestions] = useState(false);
    const [selectedClienteNome, setSelectedClienteNome] = useState("");

    // Estados para sugestões de funcionarios
    const [funcionarios, setFuncionarios] = useState<Array<{ id: string; nome: string }>>([]);
    const [showFuncionarioSuggestions, setShowFuncionarioSuggestions] = useState(false);
    const [selectedFuncionarioNome, setSelectedFuncionarioNome] = useState("");

    // Estados para sugestões de produtos
    const [produtos, setProdutos] = useState<Array<{ id: string; nome: string }>>([]);
    const [showProdutoSuggestions, setShowProdutoSuggestions] = useState(false);
    const [selectedProdutoNomes, setSelectedProdutoNomes] = useState<string[]>([]);

    
    const fetchClientes = async (nome: string) => {
        try {
            const response = await getClientes({ page: 1, nome });
            setClientes(response.clientesList);
            setShowClienteSuggestions(true);
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
        }
    };

    const fetchFuncionarios = async (nome: string) => {
        try {
            const response = await getFuncionarios({ page: 1, nome });
            setFuncionarios(response.funcionariosList);
            setShowFuncionarioSuggestions(true);
        } catch (error) {
            console.error("Erro ao buscar funcionários:", error);
        }
    }

    const fetchProdutos = async (nome: string) => {
        try {
            const response = await pegarProdutos({ page: 1, nome });
            setProdutos(response.produtosList);
            setShowProdutoSuggestions(true);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        }
    };

    const debouncedFetchClientes = debounce(fetchClientes, 150);
    const debouncedFetchFuncionarios = debounce(fetchFuncionarios, 150);
    const debouncedFetchProdutos = debounce(fetchProdutos, 150);

    const handleSelectCliente = (cliente: { id: string; nome: string }) => {
        setValue("clienteId", cliente.id);
        setSelectedClienteNome(cliente.nome);
        setShowClienteSuggestions(false);
    };    

    const handleSelectFuncionario = (funcionario: { id: string; nome: string }) => {
        setValue("funcionarioId", funcionario.id);
        setSelectedFuncionarioNome(funcionario.nome);
        setShowFuncionarioSuggestions(false);
    };

    const handleSelectProduto = (produto: { id: string; nome: string }, index: number) => {
        setValue(`itens.${index}.produtoId`, produto.id);
        const updatedSelectedProdutoNomes = [...selectedProdutoNomes];
        updatedSelectedProdutoNomes[index] = produto.nome; // Atualiza apenas o nome do produto do índice correspondente
        setSelectedProdutoNomes(updatedSelectedProdutoNomes);
        setShowProdutoSuggestions(false);
    };

    function handleClearCadastroVenda() {
        reset();
        setSelectedClienteNome("");
        setShowClienteSuggestions(false);
        setSelectedFuncionarioNome("");
        setShowFuncionarioSuggestions(false);
        setIsOpen(false);
        setSelectedProdutoNomes([]); // Limpa todos os nomes dos produtos
        setShowProdutoSuggestions(false);
    }
    

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm" className="flex items-center justify-between w-48">
                    <span className="text-sm font-semibold">Cadastrar venda</span>
                    <ShoppingBag className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cadastrar venda</DialogTitle>
                </DialogHeader>

                <FormProvider {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
                        <div className=" gap-4">
                            <FormField
                                control={control}
                                name="clienteId"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1 w-full mb-3">
                                        <FormLabel>Cliente</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-9 w-full"
                                                placeholder="Nome do Cliente"
                                                {...field}
                                                value={selectedClienteNome} // Bind the input value to field.value
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setSelectedClienteNome(value); // Update the state
                                                    field.onChange(value); // Update the form value
                                                    if (value) {
                                                        debouncedFetchClientes(value);
                                                    } else {
                                                        setShowClienteSuggestions(false);
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        {showClienteSuggestions && (
                                            <ul className=" w-full bg-white border border-gray-300 shadow-md mt-1 max-h-48 overflow-y-auto z-10 rounded-sm">
                                                {clientes.slice(0, 5).map((cliente) => (
                                                    <li
                                                        key={cliente.id}
                                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 rounded-sm"
                                                        onMouseDown={() => handleSelectCliente(cliente)}
                                                    >
                                                        {cliente.nome}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="funcionarioId"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1 w-full mb-3">
                                        <FormLabel>Funcionário</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-9 w-full"
                                                placeholder="Nome do Funcionário"
                                                {...field}
                                                value={selectedFuncionarioNome} // Bind the input value to field.value
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setSelectedFuncionarioNome(value); // Update the state
                                                    field.onChange(value); // Update the form value
                                                    if (value) {
                                                        debouncedFetchFuncionarios(value);
                                                    } else {
                                                        setShowFuncionarioSuggestions(false);
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        {showFuncionarioSuggestions && (
                                            <ul className=" w-full bg-white border border-gray-300 shadow-md mt-1 max-h-48 overflow-y-auto z-10 rounded-sm">
                                                {funcionarios.slice(0, 5).map((funcionario) => (
                                                    <li
                                                        key={funcionario.id}
                                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 rounded-sm"
                                                        onMouseDown={() => handleSelectFuncionario(funcionario)}
                                                    >
                                                        {funcionario.nome}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="max-h-52 overflow-y-auto">
                            {fields.map((item, index) => (
                                <div key={item.id} className="flex gap-4 border p-3 rounded-sm mb-1">
                                    <FormField
                                        control={control}
                                        name={`itens.${index}.produtoId`}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col gap-1 w-full md:w-1/2">
                                                <FormLabel>ID do Produto</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className="h-9 w-full"
                                                        placeholder="Nome do Produto"
                                                        {...field}
                                                        value={selectedProdutoNomes[index] || ""} // Use o nome do produto específico para o índice
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            const updatedSelectedProdutoNomes = [...selectedProdutoNomes];
                                                            updatedSelectedProdutoNomes[index] = value; // Atualiza o nome do produto no índice correspondente
                                                            setSelectedProdutoNomes(updatedSelectedProdutoNomes);
                                                            field.onChange(value);
                                                            if (value) {
                                                                debouncedFetchProdutos(value);
                                                            } else {
                                                                setShowProdutoSuggestions(false);
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                                {showProdutoSuggestions && (
                                                    <ul className="w-full bg-white border border-gray-300 shadow-md mt-1 max-h-48 overflow-y-auto z-10 rounded-sm">
                                                        {produtos.slice(0, 5).map((produto) => (
                                                            <li
                                                                key={produto.id}
                                                                className="px-4 py-2 cursor-pointer hover:bg-gray-100 rounded-sm"
                                                                onMouseDown={() => handleSelectProduto(produto, index)}
                                                            >
                                                                {produto.nome}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={control}
                                        name={`itens.${index}.unidadesProduto`}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col gap-1 w-full md:w-1/3">
                                                <FormLabel>Quantidade</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        type="text" 
                                                        className="h-9 w-full" 
                                                        placeholder="Quantidade" 
                                                        {...field} 
                                                        onChange={(e) => {
                                                            const maskedValue = mascaraNumero(e.target.value);
                                                            const numericValue = parseFloat(maskedValue.replace(',', '.'));
                                                            field.onChange(isNaN(numericValue) ? undefined : numericValue);
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="button" size="sm" variant="destructive" onClick={() => remove(index)} className="self-end">
                                        <XIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <Button type="button" size="sm" variant="outline" onClick={() => append({ produtoId: "", unidadesProduto: 0 })} className="self-end mb-5">
                            <PackagePlus className="h-4 w-4 mr-2" />
                            Adicionar Produto
                        </Button>

                        <div className="flex gap-4">
                            <FormField
                                control={control}
                                name="tipoPagamento"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1 w-full md:w-1/2">
                                        <FormLabel>Tipo de Pagamento</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger id="tipoPagamento">
                                                    <SelectValue placeholder="Selecione o tipo de pagamento" />
                                                </SelectTrigger>
                                                <SelectContent position="popper">
                                                    <SelectItem value="CREDITO">Crédito</SelectItem>
                                                    <SelectItem value="DEBITO">Débito</SelectItem>
                                                    <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="desconto"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1 w-full md:w-1/2">
                                        <FormLabel>Desconto %</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="text" 
                                                className="h-9 w-full" 
                                                placeholder="Desconto" 
                                                {...field} 
                                                onChange={(e) => {
                                                    const maskedValue = mascaraNumero(e.target.value);
                                                    const numericValue = parseFloat(maskedValue.replace(',', '.'));
                                                    field.onChange(isNaN(numericValue) ? undefined : numericValue);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-center justify-center">
                            <Button
                                type="submit"
                                variant="default"
                                size="sm"
                                className="flex w-1/2"
                                disabled={isSubmitting}
                            >   
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                {isSubmitting ? "Cadastrando..." : "Cadastrar Venda"}
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="ml-2 flex w-1/2"
                                onClick={handleClearCadastroVenda}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
};

export default CadastrarVendas;
