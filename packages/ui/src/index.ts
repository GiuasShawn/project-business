// Design system primitives
export { Button, type ButtonProps } from './button.js'
export { Icon, type IconName, type IconProps } from './icon.js'
export { Wordmark, type WordmarkProps } from './wordmark.js'

// Shell layout components
export {
  ShellProvider,
  useShell,
  Shell,
  Sidebar,
  SidebarWrapper,
  TopBar,
  MobileNav,
  NavItem,
  NavGroup,
} from './shell/index.js'
export type {
  ShellProviderProps,
  ShellContextValue,
  ShellProps,
  SidebarProps,
  SidebarWrapperProps,
  TopBarProps,
  MobileNavProps,
  MobileNavItem,
  NavItemProps,
  NavItemData,
  NavGroupProps,
} from './shell/index.js'
