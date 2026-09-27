"use client";

import { Modal } from "@/components/ui/Modal";
import { OTPAuthForm } from "@/components/auth/OTPAuthForm";
import { useUiStore } from "@/store/uiStore";

export function OTPAuthModal() {
  const open = useUiStore((s) => s.authModalOpen);
  const close = useUiStore((s) => s.closeAuthModal);

  return (
    <Modal open={open} onClose={close} className="max-w-lg">
      <OTPAuthForm onSuccess={close} />
    </Modal>
  );
}
