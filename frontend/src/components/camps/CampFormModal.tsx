"use client";

import * as React from "react";
import { AlertCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { FormField, Input, Select, Textarea } from "@/components/ui/Input";
import {
  createAdminCamp,
  updateAdminCamp,
  toDatetimeLocal,
  fromDatetimeLocal,
  type AdminCampItem,
} from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  token: string;
  camp?: AdminCampItem | null; // if provided → edit mode
}

const STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "upcoming", label: "Upcoming" },
  { value: "registration_open", label: "Registration Open" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const initialValues = {
  title: "",
  description: "",
  venue: "",
  city: "Nagpur",
  state: "Maharashtra",
  start_at: "",
  end_at: "",
  capacity: "100",
  status: "draft",
  contact_phone: "",
};

export function CampFormModal({ open, onClose, onSaved, token, camp }: Props) {
  const isEdit = Boolean(camp);
  const [values, setValues] = React.useState(initialValues);
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Reset form when modal opens
  React.useEffect(() => {
    if (!open) return;
    if (camp) {
      setValues({
        title: camp.title,
        description: camp.description ?? "",
        venue: camp.venue,
        city: camp.city,
        state: camp.state,
        start_at: toDatetimeLocal(camp.start_at),
        end_at: toDatetimeLocal(camp.end_at),
        capacity: String(camp.capacity),
        status: camp.status,
        contact_phone: camp.contact_phone ?? "",
      });
    } else {
      setValues(initialValues);
    }
    setErrors({});
  }, [open, camp]);

  const update = (key: keyof typeof values, value: string) =>
    setValues((v) => ({ ...v, [key]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!values.title.trim()) e.title = "Title is required.";
    if (!values.venue.trim()) e.venue = "Venue is required.";
    if (!values.city.trim()) e.city = "City is required.";
    if (!values.state.trim()) e.state = "State is required.";
    if (!values.start_at) e.start_at = "Start time is required.";
    if (!values.end_at) e.end_at = "End time is required.";
    if (
      values.start_at &&
      values.end_at &&
      new Date(values.end_at) <= new Date(values.start_at)
    ) {
      e.end_at = "End must be after start.";
    }
    const cap = Number(values.capacity);
    if (!Number.isFinite(cap) || cap < 1) e.capacity = "Must be at least 1.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setErrors({});

    try {
      const payload = {
        title: values.title.trim(),
        description: values.description.trim() || undefined,
        venue: values.venue.trim(),
        city: values.city.trim(),
        state: values.state.trim(),
        start_at: fromDatetimeLocal(values.start_at),
        end_at: fromDatetimeLocal(values.end_at),
        capacity: Number(values.capacity),
        status: values.status,
        contact_phone: values.contact_phone.trim() || undefined,
      };

      const res = isEdit && camp
        ? await updateAdminCamp(token, camp.id, payload)
        : await createAdminCamp(token, payload);

      if (!res.success) {
        throw new Error(res.error.message);
      }
      onSaved();
      onClose();
    } catch (err) {
      setErrors({
        _form: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Camp" : "Create New Camp"}
      description={
        isEdit
          ? "Update the camp details below."
          : "Fill in the details to schedule a new blood donation camp."
      }
      className="!max-w-2xl"
      footer={
        <>
          <Button variant="secondary" size="md" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            loading={saving}
            onClick={handleSave}
            className="gap-2"
          >
            <Save className="h-4 w-4" aria-hidden />
            {isEdit ? "Save Changes" : "Create Camp"}
          </Button>
        </>
      }
    >
      {errors._form && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-primary-light bg-primary-light/40 p-3 text-xs text-primary">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {errors._form}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Camp Title"
          htmlFor="cf-title"
          required
          error={errors.title}
          className="sm:col-span-2"
        >
          <Input
            id="cf-title"
            value={values.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g. City Youth Blood Donation Camp"
            invalid={!!errors.title}
          />
        </FormField>

        <FormField
          label="Venue"
          htmlFor="cf-venue"
          required
          error={errors.venue}
          className="sm:col-span-2"
        >
          <Input
            id="cf-venue"
            value={values.venue}
            onChange={(e) => update("venue", e.target.value)}
            placeholder="e.g. Raman Science Centre"
            invalid={!!errors.venue}
          />
        </FormField>

        <FormField label="City" htmlFor="cf-city" required error={errors.city}>
          <Input
            id="cf-city"
            value={values.city}
            onChange={(e) => update("city", e.target.value)}
            invalid={!!errors.city}
          />
        </FormField>

        <FormField label="State" htmlFor="cf-state" required error={errors.state}>
          <Input
            id="cf-state"
            value={values.state}
            onChange={(e) => update("state", e.target.value)}
            invalid={!!errors.state}
          />
        </FormField>

        <FormField
          label="Start Date & Time"
          htmlFor="cf-start"
          required
          error={errors.start_at}
        >
          <Input
            id="cf-start"
            type="datetime-local"
            value={values.start_at}
            onChange={(e) => update("start_at", e.target.value)}
            invalid={!!errors.start_at}
          />
        </FormField>

        <FormField
          label="End Date & Time"
          htmlFor="cf-end"
          required
          error={errors.end_at}
        >
          <Input
            id="cf-end"
            type="datetime-local"
            value={values.end_at}
            onChange={(e) => update("end_at", e.target.value)}
            invalid={!!errors.end_at}
          />
        </FormField>

        <FormField
          label="Capacity"
          htmlFor="cf-capacity"
          required
          error={errors.capacity}
          help="Maximum donors expected"
        >
          <Input
            id="cf-capacity"
            type="number"
            min={1}
            value={values.capacity}
            onChange={(e) => update("capacity", e.target.value)}
            invalid={!!errors.capacity}
          />
        </FormField>

        <FormField label="Status" htmlFor="cf-status">
          <Select
            id="cf-status"
            value={values.status}
            onChange={(e) => update("status", e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label="Contact Phone"
          htmlFor="cf-phone"
          help="Optional — for donor queries"
          className="sm:col-span-2"
        >
          <Input
            id="cf-phone"
            type="tel"
            value={values.contact_phone}
            onChange={(e) => update("contact_phone", e.target.value)}
            placeholder="+91 98765 43210"
          />
        </FormField>

        <FormField
          label="Description"
          htmlFor="cf-desc"
          help="Optional — a short description of the camp"
          className="sm:col-span-2"
        >
          <Textarea
            id="cf-desc"
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="e.g. Join us in our mission to save lives..."
            rows={3}
          />
        </FormField>
      </div>
    </Modal>
  );
}