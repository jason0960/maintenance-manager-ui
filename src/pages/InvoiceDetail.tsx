import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { invoicesApi, paymentsApi } from '@/api/services';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { InvoiceStatusBadge } from '@/components/Badges';
import Spinner from '@/components/Spinner';
import type { InvoiceResponse, InvoiceStatus } from '@/types';
import { INVOICE_STATUSES, INVOICE_STATUS_LABELS } from '@/types';

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Update form state
  const [newStatus, setNewStatus] = useState<InvoiceStatus | ''>('');
  const [updating, setUpdating] = useState(false);
  const [paying, setPaying] = useState(false);

  // Handle payment result query params
  useEffect(() => {
    const paymentResult = searchParams.get('payment');
    if (paymentResult === 'success') {
      addToast('Payment successful! Invoice will be marked as paid shortly.', 'success');
      setSearchParams({}, { replace: true });
    } else if (paymentResult === 'cancelled') {
      addToast('Payment was cancelled.', 'info');
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!id) return;
    invoicesApi
      .get(Number(id))
      .then((data) => {
        setInvoice(data);
        setNewStatus(data.status);
      })
      .catch(() => {
        addToast('Failed to load invoice', 'error');
        navigate('/invoices');
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpdateStatus = async () => {
    if (!invoice || !newStatus || newStatus === invoice.status) {
      addToast('No changes to save', 'info');
      return;
    }
    setUpdating(true);
    try {
      const updated = await invoicesApi.update(invoice.id, { status: newStatus });
      setInvoice(updated);
      setNewStatus(updated.status);
      addToast('Invoice updated!', 'success');
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!invoice) return null;

  const canEdit = user?.role === 'ADMIN' || user?.role === 'PROPERTY_MANAGER';
  const canPay = canEdit && (invoice.status === 'SENT' || invoice.status === 'OVERDUE');

  const handlePayNow = async () => {
    if (!invoice) return;
    setPaying(true);
    try {
      const { checkoutUrl } = await paymentsApi.createCheckout(invoice.id);
      window.location.href = checkoutUrl;
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to start payment', 'error');
      setPaying(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Back link */}
      <button
        onClick={() => navigate('/invoices')}
        className="mb-4 text-sm font-medium text-brand-600 hover:text-brand-700"
      >
        ← Back to Invoices
      </button>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Invoice {invoice.invoiceNumber}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Created {new Date(invoice.createdAt).toLocaleDateString()}
              </p>
            </div>
            <InvoiceStatusBadge status={invoice.status} />
          </div>
        </div>

        {/* Pay Now banner */}
        {canPay && (
          <div className="border-b border-green-200 bg-green-50 px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-green-800">
                  Amount Due: {formatCurrency(invoice.total)}
                </p>
                <p className="text-xs text-green-600">
                  Due {new Date(invoice.dueDate).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={handlePayNow}
                disabled={paying}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:opacity-50"
              >
                {paying ? <Spinner size="sm" /> : '💳 Pay Now'}
              </button>
            </div>
          </div>
        )}

        {/* Details grid */}
        <div className="grid gap-6 px-6 py-5 sm:grid-cols-2">
          <DetailItem label="Work Order" value={invoice.workOrderTitle} />
          <DetailItem label="Property" value={`${invoice.propertyName} · ${invoice.unitNumber}`} />
          <DetailItem label="Company" value={invoice.companyName} />
          <DetailItem label="Created By" value={invoice.createdByName} />
          <DetailItem label="Due Date" value={new Date(invoice.dueDate).toLocaleDateString()} />
          <DetailItem
            label="Paid At"
            value={invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString() : '—'}
          />
        </div>

        {/* Line items table */}
        <div className="border-t border-gray-100 px-6 py-5">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Line Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-3 py-2 font-medium text-gray-600">Description</th>
                  <th className="px-3 py-2 font-medium text-gray-600 text-right">Qty</th>
                  <th className="px-3 py-2 font-medium text-gray-600 text-right">Unit Price</th>
                  <th className="px-3 py-2 font-medium text-gray-600 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoice.lineItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-3 py-2 text-gray-900">{item.description}</td>
                    <td className="px-3 py-2 text-right text-gray-600">{item.quantity}</td>
                    <td className="px-3 py-2 text-right text-gray-600">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-3 py-2 text-right font-medium text-gray-900">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-4 flex flex-col items-end space-y-1 border-t border-gray-100 pt-4">
            <div className="flex w-48 justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-900">{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex w-48 justify-between text-sm">
              <span className="text-gray-500">Tax ({invoice.taxRate}%)</span>
              <span className="text-gray-900">{formatCurrency(invoice.taxAmount)}</span>
            </div>
            <div className="flex w-48 justify-between border-t border-gray-200 pt-1 text-base font-bold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="border-t border-gray-100 px-6 py-5">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Notes</h3>
            <p className="whitespace-pre-wrap text-sm text-gray-600">{invoice.notes}</p>
          </div>
        )}

        {/* Update panel — only ADMIN and PROPERTY_MANAGER */}
        {canEdit && (
          <div className="border-t border-gray-100 bg-gray-50 px-6 py-5">
            <h3 className="mb-4 text-sm font-semibold text-gray-700">Update Invoice</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as InvoiceStatus)}
                  className="input-field"
                >
                  {INVOICE_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {INVOICE_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleUpdateStatus}
                disabled={updating}
                className="btn-primary py-2"
              >
                {updating ? <Spinner size="sm" /> : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase text-gray-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}
