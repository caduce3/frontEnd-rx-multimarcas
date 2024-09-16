import { Helmet } from "react-helmet-async";
import { useAuthRedirect } from "@/middlewares/authRedirect";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUniquePlayer } from "@/api/get-unique-player";
import { toast } from "sonner";
import { CardTotalGeral } from "@/components/card-total";
import { DollarSign, TrendingDown, TrendingUp, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPhoneNumber } from "@/services/formated-tell";
import { capitalizeName } from "@/services/formated-captalize-name";
import { formatCPF } from "@/services/formated-cpf";
import { InfoRowPlayer } from "./info-row-player";
import { formatDateToPTBR } from "@/services/formated-date-pt-br";
import { ChartWithdrawlDepositMonthPlayer } from "./grafico-relatorio-mensal-transacoes";

export function PlayersDetails() {
    const token = useAuthRedirect();

    if (!token) {
        return null;
    }

    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data, isLoading } = useQuery({
        queryKey: ['player', id],
        queryFn: async () => {
            if (!id) {
                navigate(`/players`);
                toast.error(`Jogador não encontrado`);
                return Promise.reject("ID do jogador não encontrado");
            }
            return getUniquePlayer({ id });
        },
        enabled: !!id // Executa a consulta somente se id estiver definido
    });
    
    return (
        <>
            <Helmet title="Players Details"/>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-screen"> {/* Set height to full screen */}
                <div className="md:col-span-8 bg-[#18181B] rounded-xl flex flex-col"> {/* Added flex and full height */}
                    <Card className="flex-1 rounded-xl"> {/* Added flex-1 to make it take available space */}
                        <CardHeader>
                            <CardTitle>Informações gerais do jogador</CardTitle>
                            <CardDescription>Informações pessoais</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoRowPlayer
                                        label="Nome"
                                        value={data?.player.name ?? "Não informado"}
                                        isLoading={isLoading}
                                        formatFunction={(name) => capitalizeName(name)}
                                    />
                                    <InfoRowPlayer
                                        label="CPF"
                                        value={data?.player.cpf ?? "Não informado"}
                                        isLoading={isLoading}
                                        formatFunction={(cpf) => formatCPF(cpf)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoRowPlayer
                                        label="Telefone"
                                        value={data?.player.tell ?? "Não informado"}
                                        isLoading={isLoading}
                                        formatFunction={(tell) => formatPhoneNumber(tell)}
                                    />
                                    <InfoRowPlayer
                                        label="Email"
                                        value={data?.player.email ?? "Não informado"}
                                        isLoading={isLoading}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoRowPlayer
                                        label="ID"
                                        value={data?.player.id_platform ?? "Não informado"}
                                        isLoading={isLoading}
                                    />
                                    <InfoRowPlayer
                                        label="Data de registro"
                                        value={data?.player.platform_regitration_date ?? "Não informado"}
                                        isLoading={isLoading}
                                        formatFunction={formatDateToPTBR}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoRowPlayer
                                        label="FTD value"
                                        value={data?.player.Wallet?.ftd_value ?? "Não informado"}
                                        isLoading={isLoading}
                                    />
                                    <InfoRowPlayer
                                        label="FTD date"
                                        value={data?.player.Wallet?.ftd_date ?? "Não informado"}
                                        isLoading={isLoading}
                                        formatFunction={formatDateToPTBR}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoRowPlayer
                                        label="Data de nascimento"
                                        value={data?.player.date_birth ?? "Não informado"}
                                        isLoading={isLoading}
                                        formatFunction={formatDateToPTBR}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-4 flex flex-col"> {/* Added flex and full height */}
                    <div className="grid grid-cols-1 gap-4 flex-1"> {/* Added flex-1 to make it take available space */}
                        <CardTotalGeral 
                            Icon={DollarSign} 
                            cardTitle="Valor total de depósitos" 
                            totalValue={Number(data?.player.Wallet?.total_deposit_amount) ?? 0} 
                            format={true}
                            isLoading={isLoading}
                        />
                        <CardTotalGeral 
                            Icon={TrendingUp} 
                            cardTitle="Quantidade total de depósitos" 
                            totalValue={Number(data?.player.Wallet?.qtd_deposits) ?? 0} 
                            isLoading={isLoading}
                        />
                        <CardTotalGeral 
                            Icon={X} 
                            cardTitle="Valor total de saques" 
                            totalValue={Number(data?.player.Wallet?.total_withdrawals) ?? 0} 
                            format={true}
                            isLoading={isLoading}
                        />
                        <CardTotalGeral 
                            Icon={TrendingDown} 
                            cardTitle="Quantidade total de saques" 
                            totalValue={Number(data?.player.Wallet?.qtd_withdrawals) ?? 0}
                            isLoading={isLoading} 
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                    <ChartWithdrawlDepositMonthPlayer />
                </div>
            </div>
        </>
    );
}
