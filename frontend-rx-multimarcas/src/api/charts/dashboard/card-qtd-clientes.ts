import { api } from "@/lib/axios";

export interface CardQtdClientesBody {
    date_init: string;
    date_finish: string;
}

export interface CardQtdClientesResponse {
    quantidadeTotalClientes: number;
}

export async function CardQtdClientesBody({ date_init, date_finish }: CardQtdClientesBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.post<CardQtdClientesResponse>("/qtd_clientes", {
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
