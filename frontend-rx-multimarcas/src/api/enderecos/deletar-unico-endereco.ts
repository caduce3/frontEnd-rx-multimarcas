import { api } from "@/lib/axios";

export interface DeletarEnderecoBody {
    id_endereco: string;
}

export interface DeletarEnderecoResponse {
    boolean: boolean;
}

export async function deletarEnderecoCliente({ id_endereco }: DeletarEnderecoBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.post<DeletarEnderecoResponse>(`/deletar_endereco_cliente`, 
            { id_endereco },
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


