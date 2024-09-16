import { DialogDescription } from "@radix-ui/react-dialog";
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { getProfileUser, GetProfileUserResponse } from "@/api/get-profile-user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  updateUserProfile } from "@/api/update-profile-user";
import { toast } from "sonner";

const userProfileSchema = z.object({
    name: z.string().min(4),
    email: z.string().email()
})

type UserProfileSchema = z.infer<typeof userProfileSchema>

export function UserProfileDialog() {

    const { data: profileUser } = useQuery({
        queryKey: ['profileUser'],
        queryFn: getProfileUser
    });

    const { register, handleSubmit, formState: {isSubmitting} } = useForm<UserProfileSchema>({
        resolver: zodResolver(userProfileSchema),
        values: {
            name: profileUser?.name ?? '',
            email: profileUser?.email ?? ''
        }
    })

    const queryClient = useQueryClient()

    const { mutateAsync: updateUserProfileFn } = useMutation({
        mutationFn: updateUserProfile,
        onSuccess(_, {name, email}) {
            const cached = queryClient.getQueryData<GetProfileUserResponse>(['profileUser'])
            if(cached){
                queryClient.setQueryData(
                    ['profileUser'], {
                    ...cached,
                    name,
                    email
                })
            }
        }
    })

    async function handleSubmitUserProfile(data: UserProfileSchema) {
        try {
            await updateUserProfileFn({ 
                id: profileUser?.id ?? '',
                name: data.name,
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

            <form onSubmit={handleSubmit(handleSubmitUserProfile)}>
                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right" htmlFor="name-user">
                            Nome
                        </Label>
                        <Input className="col-span-3" id="name-user" {...register('name')} />
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
