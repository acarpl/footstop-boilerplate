'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const path = usePathname();

  const links = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Orders', href: '/admin/orders' },
    { name: 'Products', href: '/admin/products' },
  ];

  return (
    <aside className="w-64 bg-white border-r p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panels</h2>
      <ul className="space-y-2">
        {links.map(link => (
          <li key={link.name}>
            <Link href={link.href}>
              <span className={`block px-2 py-1 rounded cursor-pointer hover:bg-gray-200 ${path === link.href ? 'bg-gray-100 font-semibold' : ''}`}>
                {link.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
