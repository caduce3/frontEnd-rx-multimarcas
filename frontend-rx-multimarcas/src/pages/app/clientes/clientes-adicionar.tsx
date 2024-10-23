import { adicionarCliente } from "@/api/clientes/adicionar-cliente";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/lib/react-query";
import { mascaraCPF } from "@/services/onChangeCpf";
import { mascaraTelefone } from "@/services/onChangeTelefone";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { UserPlus, X } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Definir schema para cadastrar um cliente
const adicionarClienteSchema = z.object({
    nome: z.string().min(4, { message: "O nome deve ter pelo menos 4 caracteres." }),
    email: z.string().email({ message: "Endereço de e-mail inválido." }),
    cpf: z.string().length(14, { message: "O CPF deve estar no formato XXX.XXX.XXX-XX." }),
    telefone: z.string().length(15, { message: "O telefone deve estar no formato (XX) XXXXX-XXXX." }),
    endereco: z.object({
        rua: z.string().min(4),
        numero: z.string().min(1),
        bairro: z.string().min(4),
        cidade: z.string().min(4),
        estado: z.string().min(2),
        cep: z.string().length(9, { message: "O CEP deve estar no formato XXXXX-XXX." }),
    }).optional()
});

type AdicionarClienteFormValues = z.infer<typeof adicionarClienteSchema>;

const AdicionarClientes = () => {
    const form = useForm<AdicionarClienteFormValues>({
        resolver: zodResolver(adicionarClienteSchema),
        defaultValues: {
            nome: "",
            email: "",
            cpf: "",
            telefone: "",
            endereco: {
                rua: "",
                numero: "",
                bairro: "",
                cidade: "",
                estado: "",
                cep: ""
            }
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { mutateAsync: adicionarClienteFn } = useMutation({
        mutationFn: adicionarCliente
    });

    async function onSubmit(values: AdicionarClienteFormValues) {
        setIsSubmitting(true);

        try {
            await adicionarClienteFn(values);
            toast.success("Cliente criado com sucesso!");
            queryClient.invalidateQueries({ predicate: (query) => query.queryKey.includes("clientes") });
            form.reset();
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : "Erro inesperado ao cadastrar cliente.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }

    const [isOpen, setIsOpen] = useState(false);

    function handleClearCadastroCliente() {
        form.reset({
            nome: "",
            email: "",
            telefone: "",
            cpf: ""
        });
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm" className="flex items-center justify-between w-48">
                    <span className="text-sm font-semibold">Adicionar cliente</span>
                    <UserPlus className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar cliente</DialogTitle>
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
                                            <Input className="h-9 w-full" placeholder="Nome do cliente" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1 w-full">
                                        <FormLabel>E-mail</FormLabel>
                                        <FormControl>
                                            <Input className="h-9 w-full" placeholder="E-mail do cliente" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="telefone"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1 w-full">
                                        <FormLabel>Telefone</FormLabel>
                                        <FormControl>
                                            <Input 
                                                className="h-9 w-full" 
                                                placeholder="Telefone do cliente" 
                                                {...field} 
                                                onChange={(e) => {
                                                    const valorFormatado = mascaraTelefone(e.target.value);
                                                    field.onChange(valorFormatado);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="cpf"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1 w-full">
                                        <FormLabel>CPF</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-9 w-full"
                                                placeholder="CPF do cliente"
                                                {...field}
                                                onChange={(e) => {
                                                    const valorFormatado = mascaraCPF(e.target.value);
                                                    field.onChange(valorFormatado);
                                                }}
                                            />
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

export default AdicionarClientes;
