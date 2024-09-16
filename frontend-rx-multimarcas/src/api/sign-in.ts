import { api } from "@/lib/axios";

export interface SignInBody {
    email: string;
    password: string;
}

export async function signIn({ email, password }: SignInBody) {
    try {
        const response = await api.post('/sessions', { email, password });
        return response.data.token;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || 'Erro de autenticação');
        } else {
            throw new Error('Erro ao conectar com o servidor');
        }
    }
}
