import { Helmet } from "react-helmet-async";
import { useAuthRedirect } from "@/middlewares/authRedirect";
import CardReceitaTotal from "./card-receita-total";
import CardQtdVendas from "./card-qtd-vendas";
import CardQtdClientes from "./card-qtd-clientes";
import React from "react";
import { DatePickerWithRange } from "@/components/date-ranger-picker";


export function Dashboard(){

    const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date }>({
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date(new Date().getFullYear(), 11, 31),
    });

    const token = useAuthRedirect();

    if (!token) {
        return null;
    }

    return (
        <div>
            <Helmet title="Dashboard"/>
            <div className="grid grid-cols-12 p-5">
                
                <div className="col-span-12 mb-4 items-end">
                    <DatePickerWithRange
                        className="col-span-4 mb-4 flex justify-end items-center"
                        value={{ from: dateRange.from, to: dateRange.to }}
                        onChange={(range) => {
                            if (range?.from && range?.to) {
                                setDateRange({ from: range.from, to: range.to });
                            }
                        }}
                    />
                </div>
                <div className="col-span-12 flex">
                    <CardReceitaTotal dateRange={dateRange}/>
                    <CardQtdVendas dateRange={dateRange}/>
                    <CardQtdClientes dateRange={dateRange}/>
                </div>
            
            </div>
        </div>
    )
}