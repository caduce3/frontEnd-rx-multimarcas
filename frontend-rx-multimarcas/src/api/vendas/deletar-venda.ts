import { api } from "@/lib/axios";

export interface DeletarCarrinhoBody {
    id_carrinho: string;
}

export interface DeletarCarrinhoResponse {
    boolean: boolean;
}

export async function deletarVenda({ id_carrinho }: DeletarCarrinhoBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.post<DeletarCarrinhoResponse>(`/deletar_venda`, 
            { id_carrinho },
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


