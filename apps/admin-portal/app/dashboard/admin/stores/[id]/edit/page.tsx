"use client";

import { Alert, AlertDescription } from "@ministorex/ui/components/alert";
import { Button } from "@ministorex/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ministorex/ui/components/card";
import { Checkbox } from "@ministorex/ui/components/checkbox";
import { Input } from "@ministorex/ui/components/input";
import { Label } from "@ministorex/ui/components/label";
import { Skeleton } from "@ministorex/ui/components/skeleton";
import { getStoreById, updateStore } from "@ministorex/database/api-stores";
import { AlertCircle, ArrowLeft, CheckCircle2, CreditCard, Info, Loader2, Package, Save, Store } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

export default function EditStorePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [formData, setFormData] = React.useState({
    code: "",
    name: "",
    business_type: "",
    address: "",
    city: "",
    phone: "",
    currency: "LKR",
    enable_credit: true,
    enable_stock_management: true,
    is_active: true,
  });

  React.useEffect(() => {
    async function fetchStore() {
      try {
        const store = await getStoreById(params.id as string);
        setFormData({
          code: store.code,
          name: store.name,
          business_type: store.business_type || "",
          address: store.address || "",
          city: store.city || "",
          phone: store.phone || "",
          currency: store.currency,
          enable_credit: store.enable_credit,
          enable_stock_management: store.enable_stock_management,
          is_active: store.is_active,
        });
      } catch (error) {
        console.error("Error fetching store:", error);
        toast.error("Failed to load store", {
          description: "The store could not be found or loaded.",
        });
        router.push("/dashboard/admin/stores");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchStore();
    }
  }, [params.id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code || !formData.name) {
      toast.error("Missing required fields", {
        description: "Please fill in Code and Name fields.",
      });
      return;
    }

    setSaving(true);
    const toastId = toast.loading("Saving changes...");
    
    try {
      await updateStore(params.id as string, formData);
      toast.success("Store updated successfully!", {
        id: toastId,
        description: `${formData.name} has been updated.`,
      });
      router.push(`/dashboard/admin/stores/${params.id}`);
    } catch (error: unknown) {
      console.error("Error updating store:", error);
      toast.error("Failed to update store", {
        id: toastId,
        description: error instanceof Error ? error.message : "An error occurred while saving.",
      });
    } finally {
      setSaving(false);
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
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Form - Left Side */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/admin/stores/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Store</h1>
            <p className="text-muted-foreground">Update store information</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Store Details</CardTitle>
              <CardDescription>Modify the store information below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="code">Store Code *</Label>
                  <Input
                    id="code"
                    name="code"
                    placeholder="e.g., STORE001"
                    value={formData.code}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Store Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Main Street Shop"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="business_type">Business Type</Label>
                  <Input
                    id="business_type"
                    name="business_type"
                    placeholder="e.g., Grocery, Hardware"
                    value={formData.business_type}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    name="currency"
                    placeholder="LKR"
                    value={formData.currency}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Full address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City / Town</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="e.g., Colombo"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="e.g., 0771234567"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Options */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium">Store Options</h4>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enable_credit"
                    checked={formData.enable_credit}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, enable_credit: !!checked }))
                    }
                  />
                  <Label htmlFor="enable_credit" className="font-normal">
                    Enable Credit / Naya Module
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enable_stock_management"
                    checked={formData.enable_stock_management}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, enable_stock_management: !!checked }))
                    }
                  />
                  <Label htmlFor="enable_stock_management" className="font-normal">
                    Enable Stock Management
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, is_active: !!checked }))
                    }
                  />
                  <Label htmlFor="is_active" className="font-normal">
                    Store is Active
                  </Label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" asChild>
                  <Link href={`/dashboard/admin/stores/${params.id}`}>Cancel</Link>
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>

      {/* Helper Sidebar - Right Side */}
      <div className="space-y-4">
        {/* Quick Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="h-4 w-4" />
              Quick Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <p className="text-muted-foreground">
                Store codes must be unique across your system
              </p>
            </div>
            <div className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <p className="text-muted-foreground">
                Inactive stores won&apos;t appear in reports or operations
              </p>
            </div>
            <div className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <p className="text-muted-foreground">
                Choose currency carefully - changing later affects all transactions
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Store Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Store className="h-4 w-4" />
              Store Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <CreditCard className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Credit / Naya</p>
                <p className="text-muted-foreground text-xs">
                  Track customer credit accounts and payment history
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Package className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Stock Management</p>
                <p className="text-muted-foreground text-xs">
                  Monitor inventory levels and get low stock alerts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warning */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Deactivating this store will prevent all operations. Existing data will be preserved but not editable.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
