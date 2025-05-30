'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

// import { Icons } from './Icons'

type MenuItem = {
  title: string
  href: string
  icon?: React.ReactNode
  items?: MenuItem[]
  description?: string
}

const mainMenuItems: MenuItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'About',
    href: '/about',
  },
  // {
  //   title: 'Settings',
  //   href: '/settings',
  //   icon: <Icons.Settings className="size-4" />,
  // },
]

export default function MainNavigation() {
  const pathname = usePathname()

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {mainMenuItems.map((item) => (
          <NavigationMenuItem key={item.title}>
            <NavigationMenuLink asChild>
              <Link
                href={item.href}
                className={cn(
                  navigationMenuTriggerStyle(),
                  'flex flex-row items-center gap-2',
                  pathname === item.href && 'bg-accent/100'
                )}
              >
                {item.icon && item.icon}
                <span>{item.title}</span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
