import { edulynx } from "../config/products";
import { company } from "../config/company";
import { definePage } from "../lib/page";
import { orgRef } from "../lib/schema";
import { absoluteUrl } from "../config/seo";
import { Accordion, ButtonLink, CheckIcon, Container, CtaBand, PageHero, Section, SectionHeader, StatusBadge, TextLink } from "../components/ui";
import { EduLynxArchitecture } from "../components/diagrams";
import { AIFlow, EduLynxMap, SchoolDay } from "../components/viz";
import { Picture } from "../components/media";

const crumbs = [{ name: "Home", path: "/" }, { name: "Products", path: "/products" }, { name: "EduLynx ERP", path: "/products/edulynx-erp" }];
const description =
  "EduLynx ERP: school management software for Indian schools — attendance, exams, fees, timetables and communication, with an AI assistant. From ₹35,000.";

export default definePage({
  path: "/products/edulynx-erp",
  title: "EduLynx ERP | School Management Platform | KRISLYNX",
  absoluteTitle: true,
  description,
  group: "product",
  breadcrumbs: crumbs,
  ogType: "product",
  schema: [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: edulynx.name,
      description: edulynx.summary,
      url: edulynx.url,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "School management software",
      operatingSystem: "Web browser",
      publisher: orgRef,
      mainEntityOfPage: absoluteUrl("/products/edulynx-erp"),
      offers: edulynx.pricing.plans.map((p) => ({
        "@type": "Offer",
        name: p.name,
        price: p.price,
        priceCurrency: p.currency,
        description: `${p.basis}. ${edulynx.pricing.note}`,
        url: edulynx.url,
      })),
    },
  ],
  sitemap: { priority: 0.9, changefreq: "monthly" },
  render: () => (
    <>
      <PageHero
        crumbs={crumbs}
        meta={
          <>
            <StatusBadge status="live" />
            <span class="page-hero__by">A product by {company.displayName}</span>
          </>
        }
        title="EduLynx ERP"
        lede={
          <>
            <p class="edx-tagline">Intelligent school management platform</p>
            <p>{edulynx.summary}</p>
          </>
        }
        actions={
          <>
            <ButtonLink href={edulynx.url} variant="inverse" size="lg" external event="external_product_click" eventLabel="edulynx_hero">
              Visit EduLynx ERP
            </ButtonLink>
            <ButtonLink href={edulynx.demoUrl} variant="ghost" size="lg" external event="demo_request" eventLabel="edulynx_hero">
              Request a demo
            </ButtonLink>
          </>
        }
        aside={<EduLynxArchitecture />}
      />

      <Section tone="white" labelledBy="why-title">
        <Container>
          <SectionHeader id="why-title" title="Why schools choose EduLynx" align="split" lede="Built for how schools and educational institutions in India actually operate." />
          <ul class="why-grid">
            {edulynx.why.map((w) => (
              <li>
                <h3>{w.title}</h3>
                <p>{w.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {edulynx.screenshots.length ? (
        <Section tone="paper" labelledBy="shots-title">
          <Container>
            <SectionHeader id="shots-title" title="Inside the product" />
            <ul class="shots">
              {edulynx.screenshots.map((s) => (
                <li>
                  <figure>
                    <Picture name={s.image} alt={s.caption} sizes="(min-width: 64rem) 50vw, 100vw" />
                    <figcaption>{s.caption}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}


      <section class="section section--mint" aria-labelledby="story-title">
        <Container>
          <SectionHeader id="story-title" index="01" label="A school day" title="A school should not need five systems to run one day" lede="One shared system, one record — so attendance, marks and fees always agree." align="split" />
          <SchoolDay />
        </Container>
      </section>

      <Section tone="ink-deep" labelledBy="modules-title" id="modules" class="grid-bg">
        <Container>
          <SectionHeader id="modules-title" index="02" label="Module map" title="Twelve modules, one student record" lede="Every module reads and writes the same data, so attendance, marks and fees always agree." align="split" />
          <div class="edx-map">
            <EduLynxMap />
          </div>
          <h3 class="modules__heading">All twelve modules</h3>
          <ul class="modules">
            {edulynx.modules.map((m) => (
              <li class={`module module--${m.key}`}>
                <h3>{m.name}</h3>
                <p>{m.body}</p>
              </li>
            ))}
          </ul>
          <p class="modules__more">
            <TextLink href={edulynx.modulesUrl} external event="external_product_click">
              Full module details on the EduLynx site
            </TextLink>
          </p>
        </Container>
      </Section>

      <Section tone="white" labelledBy="ai-title" id="ai">
        <Container>
          <div class="split">
            <div>
              <SectionHeader id="ai-title" index="03" label="AI layer" title="An assistant that reads your school's live data" lede={`The EduLynx AI operations assistant, powered by ${edulynx.ai.provider}, turns institutional data into briefings and recommendations — so staff know where to act first.`} />
            </div>
            <ul class="checklist">
              {edulynx.ai.capabilities.map((c) => (
                <li>
                  <CheckIcon />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
          <div class="edx-ai">
            <AIFlow />
          </div>
        </Container>
      </Section>

      <Section tone="paper" labelledBy="security-title" id="security">
        <Container>
          <SectionHeader id="security-title" title="Security designed in, not bolted on" lede="School data includes children's records. Every layer is built to protect it." align="split" />
          <ul class="security-grid">
            {edulynx.security.map((s) => (
              <li>
                <h3>{s.name}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ul>
          <p class="modules__more">
            <TextLink href={edulynx.securityUrl} external>
              EduLynx security practices
            </TextLink>
          </p>
        </Container>
      </Section>

      <Section tone="white" labelledBy="for-title">
        <Container>
          <div class="split">
            <SectionHeader id="for-title" title="Who it's for" lede="Role-based access means each person sees exactly what they need." />
            <ul class="roles">
              {edulynx.roles.map((r) => (
                <li>
                  <h3>{r.name}</h3>
                  <p>{r.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section tone="paper" labelledBy="how-title">
        <Container>
          <SectionHeader id="how-title" title="How it works" />
          <ol class="steps">
            {edulynx.steps.map((s, i) => (
              <li>
                <span class="steps__n" aria-hidden="true">
                  {String(i + 1)}
                </span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="white" labelledBy="pricing-title" id="pricing">
        <Container>
          <SectionHeader id="pricing-title" title="Pricing" lede={edulynx.pricing.note} align="split" />
          <div class="plans">
            {edulynx.pricing.plans.map((p, i) => (
              <article class={`plan${i === 1 ? " plan--emphasis" : ""}`}>
                <h3>{p.name}</h3>
                <p class="plan__price">
                  <span class="plan__amount">{p.display}</span> <span class="plan__basis">{p.basis}</span>
                </p>
                <ul class="checklist">
                  {p.includes.map((x) => (
                    <li>
                      <CheckIcon />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
                <ButtonLink href={edulynx.demoUrl} variant={i === 1 ? "primary" : "secondary"} external event="demo_request" eventLabel={p.name}>
                  Request a demo
                </ButtonLink>
              </article>
            ))}
          </div>
          <p class="small muted plans__source">
            Prices as published on erp.edulynxerp.in. The EduLynx site is the authoritative source for current pricing.
          </p>
        </Container>
      </Section>

      <Section tone="paper" labelledBy="faq-title">
        <Container narrow>
          <SectionHeader id="faq-title" title="Questions about EduLynx" />
          <Accordion items={edulynx.faqs.map((f) => ({ title: f.q, body: <p>{f.a}</p> }))} />
        </Container>
      </Section>

      <CtaBand
        title="See EduLynx with your school's workflows"
        body="Request a demo and we'll walk you through attendance, fees, exams and the AI assistant using the way your school actually works."
        primary={{ label: "Request a demo", href: edulynx.demoUrl }}
        secondary={{ label: "Talk to KrisLynx", href: "/contact?need=edulynx-demo" }}
      />
    </>
  ),
});
