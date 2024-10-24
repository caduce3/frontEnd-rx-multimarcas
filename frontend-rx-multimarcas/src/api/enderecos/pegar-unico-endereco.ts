import { api } from "@/lib/axios";

export interface PegarUnicoEnderecoBody {
    id: string;
}

export interface PegarUnicoEnderecoResponse {
    endereco: {
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
    }
}

export async function pegarUnicoEndereco({ id }: PegarUnicoEnderecoBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.get<PegarUnicoEnderecoResponse>(`/endereco/${id}`, {
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
