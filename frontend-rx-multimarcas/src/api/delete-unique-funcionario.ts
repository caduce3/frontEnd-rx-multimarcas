import { api } from "@/lib/axios";

export interface DeletarUniqueFuncionarioBody {
    id: string;
}

export interface DeletarUniqueFuncionarioResponse {
    boolean: boolean;
}

export async function deletarFuncionario({ id }: DeletarUniqueFuncionarioBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.post<DeletarUniqueFuncionarioResponse>(`/deletar_funcionario`, 
            { id },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || 'Erro de autenticação');
        } else {
            throw new Error('Erro ao conectar com o servidor');
        }
    }
}


