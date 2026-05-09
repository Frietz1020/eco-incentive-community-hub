import { useState } from "react";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import ImageProofInput from "./ImageProofInput";

const EVENTS = [
  { code: "CLEANUP-2026", name: "Barangay River Cleanup", actionType: "Waste Cleanup", points: "15" },
  { code: "TREE-2026", name: "Community Tree Planting", actionType: "Tree Planting", points: "25" },
  { code: "RECYCLE-2026", name: "Recycling Drive", actionType: "Recycling Drive", points: "10" },
];

export default function ParticipantCheckIn({ account, onSubmitRequest, onTxStatus }) {
  const [proofImage, setProofImage] = useState("");

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
      proofImage,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    onTxStatus({
      type: "confirmed",
      message: "Check-in submitted for admin verification.",
    });
    form.reset();
    setProofImage("");
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="grid h-9 w-9 place-items-center rounded-bio bg-primary-dim">
            <Send size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Check-In</p>
            <h2 className="text-lg font-semibold text-ink-strong">Submit Activity Proof</h2>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-muted">
          Select the event you attended and upload a proof photo. The admin reviews it before points are recorded on-chain.
        </p>
      </div>

      <div className="grid gap-4">
        <label className="grid gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">Participant Wallet</span>
          <input name="participant" defaultValue={account || ""} placeholder="0x..." className="eco-input font-mono" required />
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">Event Attended</span>
          <select name="eventCode" className="eco-select" defaultValue={EVENTS[0].code}>
            {EVENTS.map((eventItem) => (
              <option key={eventItem.code} value={eventItem.code}>
                {eventItem.name} ({eventItem.code})
              </option>
            ))}
          </select>
        </label>

        <ImageProofInput value={proofImage} onChange={setProofImage} label="Proof Photo" />

        <label className="grid gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">Proof Note</span>
          <textarea
            name="proofNote"
            rows="3"
            placeholder="Example: Joined cleanup team A, verified by event marshal."
            className="eco-input resize-none"
          />
        </label>
      </div>

      <button
        type="submit"
        className="eco-btn eco-btn-cyan w-full mt-5 cursor-pointer"
      >
        <Send size={16} />
        Submit for Verification
      </button>
    </motion.form>
  );
}
