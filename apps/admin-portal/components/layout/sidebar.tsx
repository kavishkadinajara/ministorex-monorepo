"use client";

import { Button } from "@ministorex/ui/components/button";
import { ScrollArea } from "@ministorex/ui/components/scroll-area";
import { cn } from "@ministorex/ui/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
    BarChart3,
    Building2,
    ChevronDown,
    CreditCard,
    LayoutDashboard,
    MapPin,
    Package,
    Settings,
    Shield,
    ShoppingCart,
    Store,
    UserCog,
    Users,
    X,
    Zap,
    type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

// ============================================
// Types
// ============================================
interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface NavGroup {
  name: string;
  icon: LucideIcon;
  items: NavItem[];
}

// ============================================
// Static Navigation
// ============================================
const staticNavGroups: NavGroup[] = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    items: [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    name: "Store",
    icon: Store,
    items: [
      { name: "POS / Sales", href: "/dashboard/pos", icon: ShoppingCart },
    ],
  },
  {
    name: "Inventory",
    icon: Package,
    items: [
      { name: "Products", href: "/dashboard/inventory/products", icon: Package },
    ],
  },
  {
    name: "Customers",
    icon: Users,
    items: [
      { name: "Customer List", href: "/dashboard/customers", icon: Users },
    ],
  },
  {
    name: "Credit",
    icon: CreditCard,
    items: [
      { name: "Credit Ledger", href: "/dashboard/credit", icon: CreditCard },
    ],
  },
  {
    name: "Reports",
    icon: BarChart3,
    items: [
      { name: "Sales Report", href: "/dashboard/reports", icon: BarChart3 },
    ],
  },
  {
    name: "Administration",
    icon: Settings,
    items: [
      { name: "Stores", href: "/dashboard/admin/stores", icon: Building2 },
      { name: "Locations", href: "/dashboard/admin/locations", icon: MapPin },
      { name: "Users", href: "/dashboard/admin/users", icon: UserCog },
      { name: "Roles", href: "/dashboard/admin/roles", icon: Shield },
      { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
    ],
  },
];

// ============================================
// Sidebar Context
// ============================================
interface SidebarContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SidebarContext = React.createContext<SidebarContextType>({
  open: false,
  setOpen: () => {},
});

// ============================================
// Menu Item Component
// ============================================
function SidebarMenuItem({
  group,
  isActive,
}: {
  group: NavGroup;
  isActive: boolean;
}) {
  const { open } = React.useContext(SidebarContext);
  const pathname = usePathname();
  const [expanded, setExpanded] = React.useState(false);
  const Icon = group.icon;

  // Single item - direct link
  if (group.items.length === 1) {
    return (
      <Link href={group.items[0].href}>
        <motion.div
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer",
            isActive
              ? "bg-white/20 text-white"
              : "text-white/70 hover:bg-white/10 hover:text-white"
          )}
        >
          <Icon className="h-5 w-5 shrink-0" />
          <motion.span
            animate={{
              opacity: open ? 1 : 0,
              width: open ? "auto" : 0,
            }}
            className="text-sm font-medium whitespace-nowrap overflow-hidden"
          >
            {group.name}
          </motion.span>
        </motion.div>
      </Link>
    );
  }

  // Multiple items - expandable group
  return (
    <div>
      <motion.div
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer",
          isActive
            ? "bg-white/20 text-white"
            : "text-white/70 hover:bg-white/10 hover:text-white"
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <motion.span
          animate={{
            opacity: open ? 1 : 0,
            width: open ? "auto" : 0,
          }}
          className="text-sm font-medium whitespace-nowrap overflow-hidden flex-1"
        >
          {group.name}
        </motion.span>
        {open && (
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 transition-transform",
              expanded && "rotate-180"
            )}
          />
        )}
      </motion.div>

      {/* Sub-items */}
      <AnimatePresence>
        {expanded && open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-8 pr-3 py-1 space-y-1">
              {group.items.map((item) => {
                const ItemIcon = item.icon;
                const itemActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                        itemActive
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <ItemIcon className="h-4 w-4 shrink-0" />
                      <span className="whitespace-nowrap">{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// Desktop Sidebar
// ============================================
export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <motion.aside
        className="hidden md:flex fixed left-0 top-0 h-screen flex-col bg-gradient-to-b from-primary via-primary to-accent"
        animate={{
          width: open ? "260px" : "72px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        style={{ zIndex: 50 }}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-white/10 px-3">
          <Link href="/dashboard" className="flex items-center gap-3 w-full">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white shadow-lg">
              <Store className="h-6 w-6" />
            </div>
            <motion.span
              animate={{
                opacity: open ? 1 : 0,
                width: open ? "auto" : 0,
              }}
              className="text-white font-bold text-lg whitespace-nowrap overflow-hidden"
            >
              MiniStoreX
            </motion.span>
          </Link>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4 px-3">
          <nav className="space-y-1">
            {staticNavGroups.map((group, index) => {
              const isActive = group.items.some(
                (item) =>
                  pathname === item.href || pathname.startsWith(item.href + "/")
              );
              return (
                <React.Fragment key={group.name}>
                  <SidebarMenuItem group={group} isActive={isActive} />
                  {(index === 0 || index === 5) && (
                    <div className="my-3 h-px bg-white/20" />
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Bottom */}
        <div className="border-t border-white/10 p-3">
          <motion.div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer">
            <Zap className="h-5 w-5 shrink-0" />
            <motion.span
              animate={{
                opacity: open ? 1 : 0,
                width: open ? "auto" : 0,
              }}
              className="text-sm font-medium whitespace-nowrap overflow-hidden"
            >
              Quick Actions
            </motion.span>
          </motion.div>
        </div>
      </motion.aside>
    </SidebarContext.Provider>
  );
}

// ============================================
// Mobile Sidebar
// ============================================
export function MobileSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 md:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed left-0 top-0 z-50 h-screen w-[280px] flex flex-col bg-gradient-to-b from-primary via-primary to-accent md:hidden"
          >
            <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
              <Link
                href="/dashboard"
                className="flex items-center gap-3"
                onClick={onClose}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white shadow-lg">
                  <Store className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold text-white">MiniStoreX</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-9 w-9 text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <ScrollArea className="flex-1 py-4 px-3">
              <nav className="space-y-1">
                {staticNavGroups.map((group, groupIndex) => (
                  <React.Fragment key={group.name}>
                    {groupIndex > 0 && <div className="my-3 h-px bg-white/20" />}
                    <h4 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-white/50">
                      {group.name}
                    </h4>
                    {group.items.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        pathname.startsWith(item.href + "/");
                      const Icon = item.icon;
                      return (
                        <Link key={item.href} href={item.href} onClick={onClose}>
                          <div
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                              isActive
                                ? "bg-white/20 text-white"
                                : "text-white/70 hover:bg-white/10 hover:text-white"
                            )}
                          >
                            <Icon className="h-5 w-5" />
                            <span className="text-sm font-medium">{item.name}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </React.Fragment>
                ))}
              </nav>
            </ScrollArea>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
