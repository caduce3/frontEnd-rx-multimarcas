import { api } from "@/lib/axios";

interface User {
    id: string;
    name: string;
    gender: string;
    email: string;
    password: string;
    status: 'ACTIVE' | 'INACTIVE';
    date_created: Date;
    sector: 'USER' | 'DESENVOLVIMENTO' | 'TRAFEGO' | 'FINANCEIRO' | 'AFILIADOS' | 'GERENCIAL' | 'RISCO';
}

export interface GetProfileUserResponse {
    user: User;
}

export async function getProfileUser() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await api.get<GetProfileUserResponse>('/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data.user; // Retorna apenas o objeto `user`
    } catch (error) {
        throw new Error('Failed to fetch user profile');
    }
}
