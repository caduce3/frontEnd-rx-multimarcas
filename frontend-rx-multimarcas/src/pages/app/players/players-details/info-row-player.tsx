import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode } from "react";

interface InfoRowProps {
  label: string;
  value: string | number | Date | null;
  isLoading: boolean;
  formatFunction?: (value: any) => string;
}

export function InfoRowPlayer({ label, value, isLoading, formatFunction }: InfoRowProps) {
  let displayValue: ReactNode;

  if (isLoading) {
    displayValue = <Skeleton className="h-4 w-40" />;
  } else {
    if (value === null) {
      displayValue = "Não informado";
    } else if (formatFunction) {
      displayValue = formatFunction(value);
    } else {
      displayValue = value instanceof Date ? value.toLocaleDateString('pt-BR') : value;
    }
  }

  return (
    <div className="py-3">
      <Label className="text-lg text-muted-foreground">{label}</Label>
      <p className="text-base font-semibold">
        {displayValue}
      </p>
    </div>
  );
}
