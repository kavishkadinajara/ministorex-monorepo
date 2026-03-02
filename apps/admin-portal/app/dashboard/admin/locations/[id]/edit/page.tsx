"use client";

import { Alert, AlertDescription } from "@ministorex/ui/components/alert";
import { Button } from "@ministorex/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ministorex/ui/components/card";
import { Checkbox } from "@ministorex/ui/components/checkbox";
import { Input } from "@ministorex/ui/components/input";
import { Label } from "@ministorex/ui/components/label";
import { Skeleton } from "@ministorex/ui/components/skeleton";
import { getLocationById, getStores, updateLocation } from "@ministorex/database/api-stores";
import type { Store } from "@ministorex/database/types";
import { AlertCircle, ArrowLeft, CheckCircle2, Info, Loader2, MapPin, Save } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

export default function EditLocationPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [stores, setStores] = React.useState<Store[]>([]);
  const [formData, setFormData] = React.useState({
    store_id: "",
    code: "",
    name: "",
    address: "",
    is_active: true,
  });

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [location, storesData] = await Promise.all([
          getLocationById(params.id as string),
          getStores({ onlyActive: false }),
        ]);

        setStores(storesData.data);
        setFormData({
          store_id: location.store_id,
          code: location.code,
          name: location.name,
          address: location.address || "",
          is_active: location.is_active,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load location", {
          description: "The location could not be found or loaded.",
        });
        router.push("/dashboard/admin/locations");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchData();
    }
  }, [params.id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.store_id || !formData.code || !formData.name) {
      toast.error("Missing required fields", {
        description: "Please fill in Store, Code, and Name fields.",
      });
      return;
    }

    setSaving(true);
    const toastId = toast.loading("Saving changes...");
    
    try {
      await updateLocation(params.id as string, formData);
      toast.success("Location updated successfully!", {
        id: toastId,
        description: `${formData.name} has been updated.`,
      });
      router.push(`/dashboard/admin/locations/${params.id}`);
    } catch (error: unknown) {
      console.error("Error updating location:", error);
      toast.error("Failed to update location", {
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
            <Link href={`/dashboard/admin/locations/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Location</h1>
            <p className="text-muted-foreground">Update location information</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
              <CardDescription>Modify the location information below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Store Selection */}
              <div className="space-y-2">
                <Label htmlFor="store_id">Store *</Label>
                <select
                  id="store_id"
                  name="store_id"
                  value={formData.store_id}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select a store</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name} ({store.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Basic Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="code">Location Code *</Label>
                  <Input
                    id="code"
                    name="code"
                    placeholder="e.g., LOC001"
                    value={formData.code}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Location Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Main Branch"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Location address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              {/* Status */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, is_active: !!checked }))
                    }
                  />
                  <Label htmlFor="is_active" className="font-normal">
                    Location is Active
                  </Label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" asChild>
                  <Link href={`/dashboard/admin/locations/${params.id}`}>Cancel</Link>
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
                Location codes should be unique within each store
              </p>
            </div>
            <div className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <p className="text-muted-foreground">
                Inactive locations won&apos;t appear in dropdowns
              </p>
            </div>
            <div className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <p className="text-muted-foreground">
                Use clear, descriptive names for easy identification
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Location Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4" />
              About Locations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Locations represent physical branches or warehouses within a store.
            </p>
            <p>
              Each location can have its own inventory, staff, and operations while belonging to the same parent store.
            </p>
          </CardContent>
        </Card>

        {/* Warning */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Deactivating a location will hide it from all reports and operations. Existing data will be preserved.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
