import { api } from "@/lib/axios";

export interface GetPlayersBody {
    page: number;
    id_platform?: number;
    name?: string;
    tell?: string;
    email?: string;
    cpf?: string;
}

export interface GetPlayersResponse {
    totalItens: number;
    totalPages: number;
    currentPage: number;
    playersList: {
        id: string;
        id_platform: number;
        name: string;
        cpf: string | null;
        tell: string;
        email: string;
        date_created: Date;
        date_birth: Date | null;
        platform_regitration_date: Date | null;
    }[]
}

export async function getPlayers({ page, id_platform, name, email, cpf, tell }: GetPlayersBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.post<GetPlayersResponse>('/get_players', { page, id_platform, name, email, cpf, tell }, {
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
