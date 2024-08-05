import { motion } from "framer-motion";

interface ResultCellProps {
  label: string;
  value: string;
  right?: boolean;
}

export const ResultCell: React.FC<ResultCellProps> = ({
  label,
  value,
  right,
}) => {
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: "0%" }}
      className={`flex flex-col justify-center w-48 items-center gap-y-1  px-5 ${
        right && "border-r-2 border-gray-400"
      } `}
    >
      <span className="text-xl text-blue-800 font-extrabold">${value}</span>
      <span className="text-sm"> {label}</span>
    </motion.div>
  );
};
