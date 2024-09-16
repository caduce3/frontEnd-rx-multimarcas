import { api } from "@/lib/axios";

export interface GetUniquePlayerBody {
    id: string;
}

export interface GetUniquePlayerResponse {
    player: {
        id: string;
        id_platform: number;
        name: string;
        cpf: string | null;
        tell: string;
        email: string;
        date_created: Date;
        date_birth: Date | null;
        platform_regitration_date: Date | null;
        Transactions_month: {
            id: string;
            id_player: string;
            cpf: string;
            date_transactions: Date | null;
            type_transactions: "DEPOSIT" | "WITHDRAWALS" | "SEM_TRANSACAO";
            valor_total_transactions: number;
            date_created: Date;
        }[];
        Wallet: {
            id: string;
            id_player: string;
            ftd_value: number;
            ftd_date: Date;
            qtd_deposits: number;
            total_deposit_amount: number;
            total_withdrawals: number;
            qtd_withdrawals: number;
        } | null;
    }
}

export async function getUniquePlayer({ id }: GetUniquePlayerBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.get<GetUniquePlayerResponse>(`/players/${id}`, {
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
