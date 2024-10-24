import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel }: DeleteConfirmationModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent>
                <DialogHeader>
                    <h3 className="text-lg font-bold">Confirmar Exclusão</h3>
                    <p>Tem certeza de que deseja deletar? Esta ação não pode ser desfeita.</p>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="destructive" onClick={onConfirm}>
                        Confirmar
                    </Button>
                    <Button variant="outline" onClick={onCancel}>
                        Cancelar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
