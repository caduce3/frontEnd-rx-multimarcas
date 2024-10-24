import { api } from "@/lib/axios";

export interface AtualizarEnderecoBody {
    id_endereco: string;
    endereco: {
        id: string;
        rua: string;
        numero: string;
        bairro: string;
        cidade: string;
        estado: string;
        cep: string;
    }
}

export async function atualizarEndereco({ id_endereco, endereco }: AtualizarEnderecoBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.put(`/atualizar_endereco_cliente`, 
            { id_endereco, endereco }, 
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
            throw new Error(error.response.data.message || 'Erro desconhecido ao atualizar cliente.');
        } else {
            // Caso o erro não seja uma resposta da API (por exemplo, problemas de rede)
            throw new Error('Erro ao conectar com o servidor ou erro desconhecido.');
        }
    }
}
