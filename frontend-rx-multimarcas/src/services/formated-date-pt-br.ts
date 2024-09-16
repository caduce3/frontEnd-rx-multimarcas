export const formatDateToPTBR = (date: string | Date): string => {
  // Data padrão que representa uma data inválida ou não informada
  const invalidDate = new Date("1000-01-01T21:25:59.000Z");

  // Converter a data para um objeto Date, se necessário
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Verificar se a data é "1000-01-01T21:25:59.000Z" ou se é inválida
  if (dateObj.getTime() === invalidDate.getTime() || isNaN(dateObj.getTime())) {
    return "Não informado";
  }

  // Formatar a data para o formato pt-BR
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };
  return new Intl.DateTimeFormat('pt-BR', options).format(dateObj);
};
