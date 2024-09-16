import { api } from "@/lib/axios";

export interface GraficoLtvBody {
    date_init: string;
    date_finish: string;
}

export interface GraficoLtvResponse {
    totalCount: number;
    depositCountsPerMonth: { [key: string]: { count: number, percentage: number } };
}

export async function GraficoLtvBody({ date_init, date_finish }: GraficoLtvBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.post<GraficoLtvResponse>("/grafico_ltv", {
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
