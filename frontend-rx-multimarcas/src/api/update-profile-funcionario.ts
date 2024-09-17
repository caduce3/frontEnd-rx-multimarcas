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

        const response = await api.put(`/atualizar_funcionario`, 
            { id, nome, email, telefone, cpf, status, cargo }, 
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (error: any) {
        // Se a API retorna uma resposta com um formato específico de erro
        if (error.response && error.response.data) {
            // Exiba a mensagem de erro da resposta da API
            throw new Error(error.response.data.message || 'Erro desconhecido ao atualizar usuário.');
        } else {
            // Caso o erro não seja uma resposta da API (por exemplo, problemas de rede)
            throw new Error('Erro ao conectar com o servidor ou erro desconhecido.');
        }
    }
}
