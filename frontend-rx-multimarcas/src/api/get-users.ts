import { api } from "@/lib/axios";

export interface GetUsersBody {
    page: number;
    name?: string;
    email?: string;
}

export interface GetUsersResponse {
    totalItens: number;
    totalPages: number;
    currentPage: number;
    usersList: {
        id: string;
        name: string;
        gender: string;
        email: string;
        password: string;
        status: "ACTIVE" | "INACTIVE";
        date_created: Date;
        sector: "RISCO" | "DESENVOLVIMENTO" | "TRAFEGO" | "FINANCEIRO" | "GERENCIAL" | "USER" | "AFILIADOS";
    }[]
}

export async function getUsers({ page, name, email }: GetUsersBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.post<GetUsersResponse>('/get_users', { page, name, email }, {
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
