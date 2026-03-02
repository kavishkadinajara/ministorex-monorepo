import { Button } from "@ministorex/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ministorex/ui/components/card";
import { ShoppingBag } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-4">
              <ShoppingBag className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">MiniStoreX Customer</CardTitle>
          <CardDescription>
            Browse products, place orders, and track deliveries
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button className="w-full" size="lg">
            Browse Products
          </Button>
          <Button variant="outline" className="w-full">
            Track My Orders
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-4">
            MiniStoreX Customer Web — Coming Soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
