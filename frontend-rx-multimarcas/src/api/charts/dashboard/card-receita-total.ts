import { api } from "@/lib/axios";

export interface CardReceitaTotalBody {
    date_init: string;
    date_finish: string;
}

export interface CardReceitaTotalResponse {
    qtd: {
        receitaTotal: number;
    }
}

export async function CardReceitaTotalBody({ date_init, date_finish }: CardReceitaTotalBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.post<CardReceitaTotalResponse>("/pegar_receita", {
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
