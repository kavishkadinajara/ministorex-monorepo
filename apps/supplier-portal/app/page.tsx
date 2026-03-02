import { Button } from "@ministorex/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ministorex/ui/components/card";
import { Truck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Truck className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">MiniStoreX Supplier</CardTitle>
          <CardDescription>
            Manage product listings, orders, and deliveries
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button className="w-full" size="lg">
            View Orders
          </Button>
          <Button variant="outline" className="w-full">
            Manage Products
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-4">
            MiniStoreX Supplier Portal — Coming Soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
