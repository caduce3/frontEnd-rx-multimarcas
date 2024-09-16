"use client"

import { Loader2 } from "lucide-react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis } from "recharts"
import {Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { relatorioMensalTransacoesPlayerBody } from "@/api/charts/player/grafico-relatorio-mensal-transacoes"
import { formatCurrency } from "@/services/formated-currency-brl"

export function ChartWithdrawlDepositMonthPlayer() {
  const { id, ano } = useParams<{ id: string; ano: string }>()

  const queryId = id || '';
  const queryAno = ano || new Date().getFullYear().toString();
  
  const { data, isLoading } = useQuery({
    queryKey: ["chart-withdrawl-deposit-month-player", queryId, queryAno],
    queryFn: async () => {
      return await relatorioMensalTransacoesPlayerBody({ id: queryId, ano: queryAno })
    },
    enabled: !! id,
  })

  const chartData = data?.result.map((entry) => ({
    month: entry.month,
    deposit: entry.deposit,
    withdrawals: entry.withdrawals,
    netDeposit: entry.netDeposit,
    depositTotal: entry.depositTotal,
    withdrawalsTotal: entry.withdrawalsTotal,
    depositTotalFormatted: entry.depositTotalFormatted,
    withdrawalsTotalFormatted: entry.withdrawalsTotalFormatted
  })) || []

  const totalWithdrawalsFormatted = data?.result[data.result.length - 1]?.withdrawalsTotalFormatted || '0'
  const depositTotalFormatted = data?.result[data.result.length - 1]?.depositTotalFormatted || '0'
  const depositTotal = data?.result[data.result.length - 1]?.depositTotal || 0;
  const withdrawalsTotal = data?.result[data.result.length - 1]?.withdrawalsTotal || 0;

  
  const netDepositFormatted = formatCurrency((depositTotal) - (withdrawalsTotal));
  
  

  const chartConfig = {
    deposit: {
      label: "Deposito",
      color: "#2EB88A",
    },
    withdrawals: {
      label: "Saque",
      color: "#E23670",
    },
    netDeposit: {
      label: "Net Deposit",
      color: "#E88C30",
    }
  } satisfies ChartConfig

  return (
    <Card className="rounded-xl">
      <CardHeader className="flex flex-row">
        <div>
          <CardTitle>Relatório Mensal de Transações</CardTitle>
          <CardDescription className="pt-2">Janeiro - Dezembro {queryAno}</CardDescription>
          <div className="flex gap-2 pt-2">
            <div className="flex items-center">
              <div className="w-4 h-4" style={{ backgroundColor: '#2EB88A', borderRadius: '50%' }}></div>
              <span className="ml-2">Depósito</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4" style={{ backgroundColor: '#E23670', borderRadius: '50%' }}></div>
              <span className="ml-2">Saque</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4" style={{ backgroundColor: '#E88C30', borderRadius: '50%' }}></div>
              <span className="ml-2">Net Deposit</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        { isLoading ? 
          <div className="flex h-[240px] w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
          </div> :
          <ResponsiveContainer height={200}>
            <ChartContainer config={chartConfig}>
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={true}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="deposit" fill="var(--color-deposit)" radius={4} />
                <Bar dataKey="withdrawals" fill="var(--color-withdrawals)" radius={4} />
                <Bar dataKey="netDeposit" fill="var(--color-netDeposit)" radius={4} />
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
        }
      </CardContent>
      <div className="flex justify-center items-center space-x-4">
        <div className="flex flex-col justify-center gap-1 px-6 py-4">
          <span className="text-xs text-muted-foreground">
            Total de depósitos no ano
          </span>
          <span className="text-lg font-bold leading-none sm:text-3xl">
            {depositTotalFormatted}
          </span>
        </div>
        <div className="flex flex-col justify-center gap-1 px-6 py-4">
          <span className="text-xs text-muted-foreground">
            Total de saques no ano
          </span>
          <span className="text-lg font-bold leading-none sm:text-3xl">
            {totalWithdrawalsFormatted}
          </span>
        </div>
        <div className="flex flex-col justify-center gap-1 px-6 py-4">
          <span className="text-xs text-muted-foreground">
            Net Deposit
          </span>
          <span className="text-lg font-bold leading-none sm:text-3xl">
            {netDepositFormatted}
          </span>
        </div>
      </div>
    </Card>
  )
}
