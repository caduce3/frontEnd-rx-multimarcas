import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { pegarUnicoProduto, PegarUnicoProdutoResponse } from "@/api/produtos/pegar-unico-produto";
import { atualizarProduto } from "@/api/produtos/atualizar-produto";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mascaraNumero } from "@/services/onChangeNumero";

const produtosDetailsSchema = z.object({
    nome: z.string().min(4),
    descricao: z.string().min(4),
    preco: z.string().transform((val) => parseFloat(val.replace(',', '.'))).refine(val => !isNaN(val) && val > 0.01, { message: "O preço deve ser maior que R$ 0,01." }),
    quantidadeDisponivel: z.coerce.number().min(1, { message: "A quantidade disponível deve ser maior que 0." }) // Coerce transforma strings automaticamente em números
});


type ProdutoDetailsSchema = z.infer<typeof produtosDetailsSchema>;

interface ProdutoDetailsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    produtoId: string;
}

export function ProdutoDetailsDialog({ isOpen, onClose, produtoId }: ProdutoDetailsDialogProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: detailsProduto, isLoading } = useQuery({
        queryKey: ['detailsProduto', produtoId],
        queryFn: async () => {
            if (!produtoId) {
                navigate(`/produtos`);
                toast.error(`Produto não encontrado`);
                return Promise.reject("ID do produto não encontrado");
            }
            return pegarUnicoProduto({ id_produto: produtoId });
        },
        enabled: !! produtoId,
    });

    const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm<ProdutoDetailsSchema>({
        resolver: zodResolver(produtosDetailsSchema),
    });

    useEffect(() => {
        if (detailsProduto) {
            reset({
                nome: detailsProduto.produto.nome,
                descricao: detailsProduto.produto.descricao,
                preco: detailsProduto.produto.preco,
                quantidadeDisponivel: detailsProduto.produto.quantidadeDisponivel
            });
        }
    }, [detailsProduto, reset]);

    const { mutateAsync: atualizarProdutoDetailsFn } = useMutation({
        mutationFn: atualizarProduto,
        onSuccess(_, { id_produto, nome, descricao, preco, quantidadeDisponivel }) {
            const cached = queryClient.getQueryData<PegarUnicoProdutoResponse>(['detailsProduto']);
            if (cached) {
                queryClient.setQueryData(['detailsProduto', id_produto], {
                    id_produto,
                    nome,
                    descricao,
                    preco,
                    quantidadeDisponivel
                });
            }
            queryClient.invalidateQueries({ predicate: (query) => query.queryKey.includes("produtos") });
        },
    });

    async function handleSubmitProdutoDetails(data: ProdutoDetailsSchema) {
        try {
            await atualizarProdutoDetailsFn({
                id_produto: detailsProduto?.produto.id ?? '',
                nome: data.nome,
                descricao: data.descricao,
                preco: data.preco,
                quantidadeDisponivel: data.quantidadeDisponivel
            });
            toast.success("Produto atualizado com sucesso!");
            onClose();
        } catch (error: any) {
            // Verifique se a estrutura do erro é a esperada
            let errorMessage = 'Erro desconhecido ao atualizar produto.';
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
                    <DialogTitle>Dados do produto</DialogTitle>
                    <DialogDescription>Atualize as informações do produto.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleSubmitProdutoDetails)}>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right" htmlFor="name-produto">
                                Nome
                            </Label>
                            {isLoading ? 
                                <Skeleton className="h-[30px] w-[300px]"/> 
                            : 
                                <Input className="col-span-3" id="name-produto" {...register('nome')} />
                            }
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right" htmlFor="email-user">
                                Descrição
                            </Label>
                            {isLoading ? 
                                <Skeleton className="h-[30px] w-[300px]"/> 
                            : 
                            <Input className="col-span-3" id="descricao-produto" {...register('descricao')} />
                            }
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right" htmlFor="preco-produto">
                                R$
                            </Label>
                            {isLoading ? 
                                <Skeleton className="h-[30px] w-[300px]"/> 
                            : 
                                <Input
                                    type="text"
                                    className="col-span-3 h-9 w-full"
                                    placeholder="Preço do produto"
                                    {...register('preco', {
                                        onChange: (e) => {
                                            const maskedValue = mascaraNumero(e.target.value);
                                            e.target.value = maskedValue;
                                        }
                                    })}
                                />
                            }
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right" htmlFor="quantidadeDisponivel-produto">
                                Estoque
                            </Label>
                            {isLoading ? 
                                <Skeleton className="h-[30px] w-[300px]"/> 
                            : 
                                <Input
                                    type="number"
                                    className="col-span-3 h-9 w-full"
                                    placeholder="Quantidade disponível"
                                    {...register('quantidadeDisponivel')}
                                />
                        
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
