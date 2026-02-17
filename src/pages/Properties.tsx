import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { propertiesApi } from '@/api/services';
import { useToast } from '@/contexts/ToastContext';
import type { PropertyResponse } from '@/types';
import Spinner from '@/components/Spinner';
import CreatePropertyModal from '@/components/CreatePropertyModal';
import AddUnitModal from '@/components/AddUnitModal';

export default function PropertiesPage() {
  const { addToast } = useToast();
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [unitPropertyId, setUnitPropertyId] = useState<number | null>(null);

  const fetchProperties = async () => {
    try {
      const list = await propertiesApi.list();
      // The list endpoint doesn't return units — fetch each property's detail
      const detailed = await Promise.all(
        list.map((p) => propertiesApi.get(p.id))
      );
      setProperties(detailed);
    } catch {
      addToast('Failed to load properties', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="mt-1 text-sm text-gray-500">{properties.length} properties</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          + New Property
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-gray-400">No properties yet. Create your first property.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900">{p.name}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {p.address}, {p.city}, {p.state} {p.zip}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-medium">{p.units?.length || 0}</span> units
              </p>

              {/* Units list */}
              {p.units && p.units.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.units.slice(0, 8).map((u) => (
                    <span
                      key={u.id}
                      className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                    >
                      {u.unitNumber}
                    </span>
                  ))}
                  {p.units.length > 8 && (
                    <span className="text-xs text-gray-400">+{p.units.length - 8} more</span>
                  )}
                </div>
              )}

              <div className="mt-4 flex items-center gap-2">
                <Link
                  to={`/work-orders?propertyId=${p.id}`}
                  className="text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  Work Orders
                </Link>
                <span className="text-gray-300">·</span>
                <button
                  onClick={() => setUnitPropertyId(p.id)}
                  className="text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  + Add Unit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <CreatePropertyModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            fetchProperties();
          }}
        />
      )}

      {unitPropertyId && (
        <AddUnitModal
          propertyId={unitPropertyId}
          onClose={() => setUnitPropertyId(null)}
          onAdded={() => {
            setUnitPropertyId(null);
            fetchProperties();
          }}
        />
      )}
    </div>
  );
}
