"use client";

import { Badge } from "@ministorex/ui/components/badge";
import { Button } from "@ministorex/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ministorex/ui/components/card";
import { Skeleton } from "@ministorex/ui/components/skeleton";
import { deleteLocation, getLocationById } from "@ministorex/database/api-stores";
import type { Location } from "@ministorex/database/types";
import {
    ArrowLeft,
    Building2,
    Calendar,
    MapPin,
    Pencil,
    Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

export default function LocationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [location, setLocation] = React.useState<Location | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    async function fetchLocation() {
      try {
        const data = await getLocationById(params.id as string);
        setLocation(data);
      } catch (error) {
        console.error("Error fetching location:", error);
        toast.error("Failed to load location");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchLocation();
    }
  }, [params.id]);

  const handleDelete = async () => {
    if (!location) return;
    if (!confirm("Are you sure you want to deactivate this location?")) return;

    setDeleting(true);
    const toastId = toast.loading("Deleting location...");

    try {
      await deleteLocation(location.id);
      toast.success("Location deleted", { id: toastId });
      router.push("/dashboard/admin/locations");
    } catch (error) {
      console.error("Error deleting location:", error);
      toast.error("Failed to delete location", { id: toastId });
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

  if (!location) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/admin/locations">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Location not found</h3>
            <p className="text-muted-foreground mb-4">The requested location could not be found</p>
            <Button asChild>
              <Link href="/dashboard/admin/locations">Back to Locations</Link>
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
              <Link href="/dashboard/admin/locations">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">{location.name}</h1>
                <Badge variant={location.is_active ? "default" : "secondary"}>
                  {location.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-muted-foreground font-mono">{location.code}</p>
            </div>
          </div>
          <div className="flex gap-2 ml-14 sm:ml-0">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/admin/locations/${location.id}/edit`}>
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

        {/* Location Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Location Information</CardTitle>
            <CardDescription>Details about this location</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Parent Store */}
            {location.store && (
              <>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Parent Store</p>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{location.store.name}</p>
                      <p className="text-sm text-muted-foreground font-mono">{location.store.code}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Description or other fields can go here */}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar - Right Side */}
      <div className="space-y-6 lg:mt-[88px]">
        {/* Address Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Address</CardTitle>
          </CardHeader>
          <CardContent>
            {location.address ? (
               <div className="flex items-start gap-3">
                 <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                 <p className="text-sm text-muted-foreground">{location.address}</p>
               </div>
            ) : (
                <p className="text-sm text-muted-foreground italic">No address provided</p>
            )}
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
              <span>Created: {new Date(location.created_at).toLocaleDateString()}</span>
            </div>
            {location.modified_at && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Modified: {new Date(location.modified_at).toLocaleDateString()}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
