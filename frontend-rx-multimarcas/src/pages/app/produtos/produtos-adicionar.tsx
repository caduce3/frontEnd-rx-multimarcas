import { CadastrarProduto } from "@/api/produtos/cadastrar-produto";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/lib/react-query";
import { mascaraNumero } from "@/services/onChangeNumero";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { PackagePlus, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Definir schema para cadastrar um cliente
const cadastrarProdutoSchema = z.object({
    nome: z.string().min(4, { message: "O nome deve ter pelo menos 4 caracteres." }),
    descricao: z.string().min(5, { message: "A descrição deve ter pelo menos 5 caracteres." }),
    preco: z.string().transform((val) => parseFloat(val.replace(',', '.'))).refine(val => !isNaN(val) && val > 0.01, { message: "O preço deve ser maior que R$ 0,01." }),
    quantidadeDisponivel: z.number().min(1, { message: "A quantidade disponível deve ser maior que 0." })
});

type CadastrarProdutoFormValues = z.infer<typeof cadastrarProdutoSchema>;

const CadastrarProdutos = () => {
    const form = useForm<CadastrarProdutoFormValues>({
        resolver: zodResolver(cadastrarProdutoSchema),
        defaultValues: {
            nome: "",
            descricao: "",
            preco: 0,
            quantidadeDisponivel: 0,
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { mutateAsync: cadastrarProdutoFn } = useMutation({
        mutationFn: CadastrarProduto
    });

    async function onSubmit(values: CadastrarProdutoFormValues) {
        setIsSubmitting(true);

        try {
            await cadastrarProdutoFn(values);
            toast.success("Produto cadastrado com sucesso!");
            queryClient.invalidateQueries({ predicate: (query) => query.queryKey.includes("produtos") });
            form.reset({
                nome: "",
                descricao: "",
                preco: 0,
                quantidadeDisponivel: 0
            });
            setIsOpen(false);
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : "Erro inesperado ao cadastrar produto.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }

    const [isOpen, setIsOpen] = useState(false);

    function handleClearCadastroCliente() {
        form.reset({
            nome: "",
            descricao: "",
            preco: undefined,
            quantidadeDisponivel: undefined,
        });
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm" className="flex items-center justify-between w-48">
                    <span className="text-sm font-semibold">Cadastrar produto</span>
                    <PackagePlus className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cadastrar produto</DialogTitle>
                </DialogHeader>

                {/* FormProvider envolve o formulário, fornecendo o contexto */}
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
                        <div className="flex flex-wrap gap-4">
                            <FormField
                                control={form.control}
                                name="nome"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1 w-full">
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input className="h-9 w-full" placeholder="Nome do produto" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="descricao"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1 w-full">
                                        <FormLabel>Descrição</FormLabel>
                                        <FormControl>
                                            <Input className="h-9 w-full" placeholder="Descrição do produto" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-4 w-full">
                                {/* Campo Preço */}
                                <FormField
                                    control={form.control}
                                    name="preco"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col gap-1 w-full">
                                            <FormLabel>Preço</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    className="h-9 w-full"
                                                    placeholder="Preço do produto"
                                                    value={field.value} // Valor em texto
                                                    onChange={(e) => {
                                                        const maskedValue = mascaraNumero(e.target.value);
                                                        field.onChange(maskedValue); // Mantém como string formatada
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Campo Estoque */}
                                <FormField
                                    control={form.control}
                                    name="quantidadeDisponivel"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col gap-1 w-full">
                                            <FormLabel>Estoque</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    className="h-9 w-full"
                                                    placeholder="Quantidade em estoque"
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        const maskedValue = mascaraNumero(e.target.value);
                                                        const numericValue = parseFloat(maskedValue.replace(',', '.')); // Convertendo para número
                                                        field.onChange(isNaN(numericValue) ? undefined : numericValue);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

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
                                onClick={handleClearCadastroCliente}
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

export default CadastrarProdutos;