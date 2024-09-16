import { api } from "@/lib/axios";

export interface GetUniqueUserBody {
    id: string;
}

export interface GetUniqueUserResponse {
    user: {
        id: string;
        name: string;
        gender: string;
        email: string;
        status: "ACTIVE" | "INACTIVE";
        date_created: Date;
        sector: "RISCO" | "DESENVOLVIMENTO" | "TRAFEGO" | "FINANCEIRO" | "GERENCIAL" | "USER" | "AFILIADOS";
    }
}

export async function getDetailsUser({ id }: GetUniqueUserBody) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.get<GetUniqueUserResponse>(`/users/${id}`, {
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


