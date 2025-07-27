import { Button } from "@/components/Button/page";
import Modal from "@/components/ui/Modal";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false
}: DeleteConfirmationModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Course">
      <div>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete this course?
        </p>
        <div className="flex justify-end gap-4">
          <Button
            className="text-white bg-gray-600 hover:bg-gray-700"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="text-white bg-red-600 hover:bg-red-700"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full mr-2"></div>
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};