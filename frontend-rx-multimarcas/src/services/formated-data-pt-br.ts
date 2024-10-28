export function formatDateTimeToPTBR(dateString: string) {
    // Verifica se a string não está vazia ou nula
    if (!dateString) return 'Data inválida';

    // Converte a string para um objeto Date
    const date = new Date(dateString.replace(' ', 'T')); // Adiciona 'T' para compatibilidade com o construtor Date

    // Verifica se a data é válida
    if (isNaN(date.getTime())) return 'Data inválida';

    // Formata a data para o padrão PT-BR
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // Formato de 24 horas
    };

    return date.toLocaleString('pt-BR', options);
}
