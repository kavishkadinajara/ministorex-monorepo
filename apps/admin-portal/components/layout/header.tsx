"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@ministorex/ui/components/avatar";
import { Button } from "@ministorex/ui/components/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@ministorex/ui/components/dropdown-menu";
import { Input } from "@ministorex/ui/components/input";
import { Skeleton } from "@ministorex/ui/components/skeleton";
import { createClient } from "@ministorex/database/client";
import {
    Bell,
    ChevronDown,
    LogOut,
    Menu,
    Moon,
    Search,
    Settings,
    Store,
    Sun,
    User,
} from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { user, loading, signOut } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  const [stores, setStores] = React.useState<{ id: string; name: string }[]>([]);
  const [currentStore, setCurrentStore] = React.useState<string>("Select Store");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch user's accessible stores
  React.useEffect(() => {
    async function fetchStores() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("stores")
          .select("id, name")
          .eq("is_active", true)
          .limit(10);

        // Silently handle errors (table may not exist yet)
        if (error) {
          console.warn("Could not fetch stores:", error.message);
          return;
        }

        if (data && data.length > 0) {
          setStores(data);
          setCurrentStore(data[0].name);
        }
      } catch (err) {
        // Ignore errors - stores table might not exist yet
        console.warn("Stores fetch failed:", err);
      }
    }

    if (user) {
      fetchStores();
    }
  }, [user]);

  const getInitials = () => {
    if (!user?.email) return "U";
    return user.email.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-2 md:gap-4 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-4 md:px-6">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden shrink-0"
        onClick={onMenuToggle}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Store Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex gap-2 min-w-[120px] md:min-w-[180px]">
            <Store className="h-4 w-4 text-primary" />
            <span className="truncate">{currentStore}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
          <DropdownMenuLabel>Switch Store</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {stores.map((store) => (
            <DropdownMenuItem
              key={store.id}
              className="cursor-pointer"
              onClick={() => setCurrentStore(store.name)}
            >
              <Store className="mr-2 h-4 w-4" />
              {store.name}
            </DropdownMenuItem>
          ))}
          {stores.length === 0 && (
            <DropdownMenuItem disabled>No stores available</DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-primary">
            <span className="font-medium">+ Add New Store</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Search Bar - Hidden on very small screens */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-10 bg-background"
          />
        </div>
      </div>

      {/* Mobile Search Icon */}
      <Button variant="ghost" size="icon" className="sm:hidden shrink-0">
        <Search className="h-5 w-5" />
      </Button>

      {/* Spacer for mobile */}
      <div className="flex-1 sm:hidden" />

      {/* Right Actions */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* Theme Toggle */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative shrink-0"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative shrink-0">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
            3
          </span>
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User Menu */}
        {loading ? (
          <Skeleton className="h-9 w-9 rounded-full" />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full shrink-0">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt="User" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.user_metadata?.full_name || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={signOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
