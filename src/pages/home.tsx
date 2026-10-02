import type { Child, SafeHtml } from "@kx/jsx-runtime";
import { company } from "../config/company";
import { edulynx } from "../config/products";
import { officeShots } from "../config/office";
import { seo } from "../config/seo";
import { definePage } from "../lib/page";
import { organizationSchema, webPageSchema, websiteSchema } from "../lib/schema";
import { ButtonLink, Container, TechLabel, TextLink } from "../components/ui";
import { AIFlow, CaseFiles, EduLynxMap, EduLynxOrbit, HeroCore, IntakeChips, LifecycleFlow, ProductSystem, InfraPhoto, SectionRail, ServiceSystems, TechArchitecture } from "../components/viz";
import { Picture } from "../components/media";

type Room = "void" | "ink" | "graphite" | "warm" | "ice" | "mint" | "lilac";

/** A room: eyebrow → headline → short explanation → visual → action. */
function Room(props: { id: string; n: string; label: string; room: Room; from?: Room; product?: boolean; title: Child; lede?: Child; aside?: Child; children?: Child; bare?: boolean }): SafeHtml {
  return (
    <section id={props.id} class={`room room--${props.room} chapter${props.from ? ` from--${props.from}` : ""}`} data-product-zone={props.product ? "" : undefined} aria-labelledby={`${props.id}-title`}>
      <Container>
        <header class="chapter__head">
          <div>
            <TechLabel index={props.n} label={props.label} />
            <h2 id={`${props.id}-title`} class="display-2 editorial">
              {props.title}
            </h2>
          </div>
          {props.lede || props.aside ? (
            <div class="chapter__lede">
              {props.lede}
              {props.aside}
            </div>
          ) : null}
        </header>
        <div data-reveal="">{props.children}</div>
      </Container>
    </section>
  );
}

const rail = [
  ["top", "01", "KrisLynx"], ["built-here", "", "Workspace"], ["company", "02", "What we build"], ["engineer", "03", "Engineer"], ["products", "04", "Products"],
  ["flagship", "05", "EduLynx"], ["inside", "06", "Inside EduLynx"], ["intelligence", "07", "Intelligence"], ["engineering", "08", "Engineering"],
  ["technology", "09", "Infrastructure"], ["work", "10", "Work"], ["about", "11", "Where we build"], ["start", "12", "Start"],
].map(([id, n, label]) => ({ id: id ?? "", n: n ?? "", label: label ?? "" }));

const meeting = officeShots.find((s) => s.key === "meeting");

export default definePage({
  path: "/",
  title: seo.defaultTitle,
  absoluteTitle: true,
  description: seo.defaultDescription,
  group: "home",
  schema: [organizationSchema(), websiteSchema(), webPageSchema({ name: seo.defaultTitle, description: seo.defaultDescription, path: "/" })],
  sitemap: { priority: 1, changefreq: "weekly" },
  render: () => (
    <>
      <SectionRail items={rail} />

      {/* 01 — ENTER KRISLYNX */}
      <section id="top" class="room room--void hero3 pointer-light" aria-labelledby="home-title">
        <div class="hero3__grid-bg" aria-hidden="true"></div>
        <Container class="hero3__grid">
          <div class="hero3__text">
            <p class="tlabel hero3__id">
              <span class="tlabel__index">KrisLynx Technologies</span>
              <span class="hero3__meta mono" aria-hidden="true">System / 01 · Architecture / Active</span>
            </p>
            <h1 id="home-title" class="display-1 editorial hero3__title">
              <span class="hl hl--light">We build</span> <span class="hl">software</span> <span class="hl hl--light">that has</span> <span class="hl"><em>to work.</em></span>
            </h1>
            <p class="hero3__domains mono">Software / AI / Products</p>
            <p class="lede-sm hero3__lede">
              Systems engineered for real-world operations, not demonstrations. From {company.address.locality}, India — the makers of EduLynx ERP.
            </p>
            <div class="actions">
              <ButtonLink href="#flagship" variant="inverse" size="lg" event="product_view" eventLabel="hero_edulynx">
                Explore EduLynx
              </ButtonLink>
              <ButtonLink href="/contact" variant="ghost" size="lg" event="cta_click" eventLabel="hero_project">
                Start a project
              </ButtonLink>
            </div>
          </div>
          <div class="hero3__visual">
            <HeroCore />
          </div>
        </Container>
      </section>

      {/* 01b — REAL WORKSPACE: the first photograph (real, enhanced) */}
      <section id="built-here" class="room room--void workspace from--void" aria-labelledby="built-here-title">
        <Container>
          <header class="workspace__head">
            <TechLabel label="KrisLynx / Workspace" />
            <h2 id="built-here-title" class="display-2 editorial">
              Where software <em>gets built.</em>
            </h2>
          </header>
        </Container>
        <figure class="workspace__frame" data-reveal="media">
          <Picture name="krislynx-workspace" mobile="krislynx-workspace-mobile" mobileSizes="100vw" alt="The KrisLynx office in Nandyal: the company sign with its registered address on the wall, a window, and a new office chair still in its wrapping" sizes="(min-width: 90rem) 88rem, 100vw" />
          <div class="workspace__labels" aria-hidden="true">
            <span>Build</span>
            <span>Test</span>
            <span>Ship</span>
          </div>
          <span class="photo-meta" aria-hidden="true">KrisLynx / Workspace · Nandyal</span>
          <figcaption class="workspace__cap">Our office on the second floor of Sreenivasa Nilayam, Nandyal.</figcaption>
        </figure>
      </section>

      {/* 02 — THE COMPANY */}
      <Room id="company" from="void" n="02" label="What we build" room="warm" title={<>We run what <em>we build.</em></>} lede={<p class="lede-sm">We start from a real problem — a school that can’t see overdue fees, a team buried in manual reports — and build the smallest reliable system that fixes it. Then we run it.</p>}>
        <ul class="triad">
          <li>
            <span class="mono">Software</span>Applications and APIs people run their work on.
          </li>
          <li>
            <span class="mono">AI</span>Assistants that answer from an organization’s own data.
          </li>
          <li>
            <span class="mono">Products</span>Our own software, operated in production.
          </li>
        </ul>
      </Room>

      {/* 04 — WHAT WE ENGINEER */}
      <Room id="engineer" from="warm" n="03" label="What we engineer" room="ice" title={<>Three systems we build <em>for other organizations.</em></>}>
        <ServiceSystems />
      </Room>

      {/* 10 — PRODUCTS */}
      <Room id="products" from="ice" n="04" label="Products" room="ink" title={<>Products, <em>one engineering core.</em></>} lede={<p class="lede-sm">EduLynx ERP leads. Each product is its own brand, built on the same foundations.</p>}>
        <ProductSystem />
      </Room>

      {/* 05 — FLAGSHIP */}
      <section id="flagship" class="room room--mint flagship chapter from--ink" data-product-zone="" aria-labelledby="flagship-title">
        <Container>
          <p class="handoff" aria-hidden="true">
            <span class="handoff__from mono">KrisLynx system</span>
            <span class="handoff__line"></span>
            <span class="handoff__mid mono">Products</span>
            <span class="handoff__line"></span>
            <span class="handoff__to mono">EduLynx</span>
          </p>
          <div class="flagship__mast">
            <p class="tlabel">
              <span class="tlabel__index">05</span>
              <span class="tlabel__sep" aria-hidden="true">/</span>
              <span>Flagship product</span>
            </p>
            <div class="flagship__row">
              <h2 id="flagship-title" class="flagship__name editorial">EduLynx ERP</h2>
            </div>
            <p class="flagship__tag">An intelligent school management platform by KrisLynx.</p>
          </div>
          <dl class="flagship__facts">
            <div>
              <dt class="mono">Modules</dt>
              <dd>{edulynx.modules.length}</dd>
            </div>
            <div>
              <dt class="mono">Roles</dt>
              <dd>{edulynx.architecture.roles.length}</dd>
            </div>
            <div>
              <dt class="mono">AI assistant</dt>
              <dd>{edulynx.ai.provider}</dd>
            </div>
            <div>
              <dt class="mono">Pricing</dt>
              <dd>from {edulynx.pricing.plans[0]?.display ?? "—"}</dd>
            </div>
          </dl>
          <div data-reveal="">
            <EduLynxOrbit />
          </div>
          <div class="actions">
            <ButtonLink href="/products/edulynx-erp" variant="primary" event="product_view" eventLabel="home_flagship">
              Explore EduLynx ERP
            </ButtonLink>
            <ButtonLink href={edulynx.url} variant="secondary" external event="external_product_click" eventLabel="home_flagship">
              erp.edulynxerp.in
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* 06 — INSIDE EDULYNX */}
      <Room id="inside" from="mint" product n="06" label="Inside EduLynx" room="graphite" title={<>One school. One record. <em>Every module on it.</em></>} lede={<p class="lede-sm">Select a module. The interface is illustrative; the capabilities are the product’s published ones.</p>}>
        <EduLynxMap />
      </Room>

      {/* 07 — INTELLIGENCE */}
      <Room id="intelligence" from="graphite" n="07" label="Intelligence" room="lilac" title={<>AI with a person <em>at the end of it.</em></>} lede={<p class="lede-sm">A question travels through context, authorized data, a model and validation — and ends with a human decision.</p>}>
        <AIFlow />
      </Room>

      {/* 08 — ENGINEERING */}
      <Room id="engineering" from="lilac" n="08" label="Engineering" room="void" title={<>From idea to production, <em>in eight steps.</em></>} lede={<p class="lede-sm">Each step ends with something you can review.</p>}>
        <LifecycleFlow />
      </Room>

      {/* 09 — TECHNOLOGY */}
      <Room id="technology" from="void" n="09" label="Technology / Infrastructure" room="ice" title={<>Architecture first. <em>Then tools.</em></>} lede={<p class="lede-sm">Six layers every system we build has, with the technology we actually use in each. Security runs through all of them.</p>}>
        <TechArchitecture />
        <InfraPhoto />
      </Room>

      {/* 11 — WORK */}
      <Room id="work" from="ice" n="10" label="Work" room="graphite" title={<>Case files.</>} lede={<p class="lede-sm">What we built and where it stands. No invented results.</p>} aside={<TextLink href="/work">All work</TextLink>}>
        <CaseFiles compact />
      </Room>

      {/* 12 — COMPANY (environment) */}
      <section id="about" class="room room--warm about3 chapter from--graphite" aria-labelledby="about-title">
        <Container>
          <div class="about3__grid">
            <div>
              <TechLabel index="11" label="Where we build" />
              <h2 id="about-title" class="display-2 editorial">
                Second floor, Sreenivasa Nilayam, <em>Nandyal.</em>
              </h2>
              <dl class="about3__facts">
                <div>
                  <dt class="mono">Company</dt>
                  <dd>{company.legalName}</dd>
                </div>
                <div>
                  <dt class="mono">CIN</dt>
                  <dd class="tabular">{company.cin}</dd>
                </div>
                <div>
                  <dt class="mono">Mission</dt>
                  <dd>{company.mission}</dd>
                </div>
              </dl>
              <p class="about3__links">
                <TextLink href="/company">About the company</TextLink>
                <TextLink href="/office">The office</TextLink>
              </p>
            </div>
            {meeting?.image ? (
              <figure class="about3__photo" data-reveal="media">
                <Picture name={meeting.image} alt={meeting.alt} sizes="(min-width: 64rem) 55vw, 100vw" />
                <figcaption class="mono">Meeting room · KrisLynx office, Nandyal</figcaption>
              </figure>
            ) : null}
          </div>
        </Container>
      </section>

      {/* 13 — START SOMETHING */}
      <section id="start" class="room room--void closing3 chapter pointer-light from--warm" aria-labelledby="start-title">
        <Container class="closing">
          <TechLabel index="12" label="Start something" />
          <h2 id="start-title" class="display-2 editorial closing__title">
            Build something <em>real.</em>
          </h2>
          <p class="lede-sm">A senior engineer reads every enquiry and replies within two working days.</p>
          <IntakeChips />
          <div class="actions">
            <ButtonLink href="/contact" variant="inverse" size="lg" event="cta_click" eventLabel="home_start">
              Start the conversation
            </ButtonLink>
            <a class="closing__mail" href={`mailto:${company.email}`}>
              {company.email}
            </a>
          </div>
        </Container>
      </section>
    </>
  ),
});
