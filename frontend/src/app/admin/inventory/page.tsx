import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAdminInventory, getInventoryTransactions } from "@/lib/api";
import { AdminInventoryClient } from "./AdminInventoryClient";

export const metadata: Metadata = {
  title: "Blood Inventory — Lifeline Admin",
};

export default async function AdminInventoryPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const token = await getToken();
  if (!token) redirect("/sign-in");

  const [inventoryRes, txRes] = await Promise.all([
    getAdminInventory(token),
    getInventoryTransactions(token, 20),
  ]);

  const inventory = inventoryRes.success
    ? inventoryRes.data
    : {
        items: [],
        locations: [],
        stats: {
          total_units: 0,
          total_groups: 0,
          low_stock: 0,
          expiring_soon: 0,
          by_group: {},
        },
      };

  const transactions = txRes.success ? txRes.data.transactions : [];

  return (
    <AdminInventoryClient
      token={token}
      initialInventory={inventory}
      initialTransactions={transactions}
    />
  );
}