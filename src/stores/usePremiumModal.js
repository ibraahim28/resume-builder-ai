const { create } = require("zustand");

const usePremiumModal = create((set) => ({
  open: false,
  setOpen: (flag) => set({ open: flag }),
}));
export default usePremiumModal;
