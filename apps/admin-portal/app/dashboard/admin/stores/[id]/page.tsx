"use client";

import { deleteStore, getStoreById } from "@ministorex/database/api-stores";
import type { Store } from "@ministorex/database/types";
import { Badge } from "@ministorex/ui/components/badge";
import { Button } from "@ministorex/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ministorex/ui/components/card";
import { Separator } from "@ministorex/ui/components/separator";
import { Skeleton } from "@ministorex/ui/components/skeleton";
import {
    ArrowLeft,
    Building2,
    Calendar,
    CreditCard,
    MapPin,
    Package,
    Pencil,
    Phone,
    Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

export default function StoreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [store, setStore] = React.useState<Store | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    async function fetchStore() {
      try {
        const data = await getStoreById(params.id as string);
        setStore(data);
      } catch (error) {
        console.error("Error fetching store:", error);
        toast.error("Failed to load store");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchStore();
    }
  }, [params.id]);

  const handleDelete = async () => {
    if (!store) return;
    if (!confirm("Are you sure you want to deactivate this store?")) return;

    setDeleting(true);
    const toastId = toast.loading("Deleting store...");

    try {
      await deleteStore(store.id);
      toast.success("Store deleted", { id: toastId });
      router.push("/dashboard/admin/stores");
    } catch (error) {
      console.error("Error deleting store:", error);
      toast.error("Failed to delete store", { id: toastId });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32 mt-2" />
            </div>
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/admin/stores">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Store not found</h3>
            <p className="text-muted-foreground mb-4">The requested store could not be found</p>
            <Button asChild>
              <Link href="/dashboard/admin/stores">Back to Stores</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Content - Left Side */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/admin/stores">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">{store.name}</h1>
                <Badge variant={store.is_active ? "default" : "secondary"}>
                  {store.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-muted-foreground font-mono">{store.code}</p>
            </div>
          </div>
          <div className="flex gap-2 ml-14 sm:ml-0">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/admin/stores/${store.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              <Trash2 className="mr-2 h-4 w-4" />
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>

        {/* Store Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>Details about this store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Business Type</p>
                <div className="flex items-center gap-2 mt-1">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{store.business_type || "—"}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Currency</p>
                <p className="mt-1 font-mono">{store.currency}</p>
              </div>
            </div>

            <Separator />

            {/* Features */}
            <div>
              <h4 className="font-medium mb-3">Enabled Features</h4>
              <div className="flex flex-wrap gap-2">
                {store.enable_credit && (
                  <Badge variant="outline" className="gap-1">
                    <CreditCard className="h-3 w-3" />
                    Credit / Naya
                  </Badge>
                )}
                {store.enable_stock_management && (
                  <Badge variant="outline" className="gap-1">
                    <Package className="h-3 w-3" />
                    Stock Management
                  </Badge>
                )}
                {!store.enable_credit && !store.enable_stock_management && (
                   <p className="text-sm text-muted-foreground">No additional features enabled.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar - Right Side */}
      <div className="space-y-6 lg:mt-[88px]">
         {/* Contact Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground break-words">{store.address || "—"}</p>
                  {store.city && <p className="text-sm text-muted-foreground">{store.city}</p>}
                </div>
              </div>
            
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{store.phone || "—"}</p>
                </div>
              </div>
          </CardContent>
        </Card>

        {/* Metadata Card */}
        <Card>
          <CardHeader>
             <CardTitle className="text-base">System Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Created: {new Date(store.created_at).toLocaleDateString()}</span>
            </div>
            {store.modified_at && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Modified: {new Date(store.modified_at).toLocaleDateString()}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
