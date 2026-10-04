import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import { toast } from 'react-toastify';

const client = generateClient();

export default function AdminOrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sub = client.models.Order.observeQuery().subscribe({
      next: ({ items }) => {
        const sortedItems = [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedItems.map(o => ({
          ...o,
          items: typeof o.items === 'string' ? JSON.parse(o.items || '[]') : (o.items || [])
        })));
        setLoading(false);
      },
      error: (_err) => {
        setLoading(false);
        toast.error('Failed to load orders');
      }
    });

    return () => sub.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="card">
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 className="page-title" style={{ margin: 0 }}>Vendor / Admin Dashboard (Read-Only Oversight)</h2>
        <span className="user-role-badge" style={{ fontSize: '0.85rem' }}>
          {orders.length} Total Orders
        </span>
      </div>

      {orders.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
          No orders placed yet.
        </p>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Items Count</th>
                <th>Total</th>
                <th>Status</th>
                <th>Assigned Delivery</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <div style={{ fontWeight: '600' }}>{order.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.customerEmail}</div>
                  </td>
                  <td>
                    {order.items?.length || 0} item(s)
                  </td>
                  <td style={{ fontWeight: '600' }}>
                    ${order.totalAmount?.toFixed(2)}
                  </td>
                  <td>
                    <span className={`status-tag ${order.status}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: order.assignedDeliveryBoy ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {order.assignedDeliveryBoy || 'Unassigned'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {order.createdAt ? `${new Date(order.createdAt).toLocaleDateString()} ${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
