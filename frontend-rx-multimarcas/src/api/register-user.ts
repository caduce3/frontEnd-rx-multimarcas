import { api } from "@/lib/axios";

export interface RegisterUserBody {
    name: string;
    email: string;
    password: string;
    gender: string;
}

export async function registerUser({ email, password, name, gender }: RegisterUserBody) {
    try {
        const response = await api.post('/users', { email, password, gender, name });
        return response.data;
    } catch (error: any) {
        console.error('Error registering user:', error);
        if (error.response) {
            throw new Error(error.response.data?.message || 'Erro ao cadastrar usuário.');
        } else {
            throw new Error('Erro ao conectar com o servidor');
        }
    }
}
