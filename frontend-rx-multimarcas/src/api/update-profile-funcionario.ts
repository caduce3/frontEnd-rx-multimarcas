import { api } from "@/lib/axios";

export interface UpdateFuncionarioProfileBody {
    id: string;
    nome?: string;
    email?: string;
    status?: "ATIVO" | "INATIVO";
    cargo?: "PROPRIETARIO" | "ADMINISTRADOR" | "COLABORADOR";
    cpf?: string;
    telefone?: string;
}

export async function updateFuncionarioProfile({ id, nome, email, telefone, cpf, status, cargo }: UpdateFuncionarioProfileBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.put(`/atualizar_funcionario`, { id, nome, email, telefone, cpf, status, cargo }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error: any) {
        console.error('Error updating user:', error);
        if (error.response) {
            throw new Error(error.response.data?.message || 'Erro ao atualizar usuário.');
        } else {
            throw new Error('Erro ao conectar com o servidor');
        }
    }
}