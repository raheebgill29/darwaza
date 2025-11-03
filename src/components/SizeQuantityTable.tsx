"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type SizeRow = { size: string; stock: number };

type Props = {
  productId: string;
  selectable?: boolean;
  selectedSize?: string | null;
  onSelect?: (size: string) => void;
  allowQuantityInput?: boolean; // enable per-size quantity selection
  selectedQuantities?: Record<string, number>; // controlled quantities
  onQuantitiesChange?: (map: Record<string, number>) => void;
  onLoaded?: (rows: SizeRow[]) => void; // notify parent of loaded sizes
  className?: string;
};

export default function SizeQuantityTable({ productId, selectable = false, selectedSize = null, onSelect, allowQuantityInput = false, selectedQuantities, onQuantitiesChange, onLoaded, className }: Props) {
  const [rows, setRows] = useState<SizeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qtyMap, setQtyMap] = useState<Record<string, number>>({});

  useEffect(() => {
    let alive = true;
    async function fetchSizes() {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from("product_sizes")
          .select("size,stock")
          .eq("product_id", productId)
          .order("size", { ascending: true });
        if (error) throw error;
        const mapped: SizeRow[] = (data ?? []).map((r: any) => ({ size: r.size, stock: r.stock ?? 0 }));
        if (!alive) return;
        setRows(mapped);
        onLoaded && onLoaded(mapped);
        // Initialize qty map for uncontrolled mode
        if (allowQuantityInput) {
          const initial: Record<string, number> = {};
          mapped.forEach((r) => { initial[r.size] = 0; });
          setQtyMap(initial);
        }
      } catch (err: any) {
        if (!alive) return;
        setRows([]);
        setError(err?.message ?? "Failed to load sizes");
        onLoaded && onLoaded([]);
      } finally {
        if (alive) setLoading(false);
      }
    }
    if (productId) fetchSizes();
    return () => { alive = false; };
  }, [productId]);

  useEffect(() => {
    // Sync controlled selectedQuantities into local qtyMap
    if (allowQuantityInput && selectedQuantities) {
      setQtyMap((prev) => {
        const next: Record<string, number> = { ...prev };
        Object.entries(selectedQuantities).forEach(([size, qty]) => {
          next[size] = Math.max(0, qty);
        });
        return next;
      });
    }
  }, [allowQuantityInput, selectedQuantities]);

  if (loading) {
    return (
      <div className={className ?? "rounded-xl bg-brand-base p-3"}>
        <p className="text-accent/80">Loading sizes…</p>
      </div>
    );
  }

  if (error || rows.length === 0) {
    return null;
  }

  return (
    <div className={className ?? "rounded-xl bg-brand-base p-3"}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-accent font-semibold">Available Sizes</h3>
        {!selectable && <span className="text-xs text-accent/60">Per-size stock</span>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-brand-200">
              {selectable && !allowQuantityInput && <th className="p-2 text-left text-xs font-semibold text-accent">Select</th>}
              <th className="p-2 text-left text-xs font-semibold text-accent">Size</th>
              <th className="p-2 text-left text-xs font-semibold text-accent">{allowQuantityInput ? 'Select Qty' : 'Quantity'}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.size} className="border-b border-brand-200">
                {selectable && !allowQuantityInput && (
                  <td className="p-2">
                    <input
                      type="radio"
                      name="size-select"
                      aria-label={`Select size ${r.size}`}
                      checked={selectedSize === r.size}
                      disabled={r.stock <= 0}
                      onChange={() => onSelect && onSelect(r.size)}
                    />
                  </td>
                )}
                <td className="p-2 text-accent">{r.size}</td>
                <td className="p-2 text-accent">
                  {allowQuantityInput ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={Math.max(0, r.stock)}
                        value={(selectedQuantities ? selectedQuantities[r.size] : qtyMap[r.size]) ?? 0}
                        onChange={(e) => {
                          const val = Math.min(Math.max(0, Number(e.target.value) || 0), Math.max(0, r.stock));
                          setQtyMap((prev) => {
                            const next = { ...prev, [r.size]: val };
                            onQuantitiesChange && onQuantitiesChange(next);
                            return next;
                          });
                        }}
                        disabled={r.stock <= 0}
                        className="w-20 rounded-md border border-accent/30 bg-white p-1 text-accent"
                        aria-label={`Quantity for size ${r.size}`}
                      />
                      <span className="text-xs text-accent/60">(In stock: {r.stock})</span>
                    </div>
                  ) : (
                    r.stock
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}