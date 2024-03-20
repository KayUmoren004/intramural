export type GeneralModal = {
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  onChange: (val: any) => void;
  title: string;
  [k: string]: any;
};
