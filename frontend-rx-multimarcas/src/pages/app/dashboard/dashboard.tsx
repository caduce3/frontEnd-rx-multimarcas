import { Helmet } from "react-helmet-async";
import {  GraficoLtv } from "./grafico-ltv-jogadores";
import { useAuthRedirect } from "@/middlewares/authRedirect";
import { GraficoLtvDepositos } from "./grafico-ltv-depositos";
import { GraficoTicketMedio } from "./grafico-ticket-medio";


export function Dashboard(){

    const token = useAuthRedirect();

    if (!token) {
        return null;
    }

    return (
        <>
            <Helmet title="Dashboard"/>
            <div className="grid grid-cols-12 gap-4">
                {/* Título */}
                <div className="col-span-12">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                </div>

                <div className="col-span-12">
                    <GraficoLtv />
                </div>
                <div className="col-span-12">
                    <GraficoLtvDepositos />
                </div>
                <div className="col-span-12">
                    <GraficoTicketMedio />
                </div>
            </div>
        </>
    )
}