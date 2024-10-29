import { cadastrarVenda } from "@/api/vendas/cadastrar-venda";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"; // Importando Select
import { queryClient } from "@/lib/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { PackagePlus, UserPlus, X, XIcon } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Definir schema para cadastrar uma venda
// Definir schema para cadastrar uma venda
const cadastrarVendaSchema = z.object({
    clienteId: z.string(),
    funcionarioId: z.string(),
    tipoPagamento: z.union([z.literal("CREDITO"), z.literal("DEBITO"), z.literal("DINHEIRO")]),
    desconto: z.string()
        .transform((val) => parseFloat(val.replace(',', '.')))
        .refine(val => !isNaN(val) && val >= 0, { message: "O desconto deve ser maior ou igual a 0." }),
    itens: z.array(z.object({
        produtoId: z.string(),
        unidadesProduto: z.string()
            .transform((val) => parseFloat(val.replace(',', '.'))) // Transforma para número apenas durante a validação
            .refine(val => !isNaN(val) && val >= 1, { message: "A quantidade deve ser maior ou igual a 1." }),
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

    const { control, handleSubmit, reset } = form;
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
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm" className="flex items-center justify-between w-48">
                    <span className="text-sm font-semibold">Cadastrar venda</span>
                    <PackagePlus className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cadastrar venda</DialogTitle>
                </DialogHeader>

                <FormProvider {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
                        <div className=" gap-4">
                            {/* Campos clienteId e funcionarioId lado a lado */}
                            <FormField
                                control={control}
                                name="clienteId"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1 w-full mb-3">
                                        <FormLabel>Cliente ID</FormLabel>
                                        <FormControl>
                                            <Input className="h-9 w-full" placeholder="ID do cliente" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="funcionarioId"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1 w-full mb-3">
                                        <FormLabel>Funcionário ID</FormLabel>
                                        <FormControl>
                                            <Input className="h-9 w-full" placeholder="ID do funcionário" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Array de itens com produtoId e unidadesProduto */}
                        <div className="max-h-52 overflow-y-auto"> {/* Ajuste a altura máxima conforme necessário */}
                            {fields.map((item, index) => (
                                <div key={item.id} className="flex gap-4 border p-3 rounded-sm  mb-1">
                                    <FormField
                                        control={control}
                                        name={`itens.${index}.produtoId`}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col gap-1 w-full md:w-1/2">
                                                <FormLabel>ID do Produto</FormLabel>
                                                <FormControl>
                                                    <Input className="h-9 w-full" placeholder="ID do produto" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={control}
                                        name={`itens.${index}.unidadesProduto`} // Corrigir a interpolação aqui
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col gap-1 w-full md:w-1/5">
                                                <FormLabel>Quantidade</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        type="text" // Altere para 'text' para aceitar string
                                                        className="h-9 w-full" 
                                                        placeholder="Quantidade" 
                                                        {...field} 
                                                        onChange={(e) => field.onChange(e.target.value)} // Mantenha o valor como string
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="button" size="sm" variant="destructive" onClick={() => remove(index)} className="self-end flex-1">
                                        <XIcon className="h-4 w-4 mr-1" />
                                        Remover
                                    </Button>
                                </div>
                            ))}
                        </div>


                        <Button size="sm" variant="outline" type="button" onClick={() => append({ produtoId: "", unidadesProduto: 1 })} className="self-end mb-5">
                            <PackagePlus className="h-4 w-4 mr-2" />
                            Adicionar Produto
                        </Button>

                        <div className="flex gap-4">
                            {/* Seleção de tipo de pagamento */}
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

                            {/* Campo Desconto */}
                            <FormField
                                control={control}
                                name="desconto"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1 w-full md:w-1/2">
                                        <FormLabel>Desconto</FormLabel>
                                        <FormControl>
                                            <Input type="number" className="h-9 w-full" placeholder="Desconto" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" variant="default" size="sm" className="flex-1" disabled={isSubmitting}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="flex-1"
                                onClick={handleClearCadastroVenda}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Cancelar cadastro
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
};

export default CadastrarVendas;
