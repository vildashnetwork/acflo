import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, ChevronUp, Menu, Network, Search, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { ActionLink, Button } from "./site";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Our Work", to: "/our-work" },
  { label: "Network", to: "/network" },
  { label: "Events", to: "/events" },
  { label: "News & Media", to: "/news" },
  { label: "Partners", to: "/partners" },
  { label: "Resources", to: "/resources" },
  { label: "Dashboard", to: "/dashboard" },
] as const;

const footerGroups = [
  {
    title: "Discover",
    links: [
      ["About ACFLO", "/about"],
      ["Our work", "/our-work"],
      ["The network", "/network"],
      ["Partners", "/partners"],
    ],
  },
  {
    title: "Explore",
    links: [
      ["Events", "/events"],
      ["News & stories", "/news"],
      ["Videos", "/videos"],
      ["Resources", "/resources"],
    ],
  },
  {
    title: "Get involved",
    links: [
      ["Join the network", "/join"],
      ["Contact us", "/contact"],
      ["Governance", "/governance"],
      ["Search", "/search"],
    ],
  },
  {
    title: "Organization",
    links: [
      ["Reactivation", "/reactivation"],
      ["Privacy policy", "/privacy"],
      ["Terms of use", "/terms"],
    ],
  },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <div className="bg-lime px-4 py-2.5 text-center text-[10px] font-extrabold uppercase tracking-[.14em] text-deep sm:text-[11px]">
        Locally led. Connected across Africa.
      </div>
      <header className="sticky top-3 z-40 mx-auto mt-3 w-[calc(100%-1.5rem)] max-w-[1280px] rounded-[2rem] border border-border/70 bg-background/95 shadow-[0_12px_40px_-20px_oklch(0.2_0.05_145/0.3)] backdrop-blur-xl sm:w-[calc(100%-2.5rem)] lg:rounded-full">
        <div className="flex h-[70px] items-center justify-between gap-3 px-4 sm:px-6 lg:h-[76px] lg:px-7">
          <Link
            to="/"
            aria-label="ACFLO home"
            className="flex min-w-0 shrink-0 items-center gap-2.5"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-deep text-lime">
              <Network size={21} strokeWidth={2.5} />
            </span>
            <span>
              <strong className="block font-display text-xl font-extrabold leading-none tracking-tight">
                ACFLO<span className="text-primary">.</span>
              </strong>
              <small className="mt-1 hidden text-[8px] font-bold uppercase tracking-[.13em] text-muted-foreground sm:block">
                Local organizations · Shared progress
              </small>
            </span>
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-1 xl:flex">
            {navItems.slice(0, 5).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                aria-current={pathname === item.to ? "page" : undefined}
                className={`rounded-full px-3.5 py-2.5 text-[13px] font-bold transition-colors ${
                  pathname === item.to
                    ? "bg-secondary text-primary"
                    : "text-foreground hover:bg-secondary hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              to="/search"
              aria-label="Search"
              className="grid size-10 place-items-center rounded-full text-deep transition-colors hover:bg-secondary"
            >
              <Search size={19} />
            </Link>
            <ActionLink to="/join" className="whitespace-nowrap !rounded-full !px-5 !py-2.5">
              Join the network <ArrowUpRight size={15} />
            </ActionLink>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <Link
              to="/search"
              aria-label="Search"
              className="grid size-10 place-items-center rounded-full text-deep hover:bg-secondary"
            >
              <Search size={20} />
            </Link>
            <Button
              variant="ghost"
              onClick={() => setMenuOpen((open) => !open)}
              className="!size-10 !min-h-0 !rounded-full !p-0"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </Button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="max-h-[75vh] overflow-y-auto border-t border-border px-4 py-4 sm:px-6 lg:hidden"
          >
            <div className="grid grid-cols-2 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={pathname === item.to ? "page" : undefined}
                  className={`rounded-xl px-3 py-3 text-sm font-bold ${
                    pathname === item.to ? "bg-secondary text-primary" : "hover:bg-secondary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <ActionLink to="/join" className="mt-3 w-full !rounded-full">
              Join the network <ArrowRight size={16} />
            </ActionLink>
          </nav>
        )}
      </header>

      <main>{children}</main>

      <footer className="relative overflow-hidden bg-deep text-primary-foreground">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 -top-36 size-[30rem] rounded-full bg-lime/10 blur-3xl"
        />
        <div className="container-site relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)] lg:gap-10 lg:py-20">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-3 font-display text-3xl font-extrabold tracking-tight"
            >
              <span className="grid size-11 place-items-center rounded-full bg-lime text-deep">
                <Network size={23} strokeWidth={2.5} />
              </span>
              ACFLO<span className="text-lime">.</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 opacity-80">
              Connecting local organizations. Strengthening communities. Advancing Africa.
            </p>
            <p className="mt-5 text-xs opacity-65">A flagship program of ZOZAC Community.</p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="mb-5 text-xs font-extrabold uppercase tracking-[.15em] text-lime">
                {group.title}
              </h2>
              <ul className="flex flex-col gap-3">
                {group.links.map(([label, to]) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-sm opacity-75 transition-opacity hover:opacity-100"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-primary-foreground/15">
          <div className="container-site flex flex-col justify-between gap-3 py-5 text-xs opacity-65 sm:flex-row">
            <span>
              © {new Date().getFullYear()} ACFLO — African Congress For Local Organizations
            </span>
            <span>Rooted in community. Designed for connection.</span>
          </div>
        </div>
      </footer>
      <BackToTop />
    </>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 700);
    window.addEventListener("scroll", updateVisibility);
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return visible ? (
    <Button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-5 right-5 z-30 !size-11 !p-0 shadow-lg"
    >
      <ChevronUp size={20} />
    </Button>
  ) : null;
}
