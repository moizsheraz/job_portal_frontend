"use client"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Home } from "lucide-react"
import { 
  Menu, ChevronDown, Bookmark, Briefcase, Calculator, Building2, LogIn, 
  Search, Bell, User, Heart, LogOut, Group, LucideIcon, MessageCircle,
  Paperclip,BookOpen,
  Newspaper,Contact,
} from "lucide-react"
import { io } from "socket.io-client"

import {
  NavigationMenu, NavigationMenuContent, NavigationMenuItem,
  NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { userService } from "@/app/services/userService"
import { usePathname } from "next/navigation"

// Types
interface CategoryItem {
  title: string
  href: string
  description: string
  icon: LucideIcon
}

interface JobItem {
  title: string
  href: string
}

interface NavLink {
  title: string
  href: string
  icon: LucideIcon
}

interface UserData {
  name?: string
  given_name?: string
  family_name?: string
  email?: string
  picture?: string
}

interface AuthState {
  isAuthenticated: boolean
  user: UserData | null
  loading: boolean
}

// Data
const categories: CategoryItem[] = [
  {
    title: "White-Collar Jobs",
    href: "#",
    description: "Professional roles in office environments",
    icon: Building2,
  },
  {
    title: "Vocational Jobs",
    href: "#",
    description: "Skilled trades and hands-on careers",
    icon: Briefcase,
  },
 
]

const professionalJobs: JobItem[] = [
  { title: "Education/Training", href: "#" },
  { title: "Healthcare/Medical/Research", href: "#" },
  { title: "General Business", href: "#" },
  { title: "Accounting/Finance/Banking", href: "#" },
  { title: "Mining/Petroleum/Gas", href: "#" },
  { title: "Shipping/Aviation", href: "#" },
  { title: "Agro-Business/Agriculture", href: "#" },
  { title: "Legal Practice and Management", href: "#" },
  { title: "Construction/Building", href: "#" },
  { title: "Management/Executive Jobs", href: "#" },
  { title: "Operations", href: "#" },
  { title: "Information Technology (IT)", href: "#" },
  { title: "Music/Entertainment", href: "#" },
  { title: "Sales/Marketing", href: "#" },
  { title: "Transportation/Telecommunication", href: "#" },
  { title: "Human Resources/Recruitment", href: "#" },
  { title: "Hotel/Restaurant", href: "#" },
  { title: "Government Jobs", href: "#" },
  { title: "Engineering/Manufacturing", href: "#" },
  { title: "Journalism/Media", href: "#" },
  { title: "Customer Service/Secretarial", href: "#" },
  { title: "Security/Law Enforcement", href: "#" },
  { title: "Not-for-Profit/Religious Org.", href: "#" },
  { title: "Work from Home", href: "#" },
  { title: "Other Jobs", href: "#" },
]

const vocationalJobs: JobItem[] = [
  { title: "Fashion Designing", href: "#" },
  { title: "Cleaning", href: "#" },
  { title: "Carpentry", href: "#" },
  { title: "Car Mechanics", href: "#" },
  { title: "HVAC - Air Conditioning", href: "#" },
  { title: "Driving", href: "#" },
  { title: "Roofing", href: "#" },
  { title: "Windows", href: "#" },
  { title: "Masonry", href: "#" },
  { title: "Painting", href: "#" },
  { title: "Remodeling", href: "#" },
  { title: "Plumbing", href: "#" },
  { title: "Hair Dressing", href: "#" },
  { title: "Electrical", href: "#" },
  { title: "Landscaping", href: "#" },
  { title: "Caregiving", href: "#" },
  { title: "Laborers", href: "#" },
  { title: "Handyman", href: "#" },
  { title: "Other Vocational Jobs", href: "#" },
]

const navLinks: NavLink[] = [
  {title: "Home", href: "/", icon: Home},
  { title: "Contact Us", href: "/contact", icon: Contact },
  { title: "About Us", href: "/about", icon: BookOpen  },
]

// Main navigation items
const mainNavItems = [
  {
    title: "Employers Post Job",
    href: "/post-job",
    requiresAuth: true,
    icon: Briefcase
  },
  {
    title: "Browse Professional Jobs",
    href: "/search",
    requiresAuth: false,
    icon: Search
  },
  {
    title: "Freelancers Post Job",
    href: "/post-job",
    requiresAuth: true,
    icon: Paperclip
  },
  {
    title: "Find Freelancers",
    href: "/freelancers",
    requiresAuth: false,
    icon: User
  }
]

// Components
interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  title: string
  icon?: LucideIcon
}

const ListItem = React.forwardRef<React.ElementRef<"a">, ListItemProps>(
  ({ className, title, children, icon: Icon, ...props }, ref) => (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1   text-[#00214D] hover:text-white rounded-xl p-3 leading-none no-underline outline-none transition-all hover:bg-[#00214D] hover:text-white focus:bg-accent focus:text-accent-foreground group font-bold text-[#00214D]",
            className,
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 opacity-70 group-hover:opacity-100" />}
            <div className="text-sm font-bold leading-none">{title}</div>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  )
)
ListItem.displayName = "ListItem"

interface MobileAccordionProps {
  title: string
  items: JobItem[]
  icon?: LucideIcon
}

function MobileAccordion({ title, items, icon: Icon }: MobileAccordionProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const id = React.useId()
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = React.useState(0)

  React.useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? contentRef.current.scrollHeight : 0)
    }
  }, [isOpen, items])

  return (
    <div className="border-b border-gray-100 pb-2">
      <button
        className="flex w-full items-center justify-between py-3 text-left font-bold bg-[#00214D] text-white group rounded-lg px-3 hover:bg-[#00214D] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={id}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-[#34A853] opacity-70 group-hover:opacity-100" />}
          <span className="group-hover:text-white transition-colors">{title}</span>
        </div>
        <ChevronDown
          className={cn("h-5 w-5 transition-transform duration-300 text-[#34A853]", isOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      <div 
        className="overflow-hidden transition-all duration-300" 
        style={{ maxHeight: contentHeight }}
      >
        <div ref={contentRef} className="mt-2 ml-4 space-y-1" id={id}>
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="block py-2 text-sm text-[#00214D] hover:text-white transition-colors rounded-lg px-3 hover:bg-[#00214D] font-bold"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="relative overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-110">
        <Image 
          src="/logo.png" 
          alt="ALL JOBS Logo" 
          width={70} 
          height={70} 
          priority 
          className="transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <span className="font-bold text-2xl tracking-tight">
  <span className="text-blue-600">A</span>
  <span className="text-green-600">LL</span>
  <span className="text-yellow-500">JOBS</span>
  <span className="text-red-600">GH</span>
</span>

    </Link>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [authState, setAuthState] = React.useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true
  })
  const [userRole, setUserRole] = React.useState<string | null>(null);
  const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    autoConnect: true,
    path: '/socket.io',
    extraHeaders: {
      'Access-Control-Allow-Credentials': 'true'
    }
  });
  // Fetch authentication status
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/check-auth`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setAuthState({
            isAuthenticated: data.isAuthenticated,
            user: data.user,
            loading: false
          });
        } else {
          setAuthState({ isAuthenticated: false, user: null, loading: false });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthState({ isAuthenticated: false, user: null, loading: false });
      }
    };
    
    checkAuth();
  }, []);

  // Scroll event handler with throttling
  React.useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  React.useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = await userService.getCurrentUser();
        console.log(currentUser.role);
        setUserRole(currentUser.role);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
  
    fetchCurrentUser();
  }, []);

  // Helper functions
  const getUserInitials = (): string => {
    if (!authState.user) return "?";
    
    const given = authState.user.given_name || "";
    const family = authState.user.family_name || "";
    
    return `${given.charAt(0)}${family.charAt(0)}`;
  };

  // User menu components
  const UserMenuAuthenticated = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="p-0 h-auto hover:bg-transparent focus:bg-transparent rounded-full overflow-hidden"
          aria-label="User menu"
        >
          <Avatar className="h-10 w-10 border-2 border-[#34A853] transition-all hover:border-[#2E974A]">
            <AvatarImage src={authState.user?.picture} alt={authState.user?.name || "User"} />
            <AvatarFallback className="bg-[#34A853] text-white">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg">
        <div className="flex items-center gap-2 p-3 border-b border-gray-100 bg-[#00214D] text-white rounded-t-xl">
          <Avatar className="h-10 w-10">
            <AvatarImage src={authState.user?.picture} alt={authState.user?.name || "User"} />
            <AvatarFallback className=" text-white">{getUserInitials()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold">{authState.user?.name}</span>
            <span className="text-xs text-gray-300 truncate">{authState.user?.email}</span>
          </div>
        </div>
        <DropdownMenuItem asChild className="rounded-lg m-1 hover:bg-[#00214D] hover:text-white font-bold text-[#00214D]">
          <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
            <User className="h-4 w-4 " />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        {userRole === "recruiter" && ( 
          <DropdownMenuItem asChild className="rounded-lg m-1 hover:bg-[#00214D] hover:text-white font-bold text-[#00214D]">
            <Link href={`/company`} className="flex items-center gap-2 cursor-pointer">
              <Group className="h-4 w-4 " />
              <span>My Company</span>
            </Link>
          </DropdownMenuItem>
        )}
           {userRole === "recruiter" && ( 
          <DropdownMenuItem asChild className="rounded-lg m-1 hover:bg-[#00214D] hover:text-white font-bold text-[#00214D]">
            <Link href={`/my-jobs`} className="flex items-center gap-2 cursor-pointer">
              <Briefcase className="h-4 w-4 " />
              <span>My Jobs</span>
            </Link>
          </DropdownMenuItem>
        )}
       

       <DropdownMenuItem asChild className="rounded-lg m-1 hover:bg-[#00214D] hover:text-white font-bold text-[#00214D]">
          <Link href={`/build-resume`} className="flex items-center gap-2 cursor-pointer">
            <Newspaper  className="h-4 w-4" />
            <span>Build Resume</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="rounded-lg m-1 hover:bg-[#00214D] hover:text-white font-bold text-[#00214D]">
          <Link href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/logout`} className="flex items-center gap-2 cursor-pointer">
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Link>
        </DropdownMenuItem>
     
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const UserMenuGuest = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="hidden sm:flex">
        <Button 
          variant="ghost" 
          className="bg-[#00214D] text-white hover:text-white hover:bg-[#00214D] transition-colors flex items-center gap-1 rounded-full px-5 py-6 font-bold"
          aria-label="User menu"
        >
          <User className="h-5 w-5" />
          <span className="hidden lg:inline-block">Account</span>
          <ChevronDown className="h-5 w-5 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg">
        <DropdownMenuItem asChild className="rounded-lg m-1 hover:bg-[#00214D] hover:text-white font-bold text-[#00214D]">
          <Link href="/login" className="flex items-center gap-2 cursor-pointer">
            <LogIn className="h-4 w-4 text-[#34A853]" />
            <span>Sign In</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-lg m-1 hover:bg-[#00214D] hover:text-white font-bold text-[#00214D]">
          <Link href="/signup" className="flex items-center gap-2 cursor-pointer">
            <User className="h-4 w-4 text-[#34A853]" />
            <span>Create Account</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderUserMenu = () => {
    if (authState.loading) {
      return (
        <Button variant="ghost" size="icon" disabled className="rounded-full">
          <User className="h-5 w-5" />
        </Button>
      );
    }

    return authState.isAuthenticated && authState.user 
      ? <UserMenuAuthenticated /> 
      : <UserMenuGuest />;
  };

  // Render main navigation items with auth checks
  const renderMainNavItems = () => {
    return mainNavItems.map((item) => {
      // if (item.requiresAuth && !authState.isAuthenticated) {
      //   return null; // Skip rendering if auth is required but user is not authenticated
      // }
      return (
        <Link
          key={item.title}
          href={item.href}
          className={cn(
            "flex items-center gap-1 px-4 py-2 rounded-full font-bold transition-colors",
            pathname === item.href
              ? "bg-[#00214D] text-white"
              : "text-[#00214D] hover:bg-[#00214D] hover:text-white"
          )}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.title}</span>
        </Link>
      );
    });
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-white transition-all duration-300",
        isScrolled ? "shadow-lg border-transparent backdrop-blur-lg bg-white/90" : "shadow-md"
      )}
      role="banner"
    >
      <div className="container flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden relative overflow-hidden group rounded-full text-[#00214D]"
                aria-label="Open menu"
              >
                <Menu className="h-7 w-7 transition-transform group-hover:scale-110 group-hover:text-[#34A853]" />
                <span className="absolute inset-0 rounded-full bg-[#34A853]/10 scale-0 group-hover:scale-100 transition-transform" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] border-r-[#34A853]/20 rounded-r-2xl bg-white">
              <div className="flex flex-col gap-6 py-4">
                <Logo />
                
                <div className="relative w-full mb-4">
                  <Input 
                    type="search" 
                    placeholder="Search jobs..." 
                    className="pl-10 pr-4 py-3 rounded-full border-[#34A853] focus:border-[#34A853] focus:ring-[#34A853] text-[#00214D] font-bold"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                
                <nav className="flex flex-col space-y-4 overflow-y-auto max-h-[calc(100vh-250px)]">
                  {/* Render main nav items in mobile menu */}
                  {mainNavItems.map((item) => {
                    if (item.requiresAuth && !authState.isAuthenticated) return null;
                    return (
                      <Link
                        key={item.title}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2 py-3 px-3 text-[#00214D] hover:text-white hover:bg-[#00214D] transition-colors group rounded-lg font-bold",
                          pathname === item.href && "bg-[#00214D] text-white"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5 opacity-70 transition-colors",
                            pathname === item.href ? "text-white" : "text-[#00214D] group-hover:text-white"
                          )}
                        />
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}

                  {/* <MobileAccordion
                    title="Job Categories"
                    items={categories.map((c) => ({ title: c.title, href: c.href }))}
                    icon={Briefcase}
                  />
                  <MobileAccordion title="Professional Jobs" items={professionalJobs} icon={Building2} />
                  <MobileAccordion title="Vocational Jobs" items={vocationalJobs} icon={User} /> */}

                  {navLinks.map((link) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-2 py-3 px-3 text-[#00214D] hover:text-white hover:bg-[#00214D] transition-colors group rounded-lg font-bold",
                        pathname === link.href && "bg-[#00214D] text-white"
                      )}
                    >
                      <link.icon
                        className={cn(
                          "h-5 w-5 opacity-70 transition-colors",
                          pathname === link.href ? "text-white" : "text-[#00214D] group-hover:text-white"
                        )}
                      />
                      <span>{link.title}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <Logo />
        </div>

        {/* Desktop Navigation */}
        {/* <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-1">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent data-[state=open]:bg-[#00214D] data-[state=open]:text-white hover:bg-[#00214D] hover:text-white transition-all rounded-full text-[#00214D] font-bold text-base py-6 px-5">
                Job Categories
              </NavigationMenuTrigger>
              <NavigationMenuContent className="rounded-xl overflow-hidden shadow-lg">
                <ul className="grid w-[400px] text-2xl gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white">
                  {categories.map((category) => (
                    <ListItem 
                      key={category.title} 
                      title={category.title} 
                      href={"/search"}
                      icon={category.icon}
                    >
                      {category.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent data-[state=open]:bg-[#00214D] data-[state=open]:text-white hover:bg-[#00214D] hover:text-white transition-all rounded-full text-[#00214D] font-bold text-base py-6 px-5">
                Professional Jobs
              </NavigationMenuTrigger>
              <NavigationMenuContent className="rounded-xl overflow-hidden shadow-lg">
                <ul className="grid gap-3 p-4 text-2xl md:w-[400px] lg:w-[600px] lg:grid-cols-2 xl:w-[800px] xl:grid-cols-3 bg-white">
                  {professionalJobs.map((job) => (
                    <ListItem key={job.title} title={job.title} href={"/search"} />
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent data-[state=open]:bg-[#00214D] data-[state=open]:text-white hover:bg-[#00214D] hover:text-white transition-all rounded-full text-[#00214D] font-bold text-base py-6 px-5">
                Vocational Jobs
              </NavigationMenuTrigger>
              <NavigationMenuContent className="rounded-xl overflow-hidden shadow-lg">
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[600px] lg:grid-cols-2 xl:w-[800px] xl:grid-cols-3 bg-white">
                  {vocationalJobs.map((job) => (
                    <ListItem key={job.title} title={job.title} href={"/search"} />
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuViewport className="origin-top-center rounded-xl overflow-hidden shadow-lg" />
        </NavigationMenu> */}

        {/* Right Side Utility Links */}
        <div className="flex items-center gap-3">
          {/* Main Navigation Links */}
          <nav className="hidden md:flex items-center gap-4" aria-label="Main navigation">
            {renderMainNavItems()}
          </nav>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-4" aria-label="Utility navigation">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className={cn(
                  "relative group px-4 py-3 rounded-full text-base font-bold transition-colors",
                  pathname === link.href
                    ? "bg-[#00214D] text-white"
                    : "text-[#00214D] hover:text-white hover:bg-[#00214D]"
                )}
              >
                <link.icon
                  className={cn(
                    "h-6 w-6 opacity-70 transition-colors",
                    pathname === link.href ? "text-white" : "text-[#00214D] group-hover:text-white"
                  )}
                />
                <span className="absolute inset-0 rounded-full" />
              </Link>
            ))}
          </nav>

          {/* Notification and Chat Icons - Desktop */}
          {authState.isAuthenticated && (
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/notifications"
                aria-label="Notifications"
                className="relative p-2 rounded-full text-[#00214D] hover:bg-[#00214D] hover:text-white transition-colors"
              >
                <Bell size={28} />
                <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full" />
              </Link>
              <Link
                href="/indox"
                aria-label="Messages"
                className="relative p-2 rounded-full text-[#00214D] hover:bg-[#00214D] hover:text-white transition-colors"
              >
                <MessageCircle size={28} />
              </Link>
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {renderUserMenu()}
          </div>
        </div>
      </div>
    </header>
  )
}