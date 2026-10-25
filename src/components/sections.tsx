import Image from "next/image";
import Link from "next/link";
import Gallery from "@/components/Gallery";
import PdfViewer from "@/components/PdfViewer";
import SectionHeading from "@/components/SectionHeading";
import type { Dictionary } from "@/content/dictionaries";
import { contact, event, heat, heatResults, team, weaponMeta, type Locale } from "@/content/site";
import breakoutPoster from "../../public/images/breakout-poster.jpg";
import communityEvent from "../../public/images/community-event.jpg";
import controlRoom from "../../public/images/control-room.jpg";
import controlRoomWide from "../../public/images/control-room-wide.jpg";
import eventInvite from "../../public/images/event-invite.jpg";
import heatFmvp from "../../public/images/dfdheat-fmvp.jpg";
import heatPoster from "../../public/images/heat-poster.jpg";
import heatScoreboard from "../../public/images/dfdheat-scoreboard.jpg";
import heatWinner from "../../public/images/dfdheat-winner.jpg";
import productionCrew from "../../public/images/production-crew.jpg";
import recapCard from "../../public/images/recap-card.jpg";
import scoreboardDesk from "../../public/images/scoreboard-desk.jpg";

// Every section is a `.panel`: one full screen in full-page mode (see globals.css and ScrollNav).
// `level={1}` is passed to the first section of a page so its heading becomes the page <h1>.

type Props = { t: Dictionary };
type LinkProps = Props & { lang: Locale };
type HeadingProps = Props & { level?: 1 | 2 };

const container = "mx-auto max-w-6xl px-4 sm:px-6";
const button =
  "clip-slant px-8 py-3 font-display text-xl font-bold uppercase tracking-wide transition-[filter,opacity]";
const primaryButton = `${button} bg-neon text-on-accent hover:brightness-110`;
const heatButton = `${button} bg-heat text-on-accent hover:brightness-110`;
const inverseButton = `${button} bg-heading text-ink hover:opacity-85`;
const factLabel = "text-xs font-semibold uppercase tracking-[0.15em] text-muted";

function Bullets({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={item} className="flex gap-4 leading-relaxed text-body">
          <span aria-hidden="true" className="mt-2.5 h-0.5 w-6 shrink-0 bg-neon" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Hero({ t, lang }: LinkProps) {
  return (
    <section id="intro" className="panel panel-hero relative isolate overflow-hidden pt-16">
      <Image
        src={controlRoom}
        alt=""
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="-z-20 object-cover object-[center_70%]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/45 light:via-ink/80 light:to-ink/15" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink/40 light:to-transparent" />
      <div className="absolute inset-0 -z-10 bg-ink/70 lg:hidden" />
      <div className="bg-grid absolute inset-0 -z-10" />

      <div className={`${container} py-20 sm:py-28`}>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-text sm:text-sm">{t.hero.eyebrow}</p>
        <h1 className="mt-5 font-display text-5xl font-extrabold uppercase italic leading-[1.08] text-heading sm:text-7xl lg:text-8xl">
          {t.hero.titleTop}
          <br />
          <span className="text-neon-text">{t.hero.titleBottom}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-body/85 sm:text-lg">{t.hero.lead}</p>

        <div className="mt-9 flex flex-wrap gap-4">
          <a href="#contact" className={primaryButton}>
            {t.hero.primary}
          </a>
          <Link href={`/${lang}/tournaments`} className={heatButton}>
            {t.hero.secondary}
          </Link>
        </div>

        <dl className="mt-14 grid max-w-3xl grid-cols-1 gap-6 border-t border-line pt-8 sm:grid-cols-3">
          {t.hero.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse justify-end">
              <dt className="mt-1 text-sm text-muted">{stat.label}</dt>
              <dd className="font-display text-5xl font-extrabold italic text-heading">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Ticker({ t }: Props) {
  return (
    <div className="overflow-hidden border-y border-neon/30 bg-neon py-2.5 text-on-accent" aria-hidden="true">
      <div className="animate-ticker flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {[...t.ticker, ...t.ticker].map((item, index) => (
              <span
                key={index}
                className="flex items-center whitespace-nowrap font-display text-lg font-bold uppercase tracking-wide"
              >
                <span className="px-6">{item}</span>
                <span className="italic">{"///"}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Landing-page teaser for the latest tournament and offline event.
export function Upcoming({ t, lang }: LinkProps) {
  const cards = [
    {
      label: t.upcoming.tournamentLabel,
      name: `${heat.name} ${heat.edition}`,
      image: heatPoster,
      alt: t.heat.posterAlt,
      facts: [
        { label: t.heat.matches, value: heat.matches },
        { label: t.results.champion, value: heatResults.champion.team },
        { label: t.results.fmvp, value: `${heatResults.fmvp.tag} | ${heatResults.fmvp.player}` },
      ],
      href: `/${lang}/tournaments/heat#results`,
      link: t.upcoming.tournamentLink,
      accent: "text-heat-text",
      buttonClass: heatButton,
    },
    {
      label: t.upcoming.eventLabel,
      name: event.name,
      image: eventInvite,
      alt: t.event.posterAlt,
      facts: [
        { label: t.event.date, value: event.date },
        { label: t.event.time, value: event.time },
        { label: t.event.venue, value: event.address },
      ],
      href: `/${lang}/events`,
      link: t.upcoming.eventLink,
      accent: "text-neon-text",
      buttonClass: primaryButton,
    },
  ];

  return (
    <section id="upcoming" className="panel border-b border-line bg-panel py-20 sm:py-28">
      <div className={container}>
        <SectionHeading eyebrow={t.upcoming.eyebrow} title={t.upcoming.title} lead={t.upcoming.lead} />
        <div className="mt-12 grid gap-6 fp:mt-8 lg:grid-cols-2">
          {cards.map((card) => (
            <article key={card.name} className="flex flex-col border border-line bg-ink sm:flex-row">
              <Image
                src={card.image}
                alt={card.alt}
                placeholder="blur"
                sizes="(min-width: 640px) 13rem, 100vw"
                className="h-auto w-full object-cover sm:w-52 sm:shrink-0"
              />
              <div className="flex flex-1 flex-col p-6">
                <p className={`text-xs font-semibold uppercase tracking-[0.15em] ${card.accent}`}>{card.label}</p>
                <h3 className="mt-2 font-display text-3xl font-extrabold uppercase italic leading-tight text-heading">
                  {card.name}
                </h3>
                <dl className="mt-4 space-y-2 text-sm">
                  {card.facts.map((fact) => (
                    <div key={fact.label} className="flex justify-between gap-4 border-b border-line pb-2">
                      <dt className="text-muted">{fact.label}</dt>
                      <dd className="text-right font-semibold text-heading">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-auto pt-6">
                  <Link href={card.href} className={`${card.buttonClass} inline-block !px-6 !py-2 !text-lg`}>
                    {card.link}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// Overview page hero: what the studio does with tournaments, plus the latest one.
export function TournamentsHero({ t, lang }: LinkProps) {
  const facts = [
    { label: t.heat.matches, value: `${heat.matches}.${heat.year}` },
    { label: t.results.champion, value: heatResults.champion.team },
    { label: t.heat.prize, value: heat.prize },
  ];

  return (
    <section id="overview" className="panel relative isolate overflow-hidden pt-16">
      <Image
        src={productionCrew}
        alt=""
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-ink/80 light:bg-ink/85" />
      <div className="bg-grid absolute inset-0 -z-10" />

      <div className={`${container} grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-[1fr_minmax(0,32rem)]`}>
        <SectionHeading level={1} eyebrow={t.tournaments.eyebrow} title={t.tournaments.title} lead={t.tournaments.lead} />

        <article className="flex flex-col border border-heat/40 bg-ink sm:flex-row">
          <Image
            src={heatPoster}
            alt={t.heat.posterAlt}
            placeholder="blur"
            sizes="(min-width: 640px) 12rem, 100vw"
            className="aspect-video w-full object-cover object-[center_25%] sm:aspect-auto sm:h-auto sm:w-48 sm:shrink-0"
          />
          <div className="flex flex-1 flex-col p-6">
            <p className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-heat-text">
              {t.tournaments.latest}
              <span className="border border-heat/50 px-2 py-0.5 text-[0.65rem] tracking-wider">{t.tournaments.finished}</span>
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold uppercase italic leading-tight text-heading">
              {`${heat.name} ${heat.edition}`}
            </h2>
            <dl className="mt-4 space-y-2 text-sm">
              {facts.map((fact) => (
                <div key={fact.label} className="flex justify-between gap-4 border-b border-line pb-2">
                  <dt className="text-muted">{fact.label}</dt>
                  <dd className="text-right font-semibold text-heading">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-auto pt-6">
              <Link href={`/${lang}/tournaments/heat`} className={`${heatButton} inline-block !px-6 !py-2 !text-lg`}>
                {t.tournaments.link}
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

// HEAT page hero: the champions banner over a blurred copy of itself.
export function HeatHero({ t, lang }: LinkProps) {
  const { champion, fmvp } = heatResults;
  const facts = [
    { label: t.results.champion, value: champion.team },
    { label: t.results.fmvp, value: `${fmvp.tag} | ${fmvp.player}` },
    { label: t.heat.matches, value: `${heat.matches}.${heat.year}` },
  ];

  return (
    <section id="overview" className="panel relative isolate overflow-hidden pt-16">
      <Image src={heatWinner} alt="" fill priority sizes="100vw" className="-z-20 scale-110 object-cover blur-2xl" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/80 via-ink/85 to-ink" />

      <div className={`${container} grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]`}>
        <div>
          <Link href={`/${lang}/tournaments`} className="text-sm font-medium text-muted transition-colors hover:text-heading">
            <span aria-hidden="true">←</span> {t.tournaments.back}
          </Link>
          <p className="mt-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-heat-text">
            <span aria-hidden="true" className="font-display text-base italic tracking-normal">
              {"///"}
            </span>
            {t.heat.eyebrow}
          </p>
          <h1 className="mt-3 font-display text-5xl font-extrabold uppercase italic leading-[1.05] text-heading sm:text-6xl">
            {heat.name} <span className="text-heat-text">{heat.edition}</span>
          </h1>
          <p className="mt-5 max-w-xl leading-relaxed text-body">{t.heat.lead}</p>

          <dl className="mt-8 max-w-md divide-y divide-line border-y border-line">
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-baseline justify-between gap-4 py-2.5">
                <dt className={factLabel}>{fact.label}</dt>
                <dd className="text-right font-display text-xl font-extrabold text-heat-text">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#results" className={heatButton}>
              {t.heat.resultsLink}
            </a>
            <a href="#rulebook" className={inverseButton}>
              {t.heat.rulebookLink}
            </a>
          </div>
        </div>

        {/* On phones the champions banner leads, so the first screen shows it. */}
        <div className="relative order-first lg:order-none">
          <div className="absolute -inset-3 -z-10 bg-heat/25 blur-2xl" aria-hidden="true" />
          <Image
            src={heatWinner}
            alt={t.results.championAlt}
            placeholder="blur"
            priority
            sizes="(min-width: 1152px) 40rem, (min-width: 1024px) 55vw, 100vw"
            className="h-auto w-full border border-heat/40"
          />
        </div>
      </div>
    </section>
  );
}

// Poster, dates, prize and format for HEAT, below the hero on the tournament's page.
export function Heat({ t }: Props) {
  const facts = [
    { label: t.heat.registration, value: heat.registration, sub: heat.year },
    { label: t.heat.matches, value: heat.matches, sub: heat.year },
    { label: t.heat.prize, value: heat.prize, sub: `+ ${heat.prizeExtra}` },
    { label: t.results.champion, value: heatResults.champion.team, sub: heatResults.champion.players.join(" · ") },
  ];

  return (
    <section id="heat" className="panel relative overflow-hidden bg-gradient-to-b from-heat-surface to-ink py-20 sm:py-28">
      <div className={`${container} grid items-center gap-12 lg:grid-cols-[minmax(0,26rem)_1fr]`}>
        <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <div className="absolute -inset-3 -z-10 bg-heat/25 blur-2xl" aria-hidden="true" />
          <Image
            src={heatPoster}
            alt={t.heat.posterAlt}
            placeholder="blur"
            sizes="(min-width: 1024px) 26rem, 24rem"
            className="h-auto w-full border border-heat/40"
          />
        </div>

        <div>
          <SectionHeading tone="heat" eyebrow={`${heat.name} ${heat.edition}`} title={t.heat.infoTitle} />

          <dl className="mt-8 grid gap-px overflow-hidden border border-line bg-line fp:mt-6 sm:grid-cols-2">
            {facts.map((fact) => (
              <div key={fact.label} className="bg-panel p-5 fp:py-4">
                <dt className={factLabel}>{fact.label}</dt>
                <dd className="mt-2 font-display text-3xl font-extrabold text-heat-text sm:text-4xl">{fact.value}</dd>
                <dd className="mt-1 text-sm font-medium text-body">{fact.sub}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6">
            <h3 className={factLabel}>{t.heat.formatTitle}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {t.heat.format.map((item) => (
                <li key={item} className="border border-line bg-panel px-3 py-1.5 text-sm text-body">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-5 fp:mt-6">
            <a href={contact.facebook} target="_blank" rel="noopener noreferrer" className={heatButton}>
              {t.heat.cta}
            </a>
            <p className="max-w-xs text-sm text-muted">{t.heat.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HeatResults({ t }: Props) {
  const { champion, fmvp, standings, standingsRound } = heatResults;
  const columns = [t.results.mandel, t.results.killPoints, t.results.assetPoints];

  return (
    <section id="results" className="panel border-t border-line bg-ink py-20 sm:py-28">
      <div className={container}>
        <SectionHeading tone="heat" eyebrow={t.results.eyebrow} title={t.results.title} lead={t.results.lead} />

        <figure className="mt-10 fp:mt-6">
          <Image
            src={heatWinner}
            alt={t.results.championAlt}
            placeholder="blur"
            sizes="(min-width: 1152px) 72rem, 100vw"
            className="h-auto w-full border border-heat/40"
          />
          <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className={factLabel}>{t.results.champion}</span>
            <span className="font-display text-2xl font-extrabold uppercase italic text-heat-text">{champion.team}</span>
            <span className="text-sm text-body">
              {champion.players.map((player) => `${champion.tag} | ${player}`).join(" · ")}
            </span>
          </figcaption>
        </figure>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className={factLabel}>
              {t.results.standings} · {standingsRound}
            </h3>
            <div className="mt-3 overflow-x-auto border border-line">
              <table className="w-full min-w-[28rem] text-left text-sm">
                <thead className="bg-panel text-xs uppercase tracking-wider text-muted">
                  <tr>
                    <th scope="col" className="px-3 py-2.5">{t.results.rank}</th>
                    <th scope="col" className="px-3 py-2.5">{t.results.team}</th>
                    {columns.map((label) => (
                      <th key={label} scope="col" className="px-3 py-2.5 text-right">
                        {label}
                      </th>
                    ))}
                    <th scope="col" className="px-3 py-2.5 text-right">{t.results.total}</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((row, index) => (
                    <tr key={row.team} className={`border-t border-line ${index === 0 ? "text-heat-text" : "text-body"}`}>
                      <td className="px-3 py-2.5 font-display text-lg font-bold">{index + 1}</td>
                      <th scope="row" className="px-3 py-2.5 font-semibold">{row.team}</th>
                      <td className="px-3 py-2.5 text-right tabular-nums">{row.mandel}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums">{row.kills}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums">{row.assets}</td>
                      <td className="px-3 py-2.5 text-right font-display text-lg font-bold tabular-nums">{row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Image
              src={heatScoreboard}
              alt={t.results.scoreboardAlt}
              placeholder="blur"
              sizes="(min-width: 1024px) 36rem, 100vw"
              className="mt-4 h-auto w-full border border-line"
            />
          </div>

          <div>
            <h3 className={factLabel}>{t.results.fmvp}</h3>
            <Image
              src={heatFmvp}
              alt={t.results.fmvpAlt}
              placeholder="blur"
              sizes="(min-width: 1024px) 36rem, 100vw"
              className="mt-3 h-auto w-full border border-heat/40"
            />
            <dl className="mt-4 grid grid-cols-3 gap-px overflow-hidden border border-line bg-line">
              {[
                { label: t.results.fmvp, value: `${fmvp.tag} | ${fmvp.player}` },
                { label: t.results.kills, value: fmvp.kills },
                { label: t.results.assists, value: fmvp.assists },
              ].map((fact) => (
                <div key={fact.label} className="bg-panel p-4">
                  <dt className={factLabel}>{fact.label}</dt>
                  <dd className="mt-1 font-display text-2xl font-extrabold text-heat-text">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Rulebook({ t, available }: Props & { available: boolean }) {
  const { viewer, page, zoomIn, zoomOut, open, loading, error } = t.rulebook;

  return (
    <section id="rulebook" className="panel border-y border-line bg-panel py-20 sm:py-28">
      <div className={`${container} grid gap-10 lg:grid-cols-[minmax(0,19rem)_1fr]`}>
        <div className="lg:self-center">
          <SectionHeading tone="heat" eyebrow={t.rulebook.eyebrow} title={t.rulebook.title} lead={t.rulebook.lead} />
          {available && (
            <a
              href={heat.rulebook}
              download={`${heat.name}  - Rulebook.pdf`}
              className={`${heatButton} mt-8 inline-block`}
            >
              {t.rulebook.download}
            </a>
          )}
        </div>

        {available ? (
          <div className="h-[75vh] min-h-96 fp:h-[calc(100dvh-8.5rem)]">
            <PdfViewer file={heat.rulebook} labels={{ viewer, page, zoomIn, zoomOut, open, loading, error }} />
          </div>
        ) : (
          <p className="flex min-h-60 items-center justify-center border border-dashed border-line bg-ink p-8 text-center text-muted">
            {t.rulebook.pending}
          </p>
        )}
      </div>
    </section>
  );
}

export function EventInvite({ t, level }: HeadingProps) {
  const facts = [
    { label: t.event.date, value: event.date },
    { label: t.event.time, value: event.time, sub: t.event.timeNote },
    { label: t.event.venue, value: event.address, small: true },
    { label: t.event.host, value: event.host },
  ];

  return (
    <section id="event" className="panel border-b border-line bg-panel py-20 sm:py-28">
      <div className={`${container} grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,22rem)]`}>
        <div>
          <SectionHeading level={level} eyebrow={t.event.eyebrow} title={event.name} lead={t.event.lead} />

          <dl className="mt-8 grid gap-px overflow-hidden border border-line bg-line fp:mt-6 sm:grid-cols-2">
            {facts.map((fact) => (
              <div key={fact.label} className="bg-ink p-5 fp:py-4">
                <dt className={factLabel}>{fact.label}</dt>
                <dd
                  className={`mt-2 font-display font-extrabold text-heading ${
                    fact.small ? "text-2xl leading-tight" : "text-3xl sm:text-4xl"
                  }`}
                >
                  {fact.value}
                </dd>
                {fact.sub && <dd className="mt-1 text-sm font-medium text-body">{fact.sub}</dd>}
              </div>
            ))}
          </dl>
        </div>

        <Image
          src={eventInvite}
          alt={t.event.posterAlt}
          placeholder="blur"
          priority={level === 1}
          sizes="(min-width: 1024px) 22rem, 24rem"
          className="mx-auto h-auto w-full max-w-sm border border-line lg:max-w-none"
        />
      </div>
    </section>
  );
}

export function PastEvent({ t }: Props) {
  return (
    <section id="past-events" className="panel py-20 sm:py-28">
      <div className={`${container} grid items-center gap-12 lg:grid-cols-2`}>
        <Image
          src={communityEvent}
          alt={t.pastEvent.imageAlt}
          placeholder="blur"
          sizes="(min-width: 1024px) 36rem, 100vw"
          className="h-auto w-full border border-line"
        />
        <div>
          <SectionHeading eyebrow={t.pastEvent.eyebrow} title={t.pastEvent.title} lead={t.pastEvent.lead} />
          <Bullets items={t.pastEvent.items} className="mt-8 space-y-4" />
        </div>
      </div>
    </section>
  );
}

export function Services({ t, lang }: LinkProps) {
  return (
    <section id="services" className="panel py-20 sm:py-28">
      <div className={container}>
        <SectionHeading eyebrow={t.services.eyebrow} title={t.services.title} lead={t.services.lead} />
        <ul className="mt-12 grid gap-px overflow-hidden border border-line bg-line fp:mt-8 sm:grid-cols-2 lg:grid-cols-3">
          {t.services.items.map((item, index) => (
            <li key={item.title} className="group bg-panel p-7 transition-colors hover:bg-panel-2 fp:p-6">
              <span className="font-display text-2xl font-bold italic text-brand-bright transition-colors group-hover:text-neon-text">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-2xl font-bold uppercase leading-tight text-heading fp:mt-3">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6">
          <Link
            href={`/${lang}/about`}
            className="font-display text-lg font-bold uppercase tracking-wide text-neon-text hover:underline"
          >
            {t.upcoming.aboutLink} <span aria-hidden="true">→</span>
          </Link>
        </p>
      </div>
    </section>
  );
}

export function AboutIntro({ t }: Props) {
  return (
    <section id="about" className="panel relative isolate overflow-hidden py-20 sm:py-28">
      <Image
        src={controlRoomWide}
        alt=""
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-ink/85" />
      <div className="bg-grid absolute inset-0 -z-10" />

      <div className={container}>
        <SectionHeading level={1} eyebrow={t.about.eyebrow} title={t.about.title} lead={t.about.lead} />
        <dl className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
          {t.about.facts.map((fact) => (
            <div key={fact.label} className="bg-panel p-6">
              <dt className={factLabel}>{fact.label}</dt>
              <dd className="mt-2 font-display text-2xl font-bold uppercase leading-tight text-heading">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Strengths({ t }: Props) {
  const gallery = [productionCrew, scoreboardDesk, communityEvent, controlRoomWide];

  return (
    <section id="strengths" className="panel border-y border-line bg-panel py-20 sm:py-28">
      <div className={`${container} grid items-center gap-12 lg:grid-cols-2`}>
        <div>
          <Gallery
            images={gallery.map((image, index) => ({ image, alt: t.projects.gallery[index] }))}
            labels={t.lightbox}
          />
        </div>
        <div>
          <SectionHeading eyebrow={t.strengths.eyebrow} title={t.strengths.title} />
          <Bullets items={t.strengths.items} className="mt-8 space-y-5" />
        </div>
      </div>
    </section>
  );
}

export function Projects({ t }: Props) {
  const images = [controlRoom, breakoutPoster];

  return (
    <section id="projects" className="panel py-20 sm:py-28">
      <div className={container}>
        <SectionHeading eyebrow={t.projects.eyebrow} title={t.projects.title} lead={t.projects.lead} />

        <div className="mt-12 grid gap-6 fp:mt-6 lg:grid-cols-2">
          {t.projects.items.map((project, index) => (
            <article key={project.name} className="flex flex-col border border-line bg-panel">
              <div className="relative aspect-[4/3] overflow-hidden fp:aspect-auto fp:h-[22dvh]">
                <Image
                  src={images[index]}
                  alt={project.alt}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 36rem, 100vw"
                  className="object-cover object-top"
                />
                <span className="clip-slant absolute left-0 top-4 bg-neon px-5 py-1 text-xs font-bold uppercase tracking-wider text-on-accent">
                  {t.projects.completed}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-7 fp:p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-neon-text">{project.partner}</p>
                <h3 className="mt-2 font-display text-3xl font-extrabold uppercase italic leading-tight text-heading">
                  {project.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{project.body}</p>
                <ul className="mt-5 flex flex-wrap gap-2 fp:mt-4">
                  {project.tags.map((tag) => (
                    <li key={tag} className="border border-line px-3 py-1 text-xs font-medium text-body">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 border border-line bg-panel p-7 fp:mt-4 fp:flex fp:items-center fp:gap-8 fp:px-5 fp:py-3">
          <h3 className="font-display text-2xl font-bold uppercase text-heading fp:shrink-0 fp:text-lg">
            {t.projects.outputsTitle}
          </h3>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2 fp:mt-0 fp:gap-x-6">
            {t.projects.outputs.map((output) => (
              <li key={output} className="flex items-center gap-2 text-sm text-body">
                <span aria-hidden="true" className="font-display font-bold italic text-neon-text">
                  {"//"}
                </span>
                {output}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function ContentStudy({ t }: Props) {
  const topClassPicks = weaponMeta.classes[0].picks;

  return (
    <section id="content" className="panel border-y border-line bg-panel py-20 sm:py-28">
      <div className={container}>
        <SectionHeading eyebrow={t.content.eyebrow} title={t.content.title} lead={t.content.lead} />

        <div className="mt-12 grid gap-8 fp:mt-6 fp:gap-6 lg:grid-cols-[3fr_2fr]">
          <Image
            src={recapCard}
            alt={t.content.recapAlt}
            placeholder="blur"
            sizes="(min-width: 1024px) 42rem, 100vw"
            className="h-auto w-full border border-line"
          />
          <Bullets
            items={t.content.items}
            className="space-y-4 text-sm lg:col-span-2 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0"
          />

          <div className="self-start border border-line bg-ink p-7 fp:p-5 lg:col-start-2 lg:row-start-1">
            <h3 className="font-display text-2xl font-bold uppercase text-heading">{t.content.metaTitle}</h3>
            <p className="mt-1 text-sm text-muted">
              <span className="font-semibold text-neon-text">{weaponMeta.total}</span> {t.content.metaLead}
            </p>

            <ul className="mt-6 space-y-4 fp:mt-4 fp:space-y-3">
              {weaponMeta.classes.map((weaponClass) => (
                <li key={weaponClass.name}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-semibold text-heading">{weaponClass.name}</span>
                    <span className="text-muted">
                      {weaponClass.picks} {t.content.picks} · {((weaponClass.picks / weaponMeta.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 bg-panel-2">
                    <div className="h-full bg-neon" style={{ width: `${(weaponClass.picks / topClassPicks) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-7 border-t border-line pt-5 fp:mt-5 fp:pt-4">
              <p className={factLabel}>{t.content.topWeapon}</p>
              <p className="mt-1 font-display text-4xl font-extrabold italic text-heading">
                {weaponMeta.topWeapon.name}
                <span className="ml-3 text-xl font-bold not-italic text-neon-text">
                  {weaponMeta.topWeapon.picks} {t.content.picks}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Team({ t }: Props) {
  return (
    <section id="team" className="panel py-20 sm:py-28">
      <div className={container}>
        <SectionHeading eyebrow={t.team.eyebrow} title={t.team.title} lead={t.team.lead} />
        <ul className="mt-12 grid gap-px overflow-hidden border border-line bg-line fp:mt-8 sm:grid-cols-2 lg:grid-cols-5">
          {team.map((member, index) => {
            const copy = t.team.members[member.role];
            return (
              <li
                key={member.name}
                className={`flex flex-col bg-panel p-7 lg:p-6 ${index === 0 ? "sm:max-lg:col-span-2" : ""}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neon-text">{copy.role}</p>
                  <span aria-hidden="true" className="font-display text-2xl font-bold italic text-brand-bright">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-3xl font-extrabold uppercase leading-tight text-heading">
                  {member.name}
                </h3>
                <p className="mt-5 border-l-2 border-neon pl-4 font-display text-xl font-semibold italic leading-snug text-heading">
                  “{copy.slogan}”
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">{copy.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function Contact({ t }: Props) {
  const rows = [
    { label: t.contact.representative, value: contact.representative },
    { label: t.contact.phone, value: contact.phoneDisplay, href: `tel:${contact.phone}` },
    { label: t.contact.email, value: contact.email, href: `mailto:${contact.email}` },
    { label: t.contact.facebook, value: contact.facebookDisplay, href: contact.facebook, external: true },
  ];

  return (
    <section
      id="contact"
      className="panel relative isolate overflow-hidden border-t border-line bg-brand/30 py-20 light:bg-panel-2 sm:py-28"
    >
      <div className="bg-grid absolute inset-0 -z-10" />
      <div className={`${container} grid gap-12 lg:grid-cols-2`}>
        <div>
          <SectionHeading eyebrow={t.contact.eyebrow} title={t.contact.title} lead={t.contact.lead} />
          <div className="mt-8 flex flex-wrap gap-4">
            <a href={`tel:${contact.phone}`} className={primaryButton}>
              {t.contact.call}
            </a>
            <a href={`mailto:${contact.email}`} className={inverseButton}>
              {t.contact.mail}
            </a>
          </div>
        </div>

        <dl className="divide-y divide-line border border-line bg-ink/80">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 p-5 sm:flex-row sm:items-center sm:justify-between">
              <dt className={factLabel}>{row.label}</dt>
              <dd className="break-all text-base font-semibold text-heading">
                {row.href ? (
                  <a
                    href={row.href}
                    className="transition-colors hover:text-neon-text"
                    {...(row.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {row.value}
                  </a>
                ) : (
                  row.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
