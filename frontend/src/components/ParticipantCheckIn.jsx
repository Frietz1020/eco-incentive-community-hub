import { ethers } from "ethers";

const EVENTS = [
  {
    code: "CLEANUP-2026",
    name: "Barangay River Cleanup",
    actionType: "Waste Cleanup",
    points: "15",
  },
  {
    code: "TREE-2026",
    name: "Community Tree Planting",
    actionType: "Tree Planting",
    points: "25",
  },
  {
    code: "RECYCLE-2026",
    name: "Recycling Drive",
    actionType: "Recycling Drive",
    points: "10",
  },
];

export default function ParticipantCheckIn({ account, onSubmitRequest, onTxStatus }) {
  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const participant = String(formData.get("participant") || "").trim();
    const eventCode = String(formData.get("eventCode") || "");
    const proofNote = String(formData.get("proofNote") || "").trim();
    const selectedEvent = EVENTS.find((item) => item.code === eventCode);

    if (!ethers.isAddress(participant)) {
      onTxStatus({ type: "error", message: "Enter a valid participant wallet address." });
      return;
    }

    if (!selectedEvent) {
      onTxStatus({ type: "error", message: "Choose a valid community event." });
      return;
    }

    onSubmitRequest({
      id: `${Date.now()}-${participant.slice(2, 8)}`,
      participant,
      eventCode: selectedEvent.code,
      eventName: selectedEvent.name,
      actionType: selectedEvent.actionType,
      points: selectedEvent.points,
      proofNote,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    onTxStatus({
      type: "confirmed",
      message: "Check-in submitted for admin verification.",
    });
    form.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-sm font-semibold text-canopy">Check-in</p>
        <h2 className="text-xl font-semibold text-ink">Submit activity proof</h2>
        <p className="mt-2 text-sm leading-6 text-moss">
          Use this after joining a cleanup, tree planting, or community service event.
          The admin reviews it before points are recorded on-chain.
        </p>
      </div>

      <div className="grid gap-4">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Participant wallet
          <input
            name="participant"
            defaultValue={account || ""}
            placeholder="0x..."
            className="rounded-md border border-line px-3 py-2 font-mono text-sm outline-none focus:border-canopy"
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Event attended
          <select
            name="eventCode"
            className="rounded-md border border-line px-3 py-2 outline-none focus:border-canopy"
            defaultValue={EVENTS[0].code}
          >
            {EVENTS.map((eventItem) => (
              <option key={eventItem.code} value={eventItem.code}>
                {eventItem.name} ({eventItem.code})
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Proof note
          <textarea
            name="proofNote"
            rows="3"
            placeholder="Example: Joined cleanup team A, verified by event marshal."
            className="resize-none rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-canopy"
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-5 w-full rounded-md bg-canopy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-canopy/90"
      >
        Submit for Verification
      </button>
    </form>
  );
}
