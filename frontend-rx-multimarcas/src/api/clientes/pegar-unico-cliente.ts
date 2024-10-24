import { api } from "@/lib/axios";

export interface PegarUnicoClienteBody {
    id: string;
}

export interface PegarUnicoClienteResponse {
    cliente: {
        id: string;
        nome: string;
        email: string;
        telefone: string;
        cpf: string;
        dateCreated: Date;
        dateUpdated: Date;
        Enderecos: {
            id: string;
            rua: string;
            numero: string;
            bairro: string;
            cidade: string;
            estado: string;
            cep: string;
            date_created: Date;
            date_updated: Date;
            clientId: string;
        }[];
        Carrinho: {
            id: string;
            clientId: string;
            funcionarioId: string;
            valorTotal: number;
            total_deposit_amount: number;
            date_created: Date;
            date_updated: Date;
        }[];
    }
}

export async function pegarUnicoCliente({ id }: PegarUnicoClienteBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.get<PegarUnicoClienteResponse>(`/clientes/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || 'Erro de autenticação');
        } else {
            throw new Error('Erro ao conectar com o servidor');
        }
    }
}
