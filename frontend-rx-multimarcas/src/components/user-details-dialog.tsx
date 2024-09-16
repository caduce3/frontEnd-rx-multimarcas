import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserProfile } from "@/api/update-profile-user";
import { toast } from "sonner";
import { getDetailsUser, GetUniqueUserResponse } from "@/api/get-unique-user";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Skeleton } from "./ui/skeleton";
import { useEffect } from "react";

const userDetailsSchema = z.object({
    name: z.string().min(4),
    email: z.string().email(),
    status: z.enum(["ACTIVE", "INACTIVE"]),
    sector: z.enum(["RISCO", "DESENVOLVIMENTO", "TRAFEGO", "FINANCEIRO", "GERENCIAL", "USER", "AFILIADOS"]),
});

type UserDetailsSchema = z.infer<typeof userDetailsSchema>;

interface UserDetailsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
}

export function UserDetailsDialog({ isOpen, onClose, userId }: UserDetailsDialogProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: detailsUser, isLoading } = useQuery({
        queryKey: ['detailsUser', userId],
        queryFn: async () => {
            if (!userId) {
                navigate(`/users`);
                toast.error(`Jogador não encontrado`);
                return Promise.reject("ID do jogador não encontrado");
            }
            return getDetailsUser({ id: userId });
        },
        enabled: !!userId,
    });

    const { register, handleSubmit, formState: { isSubmitting }, setValue, watch, reset } = useForm<UserDetailsSchema>({
        resolver: zodResolver(userDetailsSchema),
    });

    useEffect(() => {
        if (detailsUser) {
            reset({
                name: detailsUser.user.name,
                email: detailsUser.user.email,
                status: detailsUser.user.status,
                sector: detailsUser.user.sector,
            });
        }
    }, [detailsUser, reset]);

    const { mutateAsync: updateUserDetailsFn } = useMutation({
        mutationFn: updateUserProfile,
        onSuccess(_, { id, name, email, status, sector }) {
            const cached = queryClient.getQueryData<GetUniqueUserResponse>(['detailsUser']);
            if (cached) {
                queryClient.setQueryData(['detailsUser', id], {
                    id,
                    name,
                    email,
                    status,
                    sector,
                });
            }
            queryClient.invalidateQueries({ predicate: (query) => query.queryKey.includes("users") });
        },
    });

    async function handleSubmitUserDetails(data: UserDetailsSchema) {
        try {
            await updateUserDetailsFn({
                id: detailsUser?.user.id ?? '',
                name: data.name,
                email: data.email,
                status: data.status,
                sector: data.sector,
            });
            toast.success("Perfil atualizado com sucesso!");
            onClose();
        } catch {
            toast.error("Erro ao atualizar este usuário!");
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

                <form onSubmit={handleSubmit(handleSubmitUserDetails)}>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right" htmlFor="name-user">
                                Nome
                            </Label>
                            {isLoading ? 
                                <Skeleton className="h-[30px] w-[300px]"/> 
                            : 
                                <Input className="col-span-3" id="name-user" {...register('name')} />
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
                                <Select onValueChange={(value) => setValue('status', value as UserDetailsSchema['status'])} value={watch('status')}>
                                    <SelectTrigger id="status-user">
                                        <SelectValue placeholder="Selecione o status" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="ACTIVE">Ativo</SelectItem>
                                        <SelectItem value="INACTIVE">Inativo</SelectItem>
                                    </SelectContent>
                                </Select>
                            }
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right" htmlFor="sector-user">
                                Setor
                            </Label>
                            {isLoading ? 
                                <Skeleton className="h-[30px] w-[100px]"/> 
                                :
                                <Select onValueChange={(value) => setValue('sector', value as UserDetailsSchema['sector'])} value={watch('sector')}>
                                    <SelectTrigger id="sector-user">
                                        <SelectValue placeholder="Selecione um setor" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="RISCO">Risco</SelectItem>
                                        <SelectItem value="DESENVOLVIMENTO">Desenvolvimento</SelectItem>
                                        <SelectItem value="TRAFEGO">Tráfego</SelectItem>
                                        <SelectItem value="FINANCEIRO">Financeiro</SelectItem>
                                        <SelectItem value="GERENCIAL">Gerencial</SelectItem>
                                        <SelectItem value="USER">Usuário</SelectItem>
                                        <SelectItem value="AFILIADOS">Afiliados</SelectItem>
                                    </SelectContent>
                                </Select>
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
