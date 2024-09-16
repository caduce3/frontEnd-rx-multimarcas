import { api } from "@/lib/axios";

export interface RelatorioMensalTransacoesPlayerBody {
    id: string;
    ano?: string
}

export interface RelatorioMensalTransacoesPlayerResponse {
    result: {
        month: string;
        deposit: number;
        withdrawals: number;
        depositTotal: number;
        withdrawalsTotal: number;
        netDeposit: number;
        depositTotalFormatted: string;
        withdrawalsTotalFormatted: string;
    }[];
}

export async function relatorioMensalTransacoesPlayerBody({ id, ano }: RelatorioMensalTransacoesPlayerBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.post<RelatorioMensalTransacoesPlayerResponse>("/relatorio_mensal_transacoes_by_player", {
            id,
            ano
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
