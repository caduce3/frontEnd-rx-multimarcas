import { DialogDescription } from "@radix-ui/react-dialog";
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { getProfileFuncionario, GetProfileFuncionarioResponse } from "@/api/get-profile-funcionario";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  updateFuncionarioProfile } from "@/api/update-profile-funcionario";
import { toast } from "sonner";

const funcionarioProfileSchema = z.object({
    nome: z.string().min(4),
    email: z.string().email()
})

type FuncionarioProfileSchema = z.infer<typeof funcionarioProfileSchema>

export function FuncionarioProfileDialog() {

    const { data: profileFuncionario } = useQuery({
        queryKey: ['profileFuncionario'],
        queryFn: getProfileFuncionario
    });

    const { register, handleSubmit, formState: {isSubmitting} } = useForm<FuncionarioProfileSchema>({
        resolver: zodResolver(funcionarioProfileSchema),
        values: {
            nome: profileFuncionario?.nome ?? '',
            email: profileFuncionario?.email ?? ''
        }
    })

    const queryClient = useQueryClient()

    const { mutateAsync: updateFuncionarioProfileFn } = useMutation({
        mutationFn: updateFuncionarioProfile,
        onSuccess(_, {nome, email}) {
            const cached = queryClient.getQueryData<GetProfileFuncionarioResponse>(['profileFuncionario'])
            if(cached){
                queryClient.setQueryData(
                    ['profileFuncionario'], {
                    ...cached,
                    nome,
                    email
                })
            }
        }
    })

    async function handleSubmitFuncionarioProfile(data: FuncionarioProfileSchema) {
        try {
            await updateFuncionarioProfileFn({ 
                id: profileFuncionario?.id ?? '',
                nome: data.nome,
                email: data.email
            });
            toast.success("Perfil atualizado com sucesso!");
        } catch {
            toast.error("Erro ao atualizar este usuário!")
        }
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Perfil do usuário</DialogTitle>
                <DialogDescription>Atualize as suas informações de usuário.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(handleSubmitFuncionarioProfile)}>
                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right" htmlFor="name-user">
                            Nome
                        </Label>
                        <Input className="col-span-3" id="name-user" {...register('nome')} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right" htmlFor="email-user">
                            E-mail
                        </Label>
                        <Input className="col-span-3" id="email-user" {...register('email')}/>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" type="button">Cancelar</Button>
                    </DialogClose>
                    <Button variant="success" type="submit" disabled={isSubmitting}>Salvar</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}
