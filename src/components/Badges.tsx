import type { Priority, WorkOrderStatus, InvoiceStatus } from '@/types';
import {
  PRIORITY_COLORS,
  PRIORITY_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
  INVOICE_STATUS_COLORS,
  INVOICE_STATUS_LABELS,
} from '@/types';

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${PRIORITY_COLORS[priority]}`}
    >
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

export function StatusBadge({ status }: { status: WorkOrderStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${INVOICE_STATUS_COLORS[status]}`}
    >
      {INVOICE_STATUS_LABELS[status]}
    </span>
  );
}
