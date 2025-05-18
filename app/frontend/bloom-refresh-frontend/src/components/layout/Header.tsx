"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { Menu, X, Leaf } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-200",
      isScrolled ? "bg-background/95 backdrop-blur-sm border-b" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Leaf className="h-6 w-6 text-green-500" />
            <span className={cn(
              "transition-colors duration-200",
              isScrolled ? "text-foreground" : "text-foreground"
            )}>
              Bloom Refresh
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu className="hidden md:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/events">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Find Events
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>About</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 w-[400px]">
                    <li>
                      <Link href="/about/mission">
                        <NavigationMenuLink className="block p-2 hover:bg-accent rounded-md">
                          <div className="font-medium">Our Mission</div>
                          <div className="text-sm text-muted-foreground">Learn about our goals and impact</div>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/about/team">
                        <NavigationMenuLink className="block p-2 hover:bg-accent rounded-md">
                          <div className="font-medium">Our Team</div>
                          <div className="text-sm text-muted-foreground">Meet the people behind Bloom Refresh</div>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/about/faq">
                        <NavigationMenuLink className="block p-2 hover:bg-accent rounded-md">
                          <div className="font-medium">FAQ</div>
                          <div className="text-sm text-muted-foreground">Frequently asked questions</div>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/dashboard">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button variant="default" size="sm" className="bg-green-500 hover:bg-green-600 text-white">
              Sign Up
            </Button>
            <Button variant="outline" size="sm">
              Log In
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <div className="container py-4 px-4 flex flex-col gap-4">
            <Link href="/events" className="py-2 px-4 hover:bg-accent rounded-md" onClick={() => setMobileMenuOpen(false)}>
              Find Events
            </Link>
            <Link href="/about/mission" className="py-2 px-4 hover:bg-accent rounded-md" onClick={() => setMobileMenuOpen(false)}>
              Our Mission
            </Link>
            <Link href="/about/team" className="py-2 px-4 hover:bg-accent rounded-md" onClick={() => setMobileMenuOpen(false)}>
              Our Team
            </Link>
            <Link href="/about/faq" className="py-2 px-4 hover:bg-accent rounded-md" onClick={() => setMobileMenuOpen(false)}>
              FAQ
            </Link>
            <Link href="/dashboard" className="py-2 px-4 hover:bg-accent rounded-md" onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </Link>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white" onClick={() => setMobileMenuOpen(false)}>
                Sign Up
              </Button>
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => setMobileMenuOpen(false)}>
                Log In
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;