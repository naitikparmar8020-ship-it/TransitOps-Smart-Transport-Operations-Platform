import { useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  MessageSquare,
  Moon,
  Sun,
  ChevronDown,
  User,
  Settings,
  LogOut,
  LifeBuoy,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { Avatar } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";
import { Dropdown, DropdownItem, DropdownLabel, DropdownSeparator } from "@/components/ui/dropdown";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
  onNotifClick: () => void;
  unread: number;
}

export function Navbar({ onMenuClick, onSearchClick, onNotifClick, unread }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-xl lg:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      <div className="lg:hidden">
        <Logo collapsed />
      </div>

      {/* Search */}
      <button
        onClick={onSearchClick}
        className="ml-auto flex h-10 w-full max-w-xs items-center gap-2.5 rounded-lg border border-input bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted lg:ml-0 lg:mr-auto"
      >
        <Search className="size-4" />
        <span className="hidden sm:inline">Search anything...</span>
        <kbd className="ml-auto hidden rounded border bg-background px-1.5 py-0.5 text-[10px] sm:block">
          ⌘K
        </kbd>
      </button>

      <div className="flex items-center gap-1">
        <Tooltip content="Messages">
          <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <MessageSquare className="size-5" />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-emerald" />
          </button>
        </Tooltip>

        <Tooltip content="Notifications">
          <button
            onClick={onNotifClick}
            className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Bell className="size-5" />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>
        </Tooltip>

        <Tooltip content={theme === "dark" ? "Light mode" : "Dark mode"}>
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>
        </Tooltip>

        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

        <Dropdown
          trigger={
            <button className="flex items-center gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-accent">
              <Avatar name={user?.name ?? "User"} color={user?.avatarColor} size="sm" />
              <div className="hidden text-left leading-tight sm:block">
                <p className="text-sm font-semibold">{user?.name ?? "User"}</p>
                <p className="text-[11px] text-muted-foreground">{user?.role ?? "Member"}</p>
              </div>
              <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
            </button>
          }
        >
          <DropdownLabel>My Account</DropdownLabel>
          <DropdownItem onClick={() => navigate("/app/settings")}>
            <User /> Profile
          </DropdownItem>
          <DropdownItem onClick={() => navigate("/app/settings")}>
            <Settings /> Settings
          </DropdownItem>
          <DropdownItem>
            <LifeBuoy /> Support
          </DropdownItem>
          <DropdownSeparator />
          <div className="flex items-center justify-between px-3 py-2 text-sm">
            <span className="flex items-center gap-2.5">
              <Moon className="size-4 text-muted-foreground" /> Dark mode
            </span>
            <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
          </div>
          <DropdownSeparator />
          <DropdownItem
            className="text-destructive hover:bg-destructive/10 [&_svg]:text-destructive"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            <LogOut /> Log out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
