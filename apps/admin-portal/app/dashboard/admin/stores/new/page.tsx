"use client";

import { Button } from "@ministorex/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ministorex/ui/components/card";
import { Checkbox } from "@ministorex/ui/components/checkbox";
import { Input } from "@ministorex/ui/components/input";
import { Label } from "@ministorex/ui/components/label";
import { createStore } from "@ministorex/database/api-stores";
import { ArrowLeft, CheckCircle2, CreditCard, Info, Loader2, Package, Save, Store } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

export default function NewStorePage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
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

    setLoading(true);
    const toastId = toast.loading("Creating store...");

    try {
      await createStore(formData);
      toast.success("Store created successfully!", {
        id: toastId,
        description: `${formData.name} has been added to the system.`,
      });
      router.push("/dashboard/admin/stores");
    } catch (error: unknown) {
      console.error("Error creating store:", error);
      toast.error("Failed to create store", {
        id: toastId,
        description: error instanceof Error ? error.message : "An error occurred while creating the store.",
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
            <Link href="/dashboard/admin/stores">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create Store</h1>
            <p className="text-muted-foreground">Add a new store to your system</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Store Details</CardTitle>
              <CardDescription>Enter the store information below</CardDescription>
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
                    name="enable_credit"
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
                    name="enable_stock_management"
                    checked={formData.enable_stock_management}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, enable_stock_management: !!checked }))
                    }
                  />
                  <Label htmlFor="enable_stock_management" className="font-normal">
                    Enable Stock Management
                  </Label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard/admin/stores">Cancel</Link>
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Create Store
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
                Store codes must be unique system-wide
              </p>
            </div>
            <div className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <p className="text-muted-foreground">
                You can add multiple locations to a store later
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Store Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Store className="h-4 w-4" />
              Features to Enable
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <CreditCard className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Credit / Naya</p>
                <p className="text-muted-foreground text-xs">
                  Essential for tracking customer debts and payments
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Package className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Stock Management</p>
                <p className="text-muted-foreground text-xs">
                  Keep track of inventory counts and movements
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
