import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, Loader, ExternalLink } from "lucide-react";
import { SNOWTRACE_BASE_URL } from "../lib/constants";

const VARIANTS = {
  pending: {
    icon: Loader,
    iconClass: "text-primary animate-spin",
    bgClass: "border-primary/20 bg-primary-dim",
    textClass: "text-primary-dark",
  },
  confirmed: {
    icon: CheckCircle,
    iconClass: "text-accent",
    bgClass: "border-accent/20 bg-accent-dim",
    textClass: "text-accent-dark",
  },
  error: {
    icon: AlertTriangle,
    iconClass: "text-danger",
    bgClass: "border-danger/20 bg-danger/5",
    textClass: "text-danger",
  },
};

export default function TxStatus({ status }) {
  if (!status?.message) return null;

  const variant = VARIANTS[status.type] || VARIANTS.pending;
  const Icon = variant.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status.message + status.type}
        initial={{ opacity: 0, y: -8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className={`glass-card border p-4 ${variant.bgClass}`}
      >
        <div className="flex items-start gap-3">
          <Icon size={18} className={`shrink-0 mt-0.5 ${variant.iconClass}`} />
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold ${variant.textClass}`}>{status.message}</p>
            {status.hash && (
              <a
                href={`${SNOWTRACE_BASE_URL}/tx/${status.hash}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 font-mono text-xs text-primary hover:text-primary-dark transition-colors cursor-pointer"
              >
                <ExternalLink size={11} />
                View on Snowtrace
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
