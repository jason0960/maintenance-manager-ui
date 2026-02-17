import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { invoicesApi } from '@/api/services';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { InvoiceStatusBadge } from '@/components/Badges';
import Spinner from '@/components/Spinner';
import type { InvoiceResponse, InvoiceStatus } from '@/types';
import { INVOICE_STATUSES, INVOICE_STATUS_LABELS } from '@/types';

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

export default function InvoicesPage() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | ''>('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    invoicesApi
      .list()
      .then(setInvoices)
      .catch(() => addToast('Failed to load invoices', 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    let result = [...invoices];
    if (statusFilter) result = result.filter((inv) => inv.status === statusFilter);
    result.sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? db - da : da - db;
    });
    return result;
  }, [invoices, statusFilter, sortOrder]);

  // Summary stats
  const totalOutstanding = invoices
    .filter((inv) => inv.status === 'SENT' || inv.status === 'OVERDUE')
    .reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = invoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((sum, inv) => sum + inv.total, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Invoices</h1>
          <p className="mt-1 text-sm text-gray-500">{filtered.length} invoices</p>
        </div>
        {user?.role !== 'TECH' && (
          <Link to="/invoices/new" className="btn-primary">
            + New Invoice
          </Link>
        )}
      </div>

      {/* Summary cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-blue-50 p-5 text-blue-700">
          <p className="text-sm font-medium opacity-80">Total Invoices</p>
          <p className="mt-1 text-3xl font-bold">{invoices.length}</p>
        </div>
        <div className="rounded-xl bg-yellow-50 p-5 text-yellow-700">
          <p className="text-sm font-medium opacity-80">Outstanding</p>
          <p className="mt-1 text-3xl font-bold">{formatCurrency(totalOutstanding)}</p>
        </div>
        <div className="rounded-xl bg-green-50 p-5 text-green-700">
          <p className="text-sm font-medium opacity-80">Paid</p>
          <p className="mt-1 text-3xl font-bold">{formatCurrency(totalPaid)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4 flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as InvoiceStatus | '')}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        >
          <option value="">All Statuses</option>
          {INVOICE_STATUSES.map((s) => (
            <option key={s} value={s}>{INVOICE_STATUS_LABELS[s]}</option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Invoices table */}
      {filtered.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-gray-400">No invoices match your filters.</p>
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-600">Invoice #</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Work Order</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Property</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-600 text-right">Total</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Due Date</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link
                        to={`/invoices/${inv.id}`}
                        className="font-medium text-brand-600 hover:text-brand-700"
                      >
                        {inv.invoiceNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <Link
                        to={`/work-orders/${inv.workOrderId}`}
                        className="hover:text-brand-600"
                      >
                        {inv.workOrderTitle}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {inv.propertyName} · {inv.unitNumber}
                    </td>
                    <td className="px-4 py-3">
                      <InvoiceStatusBadge status={inv.status} />
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {formatCurrency(inv.total)}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(inv.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-gray-100 md:hidden">
            {filtered.map((inv) => (
              <Link
                key={inv.id}
                to={`/invoices/${inv.id}`}
                className="block px-4 py-3 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{inv.invoiceNumber}</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {inv.propertyName} · {inv.workOrderTitle}
                    </p>
                  </div>
                  <InvoiceStatusBadge status={inv.status} />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(inv.total)}
                  </span>
                  <span className="text-xs text-gray-400">
                    Due {new Date(inv.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
