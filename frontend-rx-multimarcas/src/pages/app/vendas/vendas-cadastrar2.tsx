import { cadastrarVenda } from "@/api/vendas/cadastrar-venda";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { queryClient } from "@/lib/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ShoppingBag, X, XIcon } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import ClienteField from "./suggestions/cliente-suggestions";
import FuncionarioField from "./suggestions/funcionario-suggestions";
import AdicionarProdutoDialog from "./dialog-item-produto";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { mascaraNumero } from "@/services/onChangeNumero";

type Produto = {
    produtoId: string;
    unidadesProduto: number;
    nomeProduto: string;
    precoProduto: number;
};

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

export type CadastrarVendaFormValues = z.infer<typeof cadastrarVendaSchema>;

const CadastrarVendas2 = () => {

    const form = useForm<CadastrarVendaFormValues>({
        resolver: zodResolver(cadastrarVendaSchema),
        defaultValues: {
            clienteId: "",
            funcionarioId: "",
            tipoPagamento: "CREDITO",
            desconto: 0,
            itens: [
                {
                    produtoId: "",
                    unidadesProduto: 1
                }
            ]
        }
    });

    const { control, handleSubmit, reset, setValue } = form;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const { mutateAsync: cadastrarVendaFn } = useMutation({
        mutationFn: cadastrarVenda
    });

    async function onSubmit(values: CadastrarVendaFormValues) {
        setIsSubmitting(true);

        try {
            console.log("values:", values)
            await cadastrarVendaFn(values);
            toast.success("Venda cadastrada com sucesso!");
            queryClient.invalidateQueries({ predicate: (query) => query.queryKey.includes("vendas") });
            reset();
            setIsOpen(false);
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : "Erro inesperado ao cadastrar venda.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }

    const [isOpen, setIsOpen] = useState(false);

    function handleClearCadastroVenda() {
        reset();
        setProdutosSelecionados([]);
        setIsOpen(false);
    }

    const [produtosSelecionados, setProdutosSelecionados] = useState<Produto[]>([]);


    const handleRemoveProduto = (index: number) => {
        const novosProdutos = produtosSelecionados.filter((_, i) => i !== index);
        setProdutosSelecionados(novosProdutos);
        setValue("itens", novosProdutos);
    };

    return ( 
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="default" size="sm" className="flex items-center justify-between w-48">
                    <span className="text-sm font-semibold">Cadastrar venda 2</span>
                    <ShoppingBag className="h-4 w-4" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle className="flex items-center">Cadastrar venda <ShoppingBag className="h-4 w-4 ml-2" /></SheetTitle>
                    <SheetDescription>Adicione os produtos vendidos e finalize a venda.</SheetDescription>
                </SheetHeader>

                <FormProvider {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
                        <div className="gap-4">
                            <ClienteField control={control} setValue={setValue} />
                            <FuncionarioField control={control} setValue={setValue} />
                            <AdicionarProdutoDialog produtosSelecionados={produtosSelecionados} setProdutosSelecionados={setProdutosSelecionados} />
                        </div>

                        <div className="max-h-60 overflow-y-auto w-full">
                            <ul className="mt-4 w-full p-2">
                                {produtosSelecionados.map((produto, index) => (
                                    <li key={index} className="flex items-center justify-between w-full border-b py-2">
                                        <div className="flex items-center">
                                            <Avatar className="mr-2 bg-black text-white">
                                                <AvatarFallback className="bg-black text-white">
                                                    {produto.nomeProduto ? produto.nomeProduto.split(' ').map(n => n.charAt(0).toUpperCase()).join('') : '?'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <p className="text-sm">{produto.nomeProduto}</p>
                                                <p className="text-xs text-gray-400">R$ {produto.precoProduto} x {produto.unidadesProduto} unid.</p>
                                                <p className="text-xs text-gray-400">Total: <span className="text-green-500">R$ {((produto.precoProduto) * (produto.unidadesProduto)).toFixed(2)}</span></p>
                                            </div>
                                        </div>
                                        <Button variant="destructive" size="sm" onClick={() => handleRemoveProduto(index)}>
                                            <XIcon />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>

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

                        <div className="">
                            <Button
                                type="submit"
                                variant="default"
                                size="sm"
                                className="flex w-full mb-2"
                                disabled={isSubmitting}
                            >   
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                {isSubmitting ? "Cadastrando..." : "Cadastrar Venda"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="flex w-full"
                                onClick={handleClearCadastroVenda}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Cancelar
                            </Button>
                        </div>

                    </form>
                </FormProvider>

            </SheetContent>
        </Sheet>

     );
}
 
export default CadastrarVendas2;