export const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";

    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 13 && cleaned.startsWith('55')) {
        const localNumber = cleaned.slice(2); 
        return `+55 (${localNumber.slice(0, 2)}) ${localNumber.slice(2, 3)} ${localNumber.slice(3, 7)}-${localNumber.slice(7)}`;
    } else if (cleaned.length === 11) {
        return `+55 (${cleaned.slice(0, 2)}) ${cleaned.slice(2, 3)} ${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
        return `+55 (${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    } else {
        return phone;
    }
};
