import { Check, Moon, Sun, SunMoon } from 'lucide-react'

import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { useTheme } from './theme-provider'

function ThemeIcon({ resolvedTheme }: { resolvedTheme: 'light' | 'dark' }) {
  if (resolvedTheme === 'dark') {
    return <Moon className='h-4 w-4' />
  }

  return <Sun className='h-4 w-4' />
}

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' aria-label='Toggle theme'>
          <ThemeIcon resolvedTheme={resolvedTheme} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Reading Mode</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='justify-between' onSelect={() => setTheme('light')}>
          <span className='inline-flex items-center gap-2'>
            <Sun className='h-4 w-4' /> Day
          </span>
          {theme === 'light' ? <Check className='h-4 w-4' /> : null}
        </DropdownMenuItem>
        <DropdownMenuItem className='justify-between' onSelect={() => setTheme('dark')}>
          <span className='inline-flex items-center gap-2'>
            <Moon className='h-4 w-4' /> Night
          </span>
          {theme === 'dark' ? <Check className='h-4 w-4' /> : null}
        </DropdownMenuItem>
        <DropdownMenuItem className='justify-between' onSelect={() => setTheme('system')}>
          <span className='inline-flex items-center gap-2'>
            <SunMoon className='h-4 w-4' /> System
          </span>
          {theme === 'system' ? <Check className='h-4 w-4' /> : null}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
