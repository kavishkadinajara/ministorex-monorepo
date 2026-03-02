"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@ministorex/ui/components/avatar";
import { Badge } from "@ministorex/ui/components/badge";
import { Button } from "@ministorex/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ministorex/ui/components/card";
import { Progress } from "@ministorex/ui/components/progress";
import {
    AlertTriangle,
    ArrowRight,
    Clock,
    CreditCard,
    DollarSign,
    Package,
    Plus,
    ShoppingCart,
    TrendingDown,
    TrendingUp,
    Users,
} from "lucide-react";

// Stats Card Component
function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  trend?: "up" | "down";
  trendValue?: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          {trend && (
            <span
              className={`flex items-center text-xs font-medium ${
                trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {trend === "up" ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {trendValue}
            </span>
          )}
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />
    </Card>
  );
}

// Recent Sale Item
function RecentSaleItem({
  customer,
  email,
  amount,
  time,
  avatar,
}: {
  customer: string;
  email: string;
  amount: string;
  time: string;
  avatar?: string;
}) {
  return (
    <div className="flex items-center gap-4 py-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatar} alt={customer} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {customer.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{customer}</p>
        <p className="text-sm text-muted-foreground truncate">{email}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-primary">{amount}</p>
        <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
          <Clock className="h-3 w-3" />
          {time}
        </p>
      </div>
    </div>
  );
}

// Low Stock Item
function LowStockItem({
  product,
  stock,
  maxStock,
}: {
  product: string;
  stock: number;
  maxStock: number;
}) {
  const percentage = (stock / maxStock) * 100;
  const isVeryLow = percentage < 20;

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium truncate">{product}</span>
        <Badge variant={isVeryLow ? "destructive" : "secondary"} className="text-xs">
          {stock} left
        </Badge>
      </div>
      <Progress value={percentage} className={isVeryLow ? "[&>div]:bg-destructive" : ""} />
    </div>
  );
}

// Quick Action Button
function QuickAction({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Button
      variant="outline"
      className="flex flex-col items-center justify-center h-24 gap-2 hover:bg-primary hover:text-primary-foreground transition-all group"
      onClick={onClick}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary-foreground/20">
        <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </Button>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-accent p-6 text-primary-foreground">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2">Welcome back, Admin! 👋</h1>
          <p className="text-primary-foreground/80 max-w-lg">
            Here&apos;s what&apos;s happening with your store today. You have{" "}
            <span className="font-semibold text-white">12 new orders</span> and{" "}
            <span className="font-semibold text-white">3 low stock alerts</span>.
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -right-5 -bottom-10 h-32 w-32 rounded-full bg-white/10" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Today's Sales"
          value="LKR 45,230"
          description="vs yesterday"
          icon={ShoppingCart}
          trend="up"
          trendValue="+12.5%"
        />
        <StatsCard
          title="Total Revenue"
          value="LKR 2.4M"
          description="This month"
          icon={DollarSign}
          trend="up"
          trendValue="+8.2%"
        />
        <StatsCard
          title="Active Customers"
          value="1,234"
          description="This month"
          icon={Users}
          trend="up"
          trendValue="+4.3%"
        />
        <StatsCard
          title="Products"
          value="486"
          description="In inventory"
          icon={Package}
          trend="down"
          trendValue="-2.1%"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Sales */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>Latest transactions from your store</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              <RecentSaleItem
                customer="Kamal Perera"
                email="kamal@example.com"
                amount="LKR 1,250"
                time="2 min ago"
              />
              <RecentSaleItem
                customer="Nimali Silva"
                email="nimali@example.com"
                amount="LKR 3,500"
                time="15 min ago"
              />
              <RecentSaleItem
                customer="Ruwan Fernando"
                email="ruwan@example.com"
                amount="LKR 890"
                time="1 hour ago"
              />
              <RecentSaleItem
                customer="Priya Jayawardena"
                email="priya@example.com"
                amount="LKR 2,100"
                time="2 hours ago"
              />
              <RecentSaleItem
                customer="Sunil Bandara"
                email="sunil@example.com"
                amount="LKR 5,670"
                time="3 hours ago"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Commonly used operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <QuickAction icon={ShoppingCart} label="New Sale" />
              <QuickAction icon={Plus} label="Add Product" />
              <QuickAction icon={Users} label="Add Customer" />
              <QuickAction icon={CreditCard} label="Record Payment" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Low Stock Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <CardTitle>Low Stock Alerts</CardTitle>
                <CardDescription>Products that need restocking</CardDescription>
              </div>
            </div>
            <Badge variant="destructive">3 items</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <LowStockItem product="Milo 400g Packet" stock={5} maxStock={50} />
              <LowStockItem product="Anchor Milk Powder 1kg" stock={8} maxStock={40} />
              <LowStockItem product="Sunlight Soap Bar" stock={12} maxStock={100} />
              <LowStockItem product="Rice 5kg Samba" stock={15} maxStock={60} />
              <LowStockItem product="Sugar 1kg" stock={20} maxStock={80} />
            </div>
          </CardContent>
        </Card>

        {/* Credit / Naya Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Credit Overview</CardTitle>
                <CardDescription>Outstanding naya balances</CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm">
              View Ledger
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Total Outstanding */}
              <div className="rounded-lg bg-primary/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Outstanding</span>
                  <span className="text-2xl font-bold text-primary">LKR 125,430</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <Badge variant="secondary">42 customers</Badge>
                  <span className="text-muted-foreground">with pending dues</span>
                </div>
              </div>

              {/* Top Debtors */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Top Pending</h4>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-orange-100 text-orange-600 text-xs">RP</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">Ranjith Perera</span>
                  </div>
                  <span className="font-semibold text-orange-600">LKR 15,200</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-orange-100 text-orange-600 text-xs">KJ</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">Kumari Jayasinghe</span>
                  </div>
                  <span className="font-semibold text-orange-600">LKR 12,800</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-orange-100 text-orange-600 text-xs">SM</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">Suresh Mendis</span>
                  </div>
                  <span className="font-semibold text-orange-600">LKR 9,450</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
