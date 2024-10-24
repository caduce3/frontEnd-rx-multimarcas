import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { pegarUnicoEndereco, PegarUnicoEnderecoResponse } from "@/api/enderecos/pegar-unico-endereco";
import { atualizarEndereco } from "@/api/enderecos/atualizar-endereco";
import { mascaraCEP } from "@/services/onChangeCEP";

const clienteInformacoesEnderecoSchema = z.object({
    endereco: z.object({
        rua: z.string().min(4),
        numero: z.string().min(1),
        bairro: z.string().min(4),
        cidade: z.string().min(4),
        estado: z.string().min(2),
        cep: z.string(),
    })
});

type ClienteInformacoesEnderecoSchema = z.infer<typeof clienteInformacoesEnderecoSchema>;

interface ClienteInformacoesEnderecoDialogProps {
    isOpen: boolean;
    onClose: () => void;
    enderecoId: string;
}

export function ClienteInformacoesEnderecoDialog({ isOpen, onClose, enderecoId }: ClienteInformacoesEnderecoDialogProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: informacoesEndereco, isLoading } = useQuery({
        queryKey: ['informacoesEndereco', enderecoId],
        queryFn: async () => {
            if (!enderecoId) {
                navigate(`/clientes`);
                toast.error(`Endereço não encontrado`);
                return Promise.reject("ID do endereço não encontrado");
            }
            return pegarUnicoEndereco({ id: enderecoId });
        },
        enabled: !! enderecoId,
    });

    const { register, handleSubmit, formState: { isSubmitting }, reset, setValue } = useForm<ClienteInformacoesEnderecoSchema>({
        resolver: zodResolver(clienteInformacoesEnderecoSchema),
    });

    useEffect(() => {
        if (informacoesEndereco) {
            reset({
                endereco: {
                    rua: informacoesEndereco.endereco.rua,
                    numero: informacoesEndereco.endereco.numero,
                    bairro: informacoesEndereco.endereco.bairro,
                    cidade: informacoesEndereco.endereco.cidade,
                    estado: informacoesEndereco.endereco.estado,
                    cep: informacoesEndereco.endereco.cep
                }
            });
        }
    }, [informacoesEndereco, reset]);

    const { mutateAsync: atualizarInformacoesEnderecoClienteFn } = useMutation({
        mutationFn: atualizarEndereco,
        onSuccess(_, { id_endereco, endereco }) {
            const cached = queryClient.getQueryData<PegarUnicoEnderecoResponse>(['informacoesEndereco']);
            if (cached) {
                queryClient.setQueryData(['informacoesEndereco', id_endereco], {
                    id_endereco,
                    endereco
                });
            }
            queryClient.invalidateQueries({ predicate: (query) => query.queryKey.includes("cliente_info_pessoais") });
        },
    });

    async function handleSubmitClienteInformacoesEndereco(data: ClienteInformacoesEnderecoSchema) {
        try {
            await atualizarInformacoesEnderecoClienteFn({
                id_endereco: informacoesEndereco?.endereco.id ?? '',
                endereco: {
                    ...data.endereco,
                    id: informacoesEndereco?.endereco.id ?? ''
                }
            });
            toast.success("Informações de endereço atualizadas com sucesso!");
            onClose();
        } catch (error: any) {
            // Verifique se a estrutura do erro é a esperada
            let errorMessage = 'Erro desconhecido ao atualizar informações de endereço do cliente.';
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
                    <DialogTitle>Informações de endereço</DialogTitle>
                    <DialogDescription>Atualize as informações endereço do cliente.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleSubmitClienteInformacoesEndereco)}>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right" htmlFor="rua-cliente">
                                Rua
                            </Label>
                            {isLoading ? 
                                <Skeleton className="h-[30px] w-[300px]"/> 
                            : 
                                <Input className="col-span-3" id="rua-cliente" {...register('endereco.rua')} />
                            }
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right" htmlFor="numero-cliente">
                                Número
                            </Label>
                            {isLoading ? 
                                <Skeleton className="h-[30px] w-[300px]"/> 
                            : 
                            <Input className="col-span-3" id="numero-cliente" {...register('endereco.numero')} />
                            }
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right" htmlFor="bairro-cliente">
                                Bairro
                            </Label>
                            {isLoading ? 
                                <Skeleton className="h-[30px] w-[300px]"/> 
                            : 
                            <Input className="col-span-3" id="bairro-cliente" {...register('endereco.bairro')} />
                            }
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right" htmlFor="cidade-cliente">
                                Cidade
                            </Label>
                            {isLoading ? 
                                <Skeleton className="h-[30px] w-[300px]"/> 
                            : 
                            <Input className="col-span-3" id="cidade-cliente" {...register('endereco.cidade')} />
                            }
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right" htmlFor="estado-cliente">
                                Estado
                            </Label>
                            {isLoading ? 
                                <Skeleton className="h-[30px] w-[300px]"/> 
                            : 
                            <Input className="col-span-3" id="estado-cliente" {...register('endereco.estado')} />
                            }
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right" htmlFor="cep-cliente">
                                CEP
                            </Label>
                            {isLoading ? (
                                <Skeleton className="h-[30px] w-[300px]" />
                            ) : (
                                <Input
                                    className="col-span-3 h-9 w-full"
                                    id="cep-cliente"
                                    placeholder="CEP"
                                    {...register('endereco.cep')}
                                    onChange={(e) => {
                                        const valorFormatado = mascaraCEP(e.target.value);
                                        setValue('endereco.cep', valorFormatado);
                                    }}
                                />
                            )}
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
