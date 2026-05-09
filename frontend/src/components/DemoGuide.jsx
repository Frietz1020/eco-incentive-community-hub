import { motion } from "framer-motion";
import { BookOpen, ExternalLink } from "lucide-react";
import { CONTRACT_ADDRESS } from "../lib/contract";
import { SNOWTRACE_BASE_URL } from "../lib/constants";

const STEPS = [
  { num: "01", text: "Connect MetaMask or Core wallet" },
  { num: "02", text: "Switch to Avalanche Fuji C-Chain" },
  { num: "03", text: "Submit a check-in with proof photo" },
  { num: "04", text: "Admin verifies and awards GreenPoints" },
  { num: "05", text: "View transaction on Snowtrace" },
];

export default function DemoGuide() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="grid h-9 w-9 place-items-center rounded-bio bg-violet/8">
          <BookOpen size={18} className="text-violet" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-violet">Guide</p>
          <h2 className="text-lg font-semibold text-ink-strong">Demo Checklist</h2>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((step, index) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="rounded-bio bg-surface-field border border-line p-3 hover:border-violet/20 transition-colors cursor-pointer"
          >
            <p className="text-xs font-bold text-violet">{step.num}</p>
            <p className="mt-1.5 text-sm text-ink leading-relaxed">{step.text}</p>
          </motion.div>
        ))}
      </div>

      {CONTRACT_ADDRESS && (
        <div className="mt-4 flex items-center gap-4 pt-4 border-t border-line">
          <a
            href={`${SNOWTRACE_BASE_URL}/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark transition-colors cursor-pointer"
          >
            <ExternalLink size={12} />
            View Contract on Snowtrace
          </a>
        </div>
      )}
    </motion.div>
  );
}
