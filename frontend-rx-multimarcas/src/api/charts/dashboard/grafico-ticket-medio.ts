import { api } from "@/lib/axios";

export interface GraficoTicketMedioBody {
    ano: string;
}

export interface GraficoTicketMedioResponse {
    averageTicket: { [key: string]: { qtd_jogadores: number, totalAmount: number, average: number, twentyPercentAverage: number } };
}

export async function GraficoTicketMedioBody({ ano }: GraficoTicketMedioBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.post<GraficoTicketMedioResponse>("/grafico_ticket_medio", {
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
