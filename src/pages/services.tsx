import { services, serviceBySlug, type Service } from "../config/services";
import { caseStudies } from "../config/work";
import { definePage, type PageDef } from "../lib/page";
import { serviceSchema, webPageSchema } from "../lib/schema";
import { absoluteUrl } from "../config/seo";
import { Accordion, CheckIcon, Container, CtaBand, PageHero, Section, SectionHeader, Tags, TextLink } from "../components/ui";
import { Lifecycle } from "../components/diagrams";
import { ServiceCard } from "../components/cards";
import { ServiceChooser, ServiceFlow } from "../components/viz";

const indexCrumbs = [{ name: "Home", path: "/" }, { name: "Services", path: "/services" }];
const indexDescription =
  "Software development services from KrisLynx: product engineering, AI and automation, enterprise software, SaaS development, custom software and cloud engineering.";

export const servicesIndex = definePage({
  path: "/services",
  title: "AI, Software & Product Engineering Services",
  description: indexDescription,
  group: "service",
  breadcrumbs: indexCrumbs,
  schema: [
    {
      ...webPageSchema({ type: "CollectionPage", name: "KrisLynx services", description: indexDescription, path: "/services" }),
      mainEntity: {
        "@type": "ItemList",
        itemListElement: services.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.name, url: absoluteUrl(`/services/${s.slug}`) })),
      },
    },
  ],
  sitemap: { priority: 0.9, changefreq: "monthly" },
  render: () => (
    <>
      <PageHero
        crumbs={indexCrumbs}
        title="Systems we build for other organizations"
        lede={<p>One accountable team that designs, builds and runs software — the same way we build our own products. Pick the capability closest to your problem; most projects draw on several.</p>}
      />
      <Section tone="ink-deep" labelledBy="cap-title" class="lightfield lightfield--blue">
        <Container>
          <SectionHeader id="cap-title" index="01" label="Systems we build" title="Choose the system you need built" lede="Each one shows the flow of the work, what is included, and where to read more." align="split" />
          <ServiceChooser />
        </Container>
      </Section>
      <Section tone="white" labelledBy="process-title">
        <Container>
          <SectionHeader id="process-title" title="How an engagement runs" lede="Six stages with a reviewable output at each one. You can stop after any stage and keep what's been delivered." align="split" />
          <Lifecycle />
        </Container>
      </Section>
      <Section tone="paper" labelledBy="global-title" tight>
        <Container>
          <div class="split">
            <SectionHeader id="global-title" title="Working with international clients" />
            <div class="prose-lg">
              <p>We're based in India (IST, UTC+5:30) and work remotely with organizations elsewhere. We agree regular meeting times inside your business hours, keep decisions in writing, and demonstrate working software every one to two weeks so progress never depends on status reports.</p>
              <p>Contracts, IP ownership and data-handling terms are agreed before work begins.</p>
            </div>
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  ),
});

function servicePage(s: Service): PageDef {
  const path = `/services/${s.slug}`;
  const crumbs = [...indexCrumbs, { name: s.name, path }];
  const related = s.related.map(serviceBySlug).filter((r): r is Service => r !== undefined);
  const proof = caseStudies.filter((c) => c.relatedServices.includes(s.slug)).slice(0, 2);
  return definePage({
    path,
    title: s.seoTitle,
    description: s.seoDescription,
    group: "service",
    breadcrumbs: crumbs,
    schema: [serviceSchema({ name: s.name, description: s.seoDescription, path })],
    sitemap: { priority: 0.8, changefreq: "monthly" },
    render: () => (
      <>
        <PageHero crumbs={crumbs} title={s.h1} lede={<p>{s.lede}</p>} aside={<ServiceFlow slug={s.slug} />} actions={<TextLink href={`/contact?need=${needFor(s.slug)}`} class="on-dark">Discuss your project</TextLink>} />
        <Section tone="white" labelledBy="problem-title">
          <Container>
            <div class="split">
              <SectionHeader id="problem-title" title={s.problem.title} />
              <ul class="problems">
                {s.problem.points.map((p) => (
                  <li>{p}</li>
                ))}
              </ul>
            </div>
          </Container>
        </Section>
        <Section tone="paper" labelledBy="caps-title">
          <Container>
            <SectionHeader id="caps-title" title="What's included" align="split" lede={s.short} />
            <ul class="caps">
              {s.capabilities.map((c) => (
                <li>
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
        <Section tone="ink" labelledBy="approach-title">
          <Container>
            <SectionHeader id="approach-title" title="Our approach" align="split" />
            <ol class="approach">
              {s.approach.map((a) => (
                <li>
                  <h3>{a.title}</h3>
                  <p>{a.body}</p>
                </li>
              ))}
            </ol>
          </Container>
        </Section>
        <Section tone="white" labelledBy="uses-title">
          <Container>
            <div class="split">
              <div>
                <SectionHeader id="uses-title" title="Typical use cases" lede="The kinds of problems this service addresses." />
              </div>
              <ul class="uses">
                {s.useCases.map((u) => (
                  <li>
                    <h3>{u.title}</h3>
                    <p>{u.body}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div class="svc-meta">
              <div>
                <h3>Technology</h3>
                <Tags items={s.technology} label="Technology" />
              </div>
              <div>
                <h3>What you receive</h3>
                <ul class="checklist">
                  {s.deliverables.map((d) => (
                    <li>
                      <CheckIcon />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </Section>
        {s.evidence || proof.length ? (
          <Section tone="paper" labelledBy="proof-title" tight>
            <Container>
              <SectionHeader id="proof-title" title="Where we've done this" />
              <ul class="proof">
                {s.evidence ? (
                  <li>
                    <h3>
                      <a href={s.evidence.href}>{s.evidence.label}</a>
                    </h3>
                    <p>{s.evidence.body}</p>
                  </li>
                ) : null}
                {proof
                  .filter((c) => !s.evidence || !s.evidence.href.startsWith(`/products/${c.slug}`))
                  .map((c) => (
                    <li>
                      <h3>
                        <a href={`/work/${c.slug}`}>{c.name}</a>
                      </h3>
                      <p>{c.summary}</p>
                    </li>
                  ))}
              </ul>
            </Container>
          </Section>
        ) : null}
        <Section tone="white" labelledBy="lifecycle-title">
          <Container>
            <SectionHeader id="lifecycle-title" title="Process" align="split" lede="Every engagement follows the same lifecycle, with an output you can review at each stage." />
            <Lifecycle />
          </Container>
        </Section>
        <Section tone="paper" labelledBy="faq-title">
          <Container narrow>
            <SectionHeader id="faq-title" title="Frequently asked questions" />
            <Accordion items={s.faqs.map((f) => ({ title: f.q, body: <p>{f.a}</p> }))} />
          </Container>
        </Section>
        <Section tone="white" labelledBy="related-title" tight>
          <Container>
            <SectionHeader id="related-title" title="Related services" />
            <div class="service-grid service-grid--3">
              {related.map((r) => (
                <ServiceCard service={r} />
              ))}
            </div>
          </Container>
        </Section>
        <CtaBand primary={{ label: "Start a conversation", href: `/contact?need=${needFor(s.slug)}` }} />
      </>
    ),
  });
}

function needFor(slug: string): string {
  const map: Record<string, string> = {
    "product-engineering": "new-product",
    "artificial-intelligence": "ai",
    "enterprise-software": "enterprise",
    "saas-development": "saas",
    "software-development": "new-product",
    "cloud-engineering": "cloud",
  };
  return map[slug] ?? "other";
}

export const servicePages: PageDef[] = services.map(servicePage);
