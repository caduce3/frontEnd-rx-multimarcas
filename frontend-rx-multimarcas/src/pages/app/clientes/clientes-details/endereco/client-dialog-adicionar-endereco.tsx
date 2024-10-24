import { adicionarEnderecoCliente } from "@/api/enderecos/adicionar-endereco";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/lib/react-query";
import { mascaraCEP } from "@/services/onChangeCEP";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Plus, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

// Definir schema para cadastrar um cliente
const adicionarEnderecoClienteSchema = z.object({
    endereco: z.object({
        rua: z.string().min(4),
        numero: z.string().min(1),
        bairro: z.string().min(4),
        cidade: z.string().min(4),
        estado: z.string().min(2),
        cep: z.string().length(9, { message: "O CEP deve estar no formato XXXXX-XXX." }),
    })
});

type AdicionarEnderecoClienteFormValues = z.infer<typeof adicionarEnderecoClienteSchema>;

const AdicionarEnderecoClientes = () => {
    const form = useForm<AdicionarEnderecoClienteFormValues>({
        resolver: zodResolver(adicionarEnderecoClienteSchema),
        defaultValues: {
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

    const { mutateAsync: adicionarEnderecoClienteFn } = useMutation({
        mutationFn: adicionarEnderecoCliente
    });

    const { id } = useParams<{ id: string }>();

    async function onSubmit(values: AdicionarEnderecoClienteFormValues) {
        setIsSubmitting(true);

        try {
            await adicionarEnderecoClienteFn({
                id_cliente: id ?? "",
                endereco: values.endereco
            });
            toast.success("Cliente criado com sucesso!");
            queryClient.invalidateQueries({ predicate: (query) => query.queryKey.includes("cliente_info_pessoais") });
            form.reset({
                endereco: {
                    rua: "",
                    numero: "",
                    bairro: "",
                    cidade: "",
                    estado: "",
                    cep: ""
                }
            });
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : "Erro inesperado ao cadastrar endereço.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }

    const [isOpen, setIsOpen] = useState(false);

    function handleClearCadastroEnderecoCliente() {
        form.reset({
            endereco: {
                rua: "",
                numero: "",
                bairro: "",
                cidade: "",
                estado: "",
                cep: ""
            }
        });
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size="sm" className="flex items-center justify-between">
                    <span className="text-sm font-semibold mr-2">Adicionar endereço</span>
                    <Plus className="h-4 w-4" />
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
                                name="endereco.rua"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1 w-full mr-2">
                                        <FormLabel>Rua</FormLabel>
                                        <FormControl>
                                            <Input className="h-9 w-full" placeholder="Rua" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endereco.bairro"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1 w-full">
                                        <FormLabel>Bairro</FormLabel>
                                        <FormControl>
                                            <Input className="h-9 w-full" placeholder="Bairro" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex w-full">
                            <FormField
                                control={form.control}
                                name="endereco.cidade"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1 w-full mr-2">
                                        <FormLabel>Cidade</FormLabel>
                                        <FormControl>
                                            <Input className="h-9 w-full" placeholder="Cidade" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endereco.estado"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1 w-full">
                                        <FormLabel>Estado</FormLabel>
                                        <FormControl>
                                            <Input className="h-9 w-full" placeholder="Estado" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex w-full">
                            <FormField
                                control={form.control}
                                name="endereco.cep"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1 w-full mr-2">
                                        <FormLabel>CEP</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-9 w-full"
                                                placeholder="CEP"
                                                {...field}
                                                onChange={(e) => {
                                                    const valorFormatado = mascaraCEP(e.target.value);
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
                                name="endereco.numero"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1 w-full">
                                        <FormLabel>Número</FormLabel>
                                        <FormControl>
                                            <Input className="h-9 w-full" placeholder="Número" {...field} />
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
                                onClick={handleClearCadastroEnderecoCliente}
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

export default AdicionarEnderecoClientes;
