import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow, format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import BillView from "@/components/BillView";
type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
};

type Order = {
  id: string;
  order_number?: string;
  created_at: string;
  name: string;
  phone: string;
  address: string;
  note?: string;
  items: OrderItem[];
  total: number;
  status?: string;
  remark?: string;
  debit_money?: number;
};

const ORDERS_KEY = "_egc_orders_v1";

const OrdersAdmin = () => {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [orderNumber, setOrderNumber] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [filteredOrders, setFilteredOrders] = React.useState<Order[]>([]);
  const [billOrder, setBillOrder] = React.useState<Order | null>(null);
  const [editingStatus, setEditingStatus] = React.useState<Record<string, string>>({}); 
  const [editingRemark, setEditingRemark] = React.useState<Record<string, string>>({});
  const [editingDebitMoney, setEditingDebitMoney] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      // Try server-side first (cast to any to avoid generated types mismatch)
      const { data, error } = await (supabase as any).from("orders").select("*").order("created_at", { ascending: false });
      if (error) {
        // Fallback to localStorage if server query fails
        const raw = localStorage.getItem(ORDERS_KEY);
        const list = raw ? JSON.parse(raw) : [];
        setOrders(list);
        setFilteredOrders(list);
        return;
      }

      // Map database columns to Order type
      const mappedOrders = (data || []).map((order: any) => ({
        id: order.id,
        created_at: order.created_at,
        name: order.customer_name,
        phone: order.customer_phone,
        address: order.customer_address,
        note: order.note || "",
        items: order.items || [],
        total: order.total_price,
        status: order.status || "pending",
        remark: order.remark || "",
        debit_money: order.debit_money || 0,
        order_number: order.order_number,
      }));

      setOrders(mappedOrders);
      setFilteredOrders(mappedOrders);
    } catch (err) {
      const raw = localStorage.getItem(ORDERS_KEY);
      const list = raw ? JSON.parse(raw) : [];
      setOrders(list);
      setFilteredOrders(list);
    }
  };

  const handleSearch = () => {
    let result = orders;

    if (orderNumber.trim()) {
      result = result.filter((o) => (o.order_number || o.id).toLowerCase().includes(orderNumber.toLowerCase()));
    }

    if (name.trim()) {
      result = result.filter((o) => o.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (phone.trim()) {
      result = result.filter((o) => o.phone.includes(phone));
    }

    if (startDate) {
      const start = new Date(startDate);
      result = result.filter((o) => new Date(o.created_at) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter((o) => new Date(o.created_at) <= end);
    }

    if (statusFilter && statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }

    setFilteredOrders(result);
  };

  const clearFilters = () => {
    setOrderNumber("");
    setName("");
    setPhone("");
    setStartDate("");
    setEndDate("");
    setStatusFilter("");
    setFilteredOrders(orders);
  };

  const saveOrderChanges = async (id: string) => {
    try {
      const updateData: Record<string, any> = {};
      if (editingStatus[id]) updateData.status = editingStatus[id];
      if (editingRemark[id] !== undefined) updateData.remark = editingRemark[id];
      if (editingDebitMoney[id] !== undefined) updateData.debit_money = editingDebitMoney[id];
      
      if (Object.keys(updateData).length === 0) return;
      
      const { error } = await (supabase as any).from("orders").update(updateData).eq("id", id);
      if (!error) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === id
              ? {
                  ...o,
                  status: editingStatus[id] || o.status,
                  remark: editingRemark[id] ?? o.remark,
                  debit_money: editingDebitMoney[id] ?? o.debit_money,
                }
              : o
          )
        );
        setFilteredOrders((prev) =>
          prev.map((o) =>
            o.id === id
              ? {
                  ...o,
                  status: editingStatus[id] || o.status,
                  remark: editingRemark[id] ?? o.remark,
                  debit_money: editingDebitMoney[id] ?? o.debit_money,
                }
              : o
          )
        );
        setEditingStatus((prev) => ({ ...prev, [id]: "" }));
        setEditingRemark((prev) => ({ ...prev, [id]: "" }));
        setEditingDebitMoney((prev) => ({ ...prev, [id]: 0 }));
        return;
      }
    } catch (err) {
      // ignore and fallback
    }

    // fallback to localStorage update
    const raw = localStorage.getItem(ORDERS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    const updated = list.map((o: Order) =>
      o.id === id
        ? {
            ...o,
            status: editingStatus[id] || o.status,
            remark: editingRemark[id] ?? o.remark,
            debit_money: editingDebitMoney[id] ?? o.debit_money,
          }
        : o
    );
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    setOrders(updated);
    setFilteredOrders(updated);
    setEditingStatus((prev) => ({ ...prev, [id]: "" }));
    setEditingRemark((prev) => ({ ...prev, [id]: "" }));
    setEditingDebitMoney((prev) => ({ ...prev, [id]: 0 }));
  };

  const deleteOrder = async (id: string) => {
    try {
      const { error } = await (supabase as any).from("orders").delete().eq("id", id);
      if (!error) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
        return;
      }
    } catch (err) {
      // ignore and fallback
    }

    // fallback to localStorage delete
    const raw = localStorage.getItem(ORDERS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    const next = list.filter((o: Order) => o.id !== id);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
    setOrders(next);
  };

  const exportCsv = () => {
    if (!orders || orders.length === 0) return;
    // Flatten CSV rows: order-level and item-level rows
    const rows: string[] = [];
    const header = ["order_id", "created_at", "name", "phone", "address", "note", "total", "item_id", "item_name", "item_qty", "item_price"].join(",");
    rows.push(header);
    orders.forEach((o) => {
      o.items.forEach((it) => {
        const line = [
          `"${o.id}"`,
          `"${o.created_at}"`,
          `"${o.name}"`,
          `"${o.phone}"`,
          `"${o.address}"`,
          `"${(o.note || "").replace(/\"/g, '""')}"`,
          `"${Number(o.total).toFixed(2)}"`,
          `"${it.id}"`,
          `"${it.name.replace(/\"/g, '""')}"`,
          `"${it.quantity}"`,
          `"${Number(it.price).toFixed(2)}"`,
        ].join(",");
        rows.push(line);
      });
    });

    const csv = rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Orders</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={loadOrders}>Refresh</Button>
            <Button onClick={exportCsv}>Export CSV</Button>
          </div>
        </div>

        <div className="bg-card p-4 rounded space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <Input placeholder="Order Number" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />
            <Input placeholder="Customer Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-input rounded text-sm"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="debit">Debit</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleSearch} className="gold-gradient">Search</Button>
            {(orderNumber || name || phone || startDate || endDate || statusFilter) && (
              <Button variant="outline" onClick={clearFilters}>Clear</Button>
            )}
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">No orders yet.</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-muted-foreground">No orders match your search.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Remark</TableHead>
              <TableHead>Debit Money</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((o) => (
              <React.Fragment key={o.id}>
                <TableRow>
                  <TableCell className="font-medium text-sm">{o.id.slice(0, 8)}</TableCell>
                  <TableCell>{o.name}</TableCell>
                  <TableCell>{format(new Date(o.created_at), "dd/MM/yy")}</TableCell>
                  <TableCell>${Number(o.total).toFixed(2)}</TableCell>
                  <TableCell>
                    <select
                      value={editingStatus[o.id] || o.status || "pending"}
                      onChange={(e) => setEditingStatus((prev) => ({ ...prev, [o.id]: e.target.value }))}
                      className="px-2 py-1 bg-background border border-input rounded text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="debit">Debit</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      placeholder="Add remark"
                      value={editingRemark[o.id] !== undefined ? editingRemark[o.id] : (o.remark || "")}
                      onChange={(e) => setEditingRemark((prev) => ({ ...prev, [o.id]: e.target.value }))}
                      className="text-sm h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      value={editingDebitMoney[o.id] !== undefined ? editingDebitMoney[o.id] : (o.debit_money || 0)}
                      onChange={(e) => setEditingDebitMoney((prev) => ({ ...prev, [o.id]: parseFloat(e.target.value) || 0 }))}
                      className="text-sm h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => saveOrderChanges(o.id)}
                        className="text-xs"
                      >
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setBillOrder(o)}
                        className="text-xs"
                      >
                        Bill
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                        className="text-xs"
                      >
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>

                {expanded === o.id && (
                  <TableRow>
                    <TableCell colSpan={8} className="bg-secondary">
                      <div className="p-4">
                        <div className="mb-2"> <strong>Phone:</strong> {o.phone} </div>
                        <div className="mb-2"> <strong>Address:</strong> {o.address} </div>
                        {o.note && <div className="mb-2"> <strong>Note:</strong> {o.note} </div>}
                        {o.status && <div className="mb-2"> <strong>Status:</strong> {o.status} </div>}
                        {o.remark && <div className="mb-2"> <strong>Remark:</strong> {o.remark} </div>}
                        {o.debit_money !== undefined && <div className="mb-2"> <strong>Debit Money:</strong> ${Number(o.debit_money).toFixed(2)} </div>}

                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Items</h4>
                          <div className="space-y-2">
                            {o.items.map((it) => (
                              <div key={it.id} className="flex items-center gap-4">
                                {it.image_url ? (
                                  <img src={it.image_url} alt={it.name} className="w-12 h-12 object-cover rounded" />
                                ) : (
                                  <div className="w-12 h-12 bg-secondary rounded" />
                                )}
                                <div className="flex-1">
                                  <div className="font-medium">{it.name}</div>
                                  <div className="text-muted-foreground text-sm">{it.quantity} × ${it.price.toFixed(2)}</div>
                                </div>
                                <div className="font-medium">${(it.price * it.quantity).toFixed(2)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      )}

      {billOrder && (
        <BillView
          order={billOrder}
          onClose={() => setBillOrder(null)}
          onPrint={() => window.print()}
        />
      )}
    </div>
  );
};

export default OrdersAdmin;
