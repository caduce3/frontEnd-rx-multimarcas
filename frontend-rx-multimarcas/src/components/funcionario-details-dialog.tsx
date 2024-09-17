import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateFuncionarioProfile } from "@/api/update-profile-funcionario";
import { toast } from "sonner";
import { getDetailsFuncionario, GetUniqueFuncionarioResponse } from "@/api/get-unique-funcionario";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Skeleton } from "./ui/skeleton";
import { useEffect } from "react";

const funcionarioDetailsSchema = z.object({
    nome: z.string().min(4),
    email: z.string().email(),
    status: z.enum(["ATIVO", "INATIVO"]),
    cargo: z.enum(["PROPRIETARIO", "ADMINISTRADOR", "COLABORADOR"]),
    cpf: z.string(),
    telefone: z.string()
});

type FuncionarioDetailsSchema = z.infer<typeof funcionarioDetailsSchema>;

interface FuncionarioDetailsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    funcionarioId: string;
}

export function FuncionarioDetailsDialog({ isOpen, onClose, funcionarioId }: FuncionarioDetailsDialogProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: detailsFuncionario, isLoading } = useQuery({
        queryKey: ['detailsFuncionario', funcionarioId],
        queryFn: async () => {
            if (!funcionarioId) {
                navigate(`/funcionarios`);
                toast.error(`Funcionário não encontrado`);
                return Promise.reject("ID do Funcionário não encontrado");
            }
            return getDetailsFuncionario({ id: funcionarioId });
        },
        enabled: !!funcionarioId,
    });

    const { register, handleSubmit, formState: { isSubmitting }, setValue, watch, reset } = useForm<FuncionarioDetailsSchema>({
        resolver: zodResolver(funcionarioDetailsSchema),
    });

    useEffect(() => {
        if (detailsFuncionario) {
            reset({
                nome: detailsFuncionario.funcionario.nome,
                email: detailsFuncionario.funcionario.email,
                status: detailsFuncionario.funcionario.status,
                cargo: detailsFuncionario.funcionario.cargo,
                cpf: detailsFuncionario.funcionario.cpf,
                telefone: detailsFuncionario.funcionario.telefone
            });
        }
    }, [detailsFuncionario, reset]);

    const { mutateAsync: updateFuncionarioDetailsFn } = useMutation({
        mutationFn: updateFuncionarioProfile,
        onSuccess(_, { id, nome, email, status, cargo, cpf, telefone }) {
            const cached = queryClient.getQueryData<GetUniqueFuncionarioResponse>(['detailsFuncionario']);
            if (cached) {
                queryClient.setQueryData(['detailsFuncionario', id], {
                    id,
                    nome,
                    email,
                    status,
                    cargo,
                    cpf,
                    telefone
                });
            }
            queryClient.invalidateQueries({ predicate: (query) => query.queryKey.includes("funcionarios") });
        },
    });

    async function handleSubmitFuncionarioDetails(data: FuncionarioDetailsSchema) {
        try {
            await updateFuncionarioDetailsFn({
                id: detailsFuncionario?.funcionario.id ?? '',
                nome: data.nome,
                email: data.email,
                status: data.status,
                cargo: data.cargo,
                cpf: data.cpf,
                telefone: data.telefone
            });
            toast.success("Perfil atualizado com sucesso!");
            onClose();
        } catch (error: any) {
            // Verifique se a estrutura do erro é a esperada
            let errorMessage = 'Erro desconhecido ao atualizar perfil.';
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
                    <DialogTitle>Perfil do usuário</DialogTitle>
                    <DialogDescription>Atualize as informações de usuário.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleSubmitFuncionarioDetails)}>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right" htmlFor="name-user">
                                Nome
                            </Label>
                            {isLoading ? 
                                <Skeleton className="h-[30px] w-[300px]"/> 
                            : 
                                <Input className="col-span-3" id="name-user" {...register('nome')} />
                            }
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right" htmlFor="email-user">
                                E-mail
                            </Label>
                            {isLoading ? 
                                <Skeleton className="h-[30px] w-[300px]"/> 
                            : 
                            <Input className="col-span-3" id="email-user" {...register('email')} />
                            }
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right" htmlFor="status-user">
                                Status
                            </Label>
                            {isLoading ? 
                                <Skeleton className="h-[30px] w-[100px]"/> 
                                :
                                <Select onValueChange={(value) => setValue('status', value as FuncionarioDetailsSchema['status'])} value={watch('status')}>
                                    <SelectTrigger id="status-user">
                                        <SelectValue placeholder="Selecione o status" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="ATIVO">Ativo</SelectItem>
                                        <SelectItem value="INATIVO">Inativo</SelectItem>
                                    </SelectContent>
                                </Select>
                            }
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right" htmlFor="sector-user">
                                Cargo
                            </Label>
                            {isLoading ? 
                                <Skeleton className="h-[30px] w-[100px]"/> 
                                :
                                <Select onValueChange={(value) => setValue('cargo', value as FuncionarioDetailsSchema['cargo'])} value={watch('cargo')}>
                                    <SelectTrigger id="cargo-user">
                                        <SelectValue placeholder="Selecione um setor" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="PROPRIETARIO">Proprietário</SelectItem>
                                        <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
                                        <SelectItem value="COLABORADOR">Colaborador</SelectItem>
                                    </SelectContent>
                                </Select>
                            }
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right" htmlFor="cpf-user">
                                CPF
                            </Label>
                            {isLoading ? 
                                <Skeleton className="h-[30px] w-[300px]"/> 
                            : 
                            <Input className="col-span-3" id="cpf-user" {...register('cpf')} />
                            }
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right" htmlFor="telefone-user">
                                Telefone
                            </Label>
                            {isLoading ? 
                                <Skeleton className="h-[30px] w-[300px]"/> 
                            : 
                            <Input className="col-span-3" id="telefone-user" {...register('telefone')} />
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
