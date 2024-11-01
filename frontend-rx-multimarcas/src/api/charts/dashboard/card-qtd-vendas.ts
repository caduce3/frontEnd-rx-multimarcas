import { api } from "@/lib/axios";

export interface CardQtdVendasBody {
    date_init: string;
    date_finish: string;
}

export interface CardQtdVendasResponse {
    qtd: {
        quantidadeTotalCarrinho: number;
    }
}

export async function CardQtdVendasBody({ date_init, date_finish }: CardQtdVendasBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.post<CardQtdVendasResponse>("/qtd_vendas", {
            date_init,
            date_finish
        }, {
            headers: {
                Authorization: `Bearer ${token}`
        }})
        
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || 'Erro de autenticação');
        } else {
            throw new Error('Erro ao conectar com o servidor');
        }
    }
}
