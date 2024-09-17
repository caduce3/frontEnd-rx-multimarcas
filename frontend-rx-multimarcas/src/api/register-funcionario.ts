import { api } from "@/lib/axios";

export interface RegisterFuncionarioBody {
    nome: string;
    email: string;
    senha: string;
    cpf: string;
    telefone: string;
}

export async function registerFuncionario({ nome, email, senha, cpf, telefone }: RegisterFuncionarioBody) {
    try {
        const response = await api.post('/funcionario', { nome, email, senha, cpf, telefone });
        return response.data;
    } catch (error: any) {
        // console.error('Error registering user:', error);
        if (error.response) {
            throw new Error(error.response.data?.message || 'Erro ao cadastrar colaborador.');
        } else {
            throw new Error('Erro ao conectar com o servidor');
        }
    }
}
