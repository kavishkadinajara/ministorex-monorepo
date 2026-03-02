"use client";

import { deleteStore, getStores } from "@ministorex/database/api-stores";
import type { Store } from "@ministorex/database/types";
import { Badge } from "@ministorex/ui/components/badge";
import { Button } from "@ministorex/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ministorex/ui/components/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@ministorex/ui/components/dropdown-menu";
import { Input } from "@ministorex/ui/components/input";
import { Skeleton } from "@ministorex/ui/components/skeleton";
import {
    Building2,
    Eye,
    MapPin,
    MoreHorizontal,
    Pencil,
    Phone,
    Plus,
    RefreshCw,
    Search,
    Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

export default function StoresListPage() {
  const router = useRouter();
  const [stores, setStores] = React.useState<Store[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [deleting, setDeleting] = React.useState<string | null>(null);

  const fetchStores = React.useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getStores({ search, onlyActive: true });
      setStores(data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  React.useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this store?")) return;
    
    setDeleting(id);
    try {
      await deleteStore(id);
      setStores((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error deleting store:", error);
      alert("Failed to delete store");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stores</h1>
          <p className="text-muted-foreground">Manage your stores and branches</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/admin/stores/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Store
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search stores..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={fetchStores}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stores Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stores.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No stores found</h3>
            <p className="text-muted-foreground mb-4">
              {search ? "Try a different search term" : "Get started by creating your first store"}
            </p>
            {!search && (
              <Button asChild>
                <Link href="/dashboard/admin/stores/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Store
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <Card key={store.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="truncate">{store.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="font-mono">
                        {store.code}
                      </Badge>
                      {store.business_type && (
                        <span className="text-xs">{store.business_type}</span>
                      )}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/stores/${store.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/stores/${store.id}/edit`)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(store.id)}
                        disabled={deleting === store.id}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {deleting === store.id ? "Deleting..." : "Delete"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {store.city && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="truncate">{store.city}</span>
                  </div>
                )}
                {store.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span>{store.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 pt-2">
                  {store.enable_credit && (
                    <Badge variant="secondary" className="text-xs">Credit</Badge>
                  )}
                  {store.enable_stock_management && (
                    <Badge variant="secondary" className="text-xs">Stock</Badge>
                  )}
                  <Badge className="text-xs ml-auto">{store.currency}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
