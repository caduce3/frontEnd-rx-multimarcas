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
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { signIn } from "@/api/sign-in"
import logo from "../../assets/logoRXmulti.png";

// Define the form schema with email and password fields
const formSchema = z.object({
  email: z.string().email({ message: "Endereço de e-mail inválido." }),
  senha: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
})

export function SignIn() {

  const [ searchParams ] = useSearchParams()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
      senha: "",
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate();

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn
  })

  async function onSubmit(values: { email: string; senha: string }) {
    setIsSubmitting(true)
    try {
      
      const token = await authenticate({ email: values.email, senha: values.senha });
      // Armazenar o token no localStorage ou sessionStorage
      localStorage.setItem('authToken', token);

      toast.success("Sucesso! Você está logado.");
      navigate("/");
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
      <div className="max-w-[400px] flex flex-col justify-center gap-2">
        <div className="">
            <img src={logo} alt="RX Multimarcas" className="h-48 mb-4"/>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1 flex flex-col gap-6">
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
        
          {/* senha Field */}
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
        
          <Link to="/sign-up" className="text-right text-sm text-muted-foreground underline">Ainda não tem uma conta? Clique aqui!</Link>
        
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
      <Helmet title="Login"/>
    </Form>
  )
}
