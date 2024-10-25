import { api } from "@/lib/axios";

export interface DeletarProdutoBody {
    id_produto: string;
}

export interface DeletarProdutoResponse {
    boolean: boolean;
}

export async function deletarProduto({ id_produto }: DeletarProdutoBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.post<DeletarProdutoResponse>(`/deletar_produto`, 
            { id_produto },
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


