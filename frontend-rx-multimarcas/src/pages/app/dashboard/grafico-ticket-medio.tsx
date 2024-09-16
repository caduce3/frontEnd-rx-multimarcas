import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { GraficoTicketMedioBody } from "@/api/charts/dashboard/grafico-ticket-medio";

export const description = "An interactive line chart";

export function GraficoTicketMedio() {
  // Ano fixo para a consulta
  const ano = "2024";

  // Mapeamento dos meses
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ] as const;

  // Consulta de dados usando react-query
  const { data, isLoading } = useQuery({
    queryKey: ["grafico_ticket_medio", ano],
    queryFn: async () => {
      return await GraficoTicketMedioBody({ ano });
    },
    enabled: !!ano
  });

  // Preparação dos dados para o gráfico
  const chartData = months.map(month => {
    const monthKey = month.toLowerCase(); 
    const stats = data?.averageTicket[monthKey] || { qtd_jogadores: 0, totalAmount: 0, average: 0, twentyPercentAverage: 0 };
    return {
      month,
      average: parseFloat(stats.average.toFixed(2)),  // Garante que o valor do "average" seja tratado corretamente
      twentyPercentAverage: parseFloat(stats.twentyPercentAverage.toFixed(2))
    };
  });

  // Configuração do gráfico
  const chartConfig: ChartConfig = {
    average: {
      label: "Ticket Médio",
      color: "#EEDD00", 
    },
    twentyPercentAverage: {
      label: "20% do Ticket Médio",
      color: "#2563EB", 
    }
  };

  return (
    <Card className="rounded-xl">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Gráfico de Ticket Médio</CardTitle>
        </div>
      </CardHeader>
      {isLoading ? (
        <div className="flex h-[240px] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[300px] w-full"
          >
            <LineChart
              data={chartData}
              margin={{
                left: 25,
                right: 25,
                top: 20
              }}
            >
              <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => value}
                />

                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px]"
                      nameKey={""} // Padrão para exibir o valor de "average"
                    />
                  }
                />

                {/* Linha para o Ticket Médio */}
                <Line
                  dataKey="average"
                  type="monotone"
                  stroke={chartConfig["average"].color}
                  strokeWidth={2}
                  dot={false}
                >
                  <LabelList dataKey="average" position="top" />
                </Line>

                {/* Linha para 20% da Média */}
                <Line
                  dataKey="twentyPercentAverage"
                  type="monotone"
                  stroke={chartConfig["twentyPercentAverage"].color}
                  strokeWidth={2}
                  dot={false}
                >
                <LabelList dataKey="twentyPercentAverage" position="top" />
              </Line>
            </LineChart>
          </ChartContainer>
        </CardContent>
      )}
    </Card>
  );
}
