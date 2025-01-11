'use client'
import { useAppContext } from '@/components/app-provider'
import { Role } from '@/constants/type'
import { cn, handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { RoleType } from '@/types/jwt.types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const menuItems: Array<{
  title: string
  href: string
  role?: RoleType[]
  hideWhenLogin?: boolean
  authRequired?: boolean
}> = [
  {
    title: 'Trang chủ',
    href: '/',
  },
  {
    title: 'Menu',
    href: '/guest/menu',
    role: [Role.Guest],
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    hideWhenLogin: true,
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    role: [Role.Owner, Role.Employee],
  },
]

export default function NavItems({ className }: { className?: string }) {
  const { role } = useAppContext()
  const logoutMutation = useLogoutMutation()
  const { setRole } = useAppContext()
  const router = useRouter()
  const logout = async () => {
    if (logoutMutation.isPending) return
    try {
      await logoutMutation.mutateAsync()
      setRole()
      router.push('/')
    } catch (error: any) {
      handleErrorApi({
        error,
      })
    }
  }
  return (
    <>
      <>
        {menuItems.map((item) => {
          // Trường hợp đăng nhập thì chỉ hiển thụ menu đăng nhập
          const isAuth = item.role && role && item.role.includes(role)
          // Trường hợp menu item có thể hiển thị cho dù chưa đăng nhập hay chưa
          const canShow =
            (item.role === undefined && !item.hideWhenLogin) ||
            (!role && item.hideWhenLogin)
          if (isAuth || canShow) {
            return (
              <Link href={item.href} key={item.href} className={className}>
                {item.title}
              </Link>
            )
          }

          return null
        })}
      </>
      {role && (
        <div className={cn(className, 'cursor-pointer')} onClick={logout}>
          Đăng xuất
        </div>
      )}
    </>
  )
}
