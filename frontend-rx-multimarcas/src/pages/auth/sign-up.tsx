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
import { Link, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { registerFuncionario } from "@/api/register-funcionario"
import logo from "../../assets/logoRXmulti.png";

// Define the schema for the sign-up form
const signUpSchema = z.object({
  nome: z.string().min(4, { message: "O nome deve ter pelo menos 4 caracteres." }),
  email: z.string().email({ message: "Endereço de e-mail inválido." }),
  senha: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  cpf: z.string().length(14, { message: "O CPF deve estar no formato XXX.XXX.XXX-XX." }),
  telefone: z.string().length(15, { message: "O telefone deve estar no formato (XX) XXXXX-XXXX." }),
  genero: z.string().optional(),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUp() {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      cpf: "",
      telefone: ""
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate();

  const { mutateAsync: registerFuncionarioFn } = useMutation({
    mutationFn: registerFuncionario,
  })

  async function onSubmit(values: SignUpFormValues) {
    setIsSubmitting(true)
    try {
      await registerFuncionarioFn({ 
        nome: values.nome, 
        email: values.email, 
        senha: values.senha,
        cpf: values.cpf,
        telefone: values.telefone
      });

      toast.success("Colaborador criado com sucesso! Entre em contato com o time de desenvolvimento para liberar sua conta.")
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

  function formatCPF(cpf: string) {
    return cpf
      .replace(/\D/g, "")
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/\.(\d{3})(\d)/, ".$1.$2")
      .replace(/\.(\d{3})(\d)/, ".$1-$2")
      .replace(/(-\d{2})\d+$/, "$1");
  }

  function formatTelefone(telefone: string) {
    return telefone
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  }

  return (
    <Form {...form}>
      <div className="">
            <img src={logo} alt="RX Multimarcas" className="h-48 mb-4"/>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1 max-w-[450px] flex flex-col justify-center gap-6">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="nome"
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

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="rxmultimarcas@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Password Field */}
        <FormField
          control={form.control}
          name="senha"
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

        {/* CPF Field */}
        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input placeholder="XXX.XXX.XXX-XX" value={formatCPF(field.value)} onChange={(e) => field.onChange(e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Field */}
        <FormField
          control={form.control}
          name="telefone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="(XX) XXXXX-XXXX" value={formatTelefone(field.value)} onChange={(e) => field.onChange(e.target.value)} />
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