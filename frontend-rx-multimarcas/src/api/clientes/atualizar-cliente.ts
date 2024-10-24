import { api } from "@/lib/axios";

export interface AtualizarClienteBody {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    cpf: string;
    dateCreated: Date;
    dateUpdated: Date;
}

export async function atualizarCliente({ id, nome, email, telefone, cpf, dateCreated, dateUpdated }: AtualizarClienteBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.put(`/atualizar_cliente`, 
            { id, nome, email, telefone, cpf, dateCreated, dateUpdated }, 
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
