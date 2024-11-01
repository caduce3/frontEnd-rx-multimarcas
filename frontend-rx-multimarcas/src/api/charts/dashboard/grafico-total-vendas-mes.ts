import { api } from "@/lib/axios";

export interface GraficoTotalVendasPorMesBody {
    date_init: string;
    date_finish: string;
}

export interface GraficoTotalVendasPorMesResponse {
    dados: { 
        result: {
            mes: string;
            valorTotal: number;
        }[]
    };
}

export async function GraficoTotalVendasPorMesBody({ date_init, date_finish }: GraficoTotalVendasPorMesBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.post<GraficoTotalVendasPorMesResponse>("/valor_total_vendas_por_mes", {
            date_init, date_finish
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
