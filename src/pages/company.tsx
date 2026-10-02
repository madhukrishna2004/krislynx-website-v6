import { company, formattedAddressLines } from "../config/company";
import { definePage } from "../lib/page";
import { organizationSchema, webPageSchema } from "../lib/schema";
import { Container, CtaBand, PageHero, Section, SectionHeader, TextLink } from "../components/ui";
import { Lifecycle } from "../components/diagrams";
import { ProductSystem } from "../components/viz";
import { Picture } from "../components/media";
import { officeShots } from "../config/office";

const crumbs = [{ name: "Home", path: "/" }, { name: "Company", path: "/company" }];
const description =
  "About KrisLynx Technologies: a software, AI and product engineering company in Nandyal, India — mission, principles, engineering approach, office and company information.";

const timeline = [
  { when: String(company.initiativeStartYear), what: "KrisLynx begins as a product initiative, researching personal AI (SelfMate) and safety wearables (FearLink)." },
  { when: "2024–2025", what: "Product work expands into education and trade technology, leading to EduLynx ERP and an internal trade-classification project." },
  { when: "2026", what: "EduLynx ERP is live for schools, with published pricing and an AI operations assistant." },
  { when: company.incorporationDateReadable, what: "Incorporated as KRISLYNX TECHNOLOGIES PRIVATE LIMITED under the Companies Act, 2013." },
];

const philosophy = [
  { title: "Write it down before building it", body: "Architecture decisions, data models and access rules are documented and reviewed. It is cheaper to change a paragraph than a production database." },
  { title: "Security is part of the definition of done", body: "A feature is not finished until authentication, authorisation, input validation and logging are in place." },
  { title: "Measure, then optimise", body: "We instrument what we ship and improve what the data shows is slow, confusing or unused." },
  { title: "Prefer boring technology", body: "We choose proven tools that the next engineer can maintain, and reserve novelty for where it creates real value — usually in the product, not the plumbing." },
];

export default definePage({
  path: "/company",
  title: "About — AI & Software Engineering Company",
  description,
  group: "company",
  breadcrumbs: crumbs,
  schema: [webPageSchema({ type: "AboutPage", name: "About KrisLynx Technologies", description, path: "/company" }), organizationSchema()],
  sitemap: { priority: 0.8, changefreq: "monthly" },
  render: () => {
    const workspace = officeShots.find((s) => s.key === "workspace");
    return (
      <>
        <PageHero
          crumbs={crumbs}
          title="We build software, AI and products — and stand behind them in production."
          lede={<p>A small, senior engineering team in Nandyal, Andhra Pradesh. We run our own product in production, and we build for other organizations with the same care.</p>}
        />

        <Section tone="white" labelledBy="who-title">
          <Container>
            <div class="split">
              <SectionHeader id="who-title" index="01" label="Company" title="Who we are" />
              <div class="prose-lg">
                <p>
                  KrisLynx is an engineering company first. We design, build and operate our own software — EduLynx ERP, our live school management platform, covers attendance, fees, examinations and communication — and we bring the same discipline to software we build for other organizations.
                </p>
                <p>
                  We're based in {company.address.locality}, Andhra Pradesh, and work with organizations in India and abroad. Being a small, senior team means the people you talk to are the people who build your system.
                </p>
              </div>
            </div>
            <ol class="timeline" aria-label="Company timeline">
              {timeline.map((t) => (
                <li>
                  <p class="timeline__when">{t.when}</p>
                  <p class="timeline__what">{t.what}</p>
                </li>
              ))}
            </ol>
          </Container>
        </Section>

        <Section tone="ink-deep" labelledBy="what-title" class="lightfield lightfield--mint">
          <Container>
            <SectionHeader id="what-title" index="02" label="What we build" title="Products and platforms on one engineering foundation" align="split" lede="EduLynx ERP is our flagship; SelfMate, FearLink, Miyraa and AP ExportAI share its engineering foundation. Client software is built on the same practices." />
            <ProductSystem />
          </Container>
        </Section>

        <Section tone="paper" labelledBy="believe-title">
          <Container>
            <SectionHeader id="believe-title" index="03" label="Principles" title="What we believe" align="split" lede="Four principles carried forward from KrisLynx's earliest days, made specific." />
            <dl class="vm">
              <div>
                <dt>Mission</dt>
                <dd>{company.mission}</dd>
              </div>
              <div>
                <dt>Vision</dt>
                <dd>{company.vision}</dd>
              </div>
            </dl>
            <ul class="principles">
              {company.principles.map((p) => (
                <li>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </li>
              ))}
            </ul>
          </Container>
        </Section>

        <Section tone="white" labelledBy="how-title">
          <Container>
            <SectionHeader id="how-title" index="04" label="Approach" title="How we build" lede="Every project, including our own products, follows the same lifecycle." align="split" />
            <Lifecycle />
          </Container>
        </Section>


        <Section tone="ink" labelledBy="philosophy-title">
          <Container>
            <SectionHeader id="philosophy-title" index="05" label="Engineering" title="Engineering philosophy" align="split" lede="The habits that make software dependable over years, not just at launch." />
            <ul class="philosophy">
              {philosophy.map((p) => (
                <li>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </li>
              ))}
            </ul>
          </Container>
        </Section>

        <Section tone="white" labelledBy="office-title">
          <Container>
            <div class="split split--media">
              <div>
                <SectionHeader id="office-title" index="06" label="Office" title="Our office" lede={`Second floor, Sreenivasa Nilayam, ${company.address.locality}. Our registered office and engineering base.`} />
                <TextLink href="/office">See the office</TextLink>
              </div>
              {workspace?.image ? <Picture name={workspace.image} alt={workspace.alt} sizes="(min-width: 64rem) 50vw, 100vw" /> : null}
            </div>
          </Container>
        </Section>

        <Section tone="paper" labelledBy="info-title" id="company-information">
          <Container>
            <SectionHeader id="info-title" index="08" label="Registration" title="Company information" lede="Registration details as recorded with the Ministry of Corporate Affairs." />
            <dl class="facts">
              <div>
                <dt>Legal name</dt>
                <dd>{company.legalName}</dd>
              </div>
              <div>
                <dt>Company type</dt>
                <dd>{company.companyType}</dd>
              </div>
              <div>
                <dt>Corporate Identity Number (CIN)</dt>
                <dd class="tabular">{company.cin}</dd>
              </div>
              <div>
                <dt>Incorporated</dt>
                <dd>
                  <time datetime={company.incorporationDate}>{company.incorporationDateReadable}</time>, under the Companies Act, 2013
                </dd>
              </div>
              <div>
                <dt>Registered office</dt>
                <dd>
                  <address>
                    {formattedAddressLines.map((l, i) => (
                      <>
                        {l}
                        {i < formattedAddressLines.length - 1 ? <br /> : null}
                      </>
                    ))}
                  </address>
                </dd>
              </div>
              <div>
                <dt>Contact</dt>
                <dd>
                  <a href={`mailto:${company.email}`}>{company.email}</a>
                </dd>
              </div>
            </dl>
            <p class="small muted facts__note">
              Registration details can be verified on the <a href="https://www.mca.gov.in/" rel="noopener" target="_blank">Ministry of Corporate Affairs website<span class="visually-hidden"> (opens in a new tab)</span></a>.
            </p>
          </Container>
        </Section>
        <CtaBand />
      </>
    );
  },
});
