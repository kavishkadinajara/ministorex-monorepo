"use client";

import { Button } from "@ministorex/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ministorex/ui/components/card";
import { Input } from "@ministorex/ui/components/input";
import { Label } from "@ministorex/ui/components/label";
import { Skeleton } from "@ministorex/ui/components/skeleton";
import { createLocation, getStores } from "@ministorex/database/api-stores";
import type { Store } from "@ministorex/database/types";
import { ArrowLeft, CheckCircle2, Info, Loader2, MapPin, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

export default function NewLocationPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [stores, setStores] = React.useState<Store[]>([]);
  const [loadingStores, setLoadingStores] = React.useState(true);
  const [formData, setFormData] = React.useState({
    store_id: "",
    code: "",
    name: "",
    address: "",
    is_active: true,
  });

  React.useEffect(() => {
    async function fetchStores() {
      try {
        const { data } = await getStores({ onlyActive: true });
        setStores(data);
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, store_id: data[0].id }));
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
        toast.error("Failed to load stores");
      } finally {
        setLoadingStores(false);
      }
    }
    fetchStores();
  }, []);

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

    setLoading(true);
    const toastId = toast.loading("Creating location...");

    try {
      await createLocation(formData);
      toast.success("Location created successfully!", {
        id: toastId,
        description: `${formData.name} has been added to the store.`,
      });
      router.push("/dashboard/admin/locations");
    } catch (error: unknown) {
      console.error("Error creating location:", error);
      toast.error("Failed to create location", {
        id: toastId,
        description: error instanceof Error ? error.message : "An error occurred while creating the location.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Form - Left Side */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/admin/locations">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create Location</h1>
            <p className="text-muted-foreground">Add a new location to a store</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
              <CardDescription>Enter the location information below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Store Selection */}
              <div className="space-y-2">
                <Label htmlFor="store_id">Store *</Label>
                {loadingStores ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <select
                    id="store_id"
                    name="store_id"
                    value={formData.store_id}
                    onChange={handleChange}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a store</option>
                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name} ({store.code})
                      </option>
                    ))}
                  </select>
                )}
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

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard/admin/locations">Cancel</Link>
                </Button>
                <Button type="submit" disabled={loading || loadingStores}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Create Location
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
                Location codes should be unique within the store
              </p>
            </div>
            <div className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <p className="text-muted-foreground">
                Use descriptive names for easy identification
              </p>
            </div>
            <div className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <p className="text-muted-foreground">
                Address helps in generating accurate reports
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
              Locations represent physical branches or warehouses.
            </p>
            <p>
              Stock is tracked per location. You can transfer stock between locations later.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
