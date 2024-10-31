import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { pegarUnicoCliente, PegarUnicoClienteResponse } from "@/api/clientes/pegar-unico-cliente";
import { atualizarCliente } from "@/api/clientes/atualizar-cliente";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const clienteInformacoesPessoaisSchema = z.object({
    nome: z.string().min(4),
    email: z.string().email(),
    cpf: z.string(),
    telefone: z.string()
});

type ClienteInformacoesPessoaisSchema = z.infer<typeof clienteInformacoesPessoaisSchema>;

interface ClienteInformacoesPessoaisDialogProps {
    isOpen: boolean;
    onClose: () => void;
    clienteId: string;
}

export function ClienteInformacoesPessoaisDialog({ isOpen, onClose, clienteId }: ClienteInformacoesPessoaisDialogProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: informacoesPessoais, isLoading } = useQuery({
        queryKey: ['informacoesPessoais', clienteId],
        queryFn: async () => {
            if (!clienteId) {
                navigate(`/clientes`);
                toast.error(`Cliente não encontrado`);
                return Promise.reject("ID do Cliente não encontrado");
            }
            return pegarUnicoCliente({ id: clienteId });
        },
        enabled: !!clienteId,
    });

    const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm<ClienteInformacoesPessoaisSchema>({
        resolver: zodResolver(clienteInformacoesPessoaisSchema),
    });

    useEffect(() => {
        if (informacoesPessoais) {
            reset({
                nome: informacoesPessoais.cliente.nome,
                email: informacoesPessoais.cliente.email,
                cpf: informacoesPessoais.cliente.cpf,
                telefone: informacoesPessoais.cliente.telefone
            });
        }
    }, [informacoesPessoais, reset]);

    const { mutateAsync: atualizarInformacoesPessoaisClienteFn } = useMutation({
        mutationFn: atualizarCliente,
        onSuccess(_, { id, nome, email, cpf, telefone }) {
            const cached = queryClient.getQueryData<PegarUnicoClienteResponse>(['informacoesPessoais']);
            if (cached) {
                queryClient.setQueryData(['informacoesPessoais', id], {
                    id,
                    nome,
                    email,
                    cpf,
                    telefone
                });
            }
            queryClient.invalidateQueries({ predicate: (query) => query.queryKey.includes("cliente_info_pessoais") });
        },
    });

    async function handleSubmitClienteInformacoesPessoais(data: ClienteInformacoesPessoaisSchema) {
        try {
            await atualizarInformacoesPessoaisClienteFn({
                id: informacoesPessoais?.cliente.id ?? '',
                nome: data.nome,
                email: data.email,
                cpf: data.cpf,
                telefone: data.telefone,
                dateCreated: informacoesPessoais?.cliente.dateCreated ? new Date(informacoesPessoais.cliente.dateCreated) : new Date(),
                dateUpdated: new Date(), 
            });
            toast.success("Informações pessoais atualizadas com sucesso!");
            onClose();
        } catch (error: any) {
            // Verifique se a estrutura do erro é a esperada
            let errorMessage = 'Erro desconhecido ao atualizar informações pessoais do cliente.';
            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        }
    }

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Perfil do cliente</DialogTitle>
                    <DialogDescription>Atualize as informações pessoais do cliente.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleSubmitClienteInformacoesPessoais)}>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right" htmlFor="nome-cliente">
                                Nome
                            </Label>
                            {isLoading ? 
                                <Skeleton className="h-[30px] w-[300px]"/> 
                            : 
                                <Input className="col-span-3" id="nome-cliente" {...register('nome')} />
                            }
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right" htmlFor="email-cliente">
                                E-mail
                            </Label>
                            {isLoading ? 
                                <Skeleton className="h-[30px] w-[300px]"/> 
                            : 
                            <Input className="col-span-3" id="email-cliente" {...register('email')} />
                            }
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right" htmlFor="cpf-cliente">
                                CPF
                            </Label>
                            {isLoading ? 
                                <Skeleton className="h-[30px] w-[300px]"/> 
                            : 
                            <Input className="col-span-3" id="cpf-cliente" {...register('cpf')} />
                            }
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right" htmlFor="telefone-cliente">
                                Telefone
                            </Label>
                            {isLoading ? 
                                <Skeleton className="h-[30px] w-[300px]"/> 
                            : 
                            <Input className="col-span-3" id="telefone-cliente" {...register('telefone')} />
                            }
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
                        </DialogClose>
                        <Button variant="success" type="submit" disabled={isSubmitting}>Salvar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
