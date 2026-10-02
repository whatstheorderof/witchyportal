import Link from "next/link";
import { getSetting } from "@/lib/settings";
import { Wordmark } from "./Logo";
import { NewsletterForm } from "./forms";
import { discoverNav, primaryNav } from "./nav";

export async function SiteFooter() {
  const [contact, site] = await Promise.all([getSetting("contact"), getSetting("site")]);
  const socials = [
    { href: contact.instagram, label: "Instagram" },
    { href: contact.youtube, label: "YouTube" },
    { href: contact.tiktok, label: "TikTok" },
    { href: contact.etsy, label: "Etsy shop" },
  ].filter((s) => s.href);

  return (
    <footer className="relative overflow-hidden bg-plum-deep pb-28 text-ivory lg:pb-0">
      <div className="container-page grid gap-14 py-16 lg:grid-cols-[1.2fr_1fr] lg:py-24">
        <div className="max-w-xl">
          <p className="eyebrow text-blush">Newsletter</p>
          <h2 className="mt-3 display-md text-ivory">{site.newsletterTitle}</h2>
          <p className="mt-4 text-ivory/75">{site.newsletterText}</p>
          <ul className="mt-5 grid gap-2 text-sm text-ivory/85">
            <li className="flex gap-2"><span aria-hidden className="text-blush">✦</span>New retreat dates as soon as they&rsquo;re announced</li>
            <li className="flex gap-2"><span aria-hidden className="text-blush">✦</span>Moon notes, tips and rituals from Yulia</li>
            <li className="flex gap-2"><span aria-hidden className="text-blush">✦</span>Free, and your email is only used for these letters</li>
          </ul>
          <div className="mt-6"><NewsletterForm dark /></div>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
          <div>
            <p className="eyebrow text-blush/90">Visit</p>
            <ul className="mt-4 grid gap-2.5">
              {primaryNav.map((i) => <li key={i.href}><Link className="text-ivory/80 hover:text-ivory" href={i.href}>{i.label}</Link></li>)}
              <li><Link className="text-ivory/80 hover:text-ivory" href="/socials">Socials</Link></li>
              <li><Link className="text-ivory/80 hover:text-ivory" href="/favourites">Your favourites</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-blush/90">Discover</p>
            <ul className="mt-4 grid gap-2.5">
              {discoverNav.map((i) => <li key={i.href}><Link className="text-ivory/80 hover:text-ivory" href={i.href}>{i.label}</Link></li>)}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-blush/90">Small print</p>
            <ul className="mt-4 grid gap-2.5">
              <li><Link className="text-ivory/80 hover:text-ivory" href="/policies/booking-terms">Booking terms</Link></li>
              <li><Link className="text-ivory/80 hover:text-ivory" href="/policies/privacy">Privacy</Link></li>
              <li><Link className="text-ivory/80 hover:text-ivory" href="/policies/cookies">Cookies</Link></li>
              <li><Link className="text-ivory/80 hover:text-ivory" href="/policies/terms">Website terms</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="container-page flex flex-col gap-4 py-8 text-sm text-ivory/60 sm:flex-row sm:items-center sm:justify-between">
          <Wordmark light />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {socials.map((s) => <a key={s.label} href={s.href} className="hover:text-ivory" rel="noopener noreferrer" target="_blank">{s.label}</a>)}
            {contact.email && <a href={`mailto:${contact.email}`} className="hover:text-ivory">{contact.email}</a>}
            <span>© {new Date().getFullYear()} Yulia Moon</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
