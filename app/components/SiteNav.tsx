import Link from "next/link";
import Image from "next/image";

type NavKey = "home" | "vendors" | "dispatches";

const links: { href: string; label: string; key: NavKey }[] = [
  { href: "/vendors", label: "Vendors", key: "vendors" },
  { href: "/dispatches", label: "Dispatches", key: "dispatches" },
];

export default function SiteNav({ active }: { active?: NavKey }) {
  return (
    <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/raven-sigil.png"
          alt="GZW Armory"
          width={36}
          height={36}
          className="object-contain"
        />
        <span className="text-2xl font-bold tracking-tight text-white">
          GZW <span className="text-amber-500">Armory</span>
        </span>
        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-mono">
          pre-0.5
        </span>
      </Link>
      <div className="flex items-center gap-6 text-sm text-gray-400">
        {links.map((link) => (
          <Link
            key={link.key}
            href={link.href}
            className={
              active === link.key
                ? "text-white font-medium"
                : "hover:text-white transition-colors"
            }
          >
            {link.label}
          </Link>
        ))}
        <a
          href="https://github.com/DarkTidings20/gzwarmory"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors hidden sm:inline"
        >
          GitHub
        </a>
      </div>
    </nav>
  );
}
