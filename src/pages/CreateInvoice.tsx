import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { workOrdersApi, invoicesApi } from '@/api/services';
import { useToast } from '@/contexts/ToastContext';
import Spinner from '@/components/Spinner';
import type { WorkOrderResponse, InvoiceLineItemRequest } from '@/types';

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

const emptyLine = (): InvoiceLineItemRequest => ({
  description: '',
  quantity: 1,
  unitPrice: 0,
});

export default function CreateInvoicePage() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedWoId = searchParams.get('workOrderId');

  const [workOrders, setWorkOrders] = useState<WorkOrderResponse[]>([]);
  const [loadingWOs, setLoadingWOs] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [workOrderId, setWorkOrderId] = useState<number | ''>('');
  const [lineItems, setLineItems] = useState<InvoiceLineItemRequest[]>([emptyLine()]);
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    workOrdersApi
      .list()
      .then((data) => {
        // Only show completed work orders for invoicing
        const completed = data.filter((wo) => wo.status === 'COMPLETED');
        setWorkOrders(completed);
        if (preselectedWoId) {
          const id = Number(preselectedWoId);
          if (completed.some((wo) => wo.id === id)) {
            setWorkOrderId(id);
          }
        }
      })
      .catch(() => addToast('Failed to load work orders', 'error'))
      .finally(() => setLoadingWOs(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set default due date to 30 days from now
  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    setDueDate(d.toISOString().split('T')[0]);
  }, []);

  const addLineItem = () => {
    setLineItems((prev) => [...prev, emptyLine()]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length <= 1) return;
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: keyof InvoiceLineItemRequest, value: string | number) => {
    setLineItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const taxAmount = Math.round(subtotal * (taxRate / 100));
  const total = subtotal + taxAmount;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!workOrderId) {
      addToast('Please select a work order', 'error');
      return;
    }
    if (lineItems.some((li) => !li.description.trim() || li.quantity <= 0 || li.unitPrice <= 0)) {
      addToast('All line items must have a description, quantity, and price', 'error');
      return;
    }
    if (!dueDate) {
      addToast('Due date is required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await invoicesApi.create({
        workOrderId: workOrderId as number,
        lineItems: lineItems.map((li) => ({
          description: li.description.trim(),
          quantity: li.quantity,
          unitPrice: li.unitPrice,
        })),
        taxRate: taxRate || undefined,
        notes: notes.trim() || undefined,
        dueDate,
      });
      addToast('Invoice created!', 'success');
      navigate('/invoices');
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to create invoice', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">Create Invoice</h1>
      <p className="mt-1 text-sm text-gray-500">
        Generate an invoice for a completed work order.
      </p>

      {loadingWOs ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="space-y-5">
            {/* Work Order */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Work Order *
              </label>
              <select
                value={workOrderId}
                onChange={(e) => setWorkOrderId(Number(e.target.value))}
                className="input-field"
              >
                <option value="" disabled>
                  Select a completed work order
                </option>
                {workOrders.map((wo) => (
                  <option key={wo.id} value={wo.id}>
                    #{wo.id} — {wo.title} ({wo.propertyName}, Unit {wo.unitNumber})
                  </option>
                ))}
              </select>
              {workOrders.length === 0 && (
                <p className="mt-1 text-xs text-gray-400">
                  No completed work orders available for invoicing.
                </p>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Due Date *
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Line Items */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Line Items *</label>
                <button
                  type="button"
                  onClick={addLineItem}
                  className="text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  + Add Item
                </button>
              </div>

              <div className="space-y-3">
                {lineItems.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 rounded-lg border border-gray-100 bg-gray-50 p-3"
                  >
                    <div className="col-span-12 sm:col-span-5">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                        className="input-field text-sm"
                        placeholder="Description"
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(index, 'quantity', Number(e.target.value))}
                        className="input-field text-sm"
                        placeholder="Qty"
                        min="1"
                        step="1"
                      />
                    </div>
                    <div className="col-span-5 sm:col-span-3">
                      <input
                        type="number"
                        value={item.unitPrice || ''}
                        onChange={(e) => updateLineItem(index, 'unitPrice', Number(e.target.value))}
                        className="input-field text-sm"
                        placeholder="Price (cents)"
                        min="0"
                        step="1"
                      />
                    </div>
                    <div className="col-span-3 sm:col-span-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </span>
                      {lineItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLineItem(index)}
                          className="text-red-400 hover:text-red-600"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tax Rate */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="input-field"
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
              <div className="flex flex-col justify-end">
                <div className="space-y-1 text-right text-sm">
                  <p className="text-gray-500">
                    Subtotal: <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                  </p>
                  <p className="text-gray-500">
                    Tax: <span className="font-medium text-gray-900">{formatCurrency(taxAmount)}</span>
                  </p>
                  <p className="text-base font-bold text-gray-900">
                    Total: {formatCurrency(total)}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-field"
                rows={3}
                placeholder="Additional notes or payment instructions..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/invoices')}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
            >
              {submitting ? <Spinner size="sm" /> : 'Create Invoice'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
