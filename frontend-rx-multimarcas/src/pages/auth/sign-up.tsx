"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Helmet } from "react-helmet-async"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { registerUser } from "@/api/register-user"

// Define the schema for the sign-up form
const signUpSchema = z.object({
  name: z.string().min(4, { message: "O nome deve ter pelo menos 4 caracteres." }),
  gender: z.enum(["masculino", "feminino"], { message: "O gênero deve ser 'masculino' ou 'feminino'." }),
  email: z.string().email({ message: "Endereço de e-mail inválido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." })
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUp() {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      gender: undefined,
      email: "",
      password: "",
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate();

  const { mutateAsync: registerUserFn } = useMutation({
    mutationFn: registerUser,
  })

  async function onSubmit(values: SignUpFormValues) {
    setIsSubmitting(true)
    try {
      await registerUserFn({ 
        name: values.name, 
        email: values.email, 
        password: values.password,
        gender: values.gender
      });

      toast.success("Usuário criado com sucesso! Entre em contato com o time de desenvolvimento para liberar sua conta.")
      form.reset();
      navigate(`/sign-in?email=${values.email}`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro inesperado ao cadastrar usuário.';
      toast.error(errorMessage);
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1 max-w-[450px] flex flex-col justify-center gap-6 ">
        <div className="max-w-[450px] flex flex-col justify-center gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Criar conta</h1>
            <p className="text-sm text-muted-foreground">Crie sua conta para ter acesso ao painel da trofeu.bet!</p>
        </div>
        
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Gender Field */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gênero</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="trofeu.bet@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Link to="/sign-in" className="text-right text-sm text-muted-foreground underline">Fazer login!</Link>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </form>
      <Helmet title="Cadastro"/>
    </Form>
  )
}
