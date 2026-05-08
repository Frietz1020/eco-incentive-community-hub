const ROLES = [
  {
    id: "admin",
    eyebrow: "Admin",
    title: "Verify Actions",
    summary: "Record approved eco-actions and manage contract ownership.",
  },
  {
    id: "participant",
    eyebrow: "Participant",
    title: "View Impact",
    summary: "Check GreenPoints, action count, and contribution status.",
  },
  {
    id: "public",
    eyebrow: "Public",
    title: "Audit Ledger",
    summary: "Review recent on-chain actions and community rankings.",
  },
];

export default function RoleTabs({ activeRole, onRoleChange, isAdmin }) {
  return (
    <nav className="rounded-lg border border-line bg-white p-2 shadow-sm" aria-label="Role workspace">
      <div className="grid gap-2">
        {ROLES.map((role) => {
          const isActive = activeRole === role.id;
          const adminLocked = role.id === "admin" && !isAdmin;

          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onRoleChange(role.id)}
              className={`rounded-md border p-4 text-left transition ${
                isActive
                  ? "border-canopy bg-canopy/10 shadow-sm"
                  : "border-transparent bg-field hover:border-line hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase text-canopy">{role.eyebrow}</p>
                {adminLocked && (
                  <span className="rounded-full bg-sun/15 px-2 py-1 text-xs font-semibold text-amber-800">
                    Locked
                  </span>
                )}
              </div>
              <p className="mt-1 text-lg font-semibold text-ink">{role.title}</p>
              <p className="mt-1 text-sm leading-5 text-ink/65">{role.summary}</p>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
