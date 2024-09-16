import { api } from "@/lib/axios";

export interface GraficoLtvDepositosBody {
    date_init: string;
    date_finish: string;
}

export interface GraficoLtvDepositosResponse {
    totalAmount: number;
    depositAmountPerMonth: { [key: string]: { amount: number, percentage: number } };
}

export async function GraficoLtvDepositosBody({ date_init, date_finish }: GraficoLtvDepositosBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.post<GraficoLtvDepositosResponse>("/grafico_ltv_deposits", {
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
