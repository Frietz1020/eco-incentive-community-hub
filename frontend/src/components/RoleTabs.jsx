import { motion } from "framer-motion";
import { ShieldCheck, User, Eye, Lock } from "lucide-react";

const ROLES = [
  {
    id: "admin",
    icon: ShieldCheck,
    title: "Admin Console",
    summary: "Verify eco-actions and issue GreenPoints on-chain.",
    accent: "green",
  },
  {
    id: "participant",
    icon: User,
    title: "Participant Portal",
    summary: "Submit attendance and track your impact.",
    accent: "cyan",
  },
  {
    id: "public",
    icon: Eye,
    title: "Public Ledger",
    summary: "Audit recent activity and community rankings.",
    accent: "violet",
  },
];

const accentMap = {
  green: {
    active: "border-accent/30 bg-accent-dim shadow-glow-green",
    iconBg: "bg-accent-dim",
    iconColor: "text-accent",
    bar: "bg-accent",
  },
  cyan: {
    active: "border-primary/30 bg-primary-dim shadow-glow",
    iconBg: "bg-primary-dim",
    iconColor: "text-primary",
    bar: "bg-primary",
  },
  violet: {
    active: "border-violet/30 bg-violet/5",
    iconBg: "bg-violet/8",
    iconColor: "text-violet",
    bar: "bg-violet",
  },
};

export default function RoleTabs({ activeRole, onRoleChange, isAdmin }) {
  return (
    <nav className="glass-card p-3" aria-label="Role workspace">
      <div className="grid gap-2">
        {ROLES.map((role) => {
          const isActive = activeRole === role.id;
          const adminLocked = role.id === "admin" && !isAdmin;
          const colors = accentMap[role.accent];
          const Icon = role.icon;

          return (
            <motion.button
              key={role.id}
              type="button"
              onClick={() => onRoleChange(role.id)}
              whileTap={{ scale: 0.98 }}
              className={`relative rounded-bio border p-4 text-left transition-all duration-200 cursor-pointer ${
                isActive
                  ? colors.active
                  : "border-transparent hover:border-line hover:bg-surface-field/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`grid h-9 w-9 place-items-center rounded-bio ${
                  isActive ? colors.iconBg : "bg-surface-field"
                }`}>
                  <Icon size={18} className={isActive ? colors.iconColor : "text-faint"} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-ink-strong">{role.title}</p>
                    {adminLocked && (
                      <Lock size={12} className="text-amber" />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted leading-relaxed">{role.summary}</p>
                </div>
              </div>

              {isActive && (
                <motion.div
                  layoutId="roleIndicator"
                  className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-full ${colors.bar}`}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
