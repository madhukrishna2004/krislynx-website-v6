import { raw, type Child } from "@kx/jsx-runtime";
import { articles, topics } from "../config/insights";
import { openRoles, workingHere } from "../config/careers";
import { company } from "../config/company";
import { edulynx } from "../config/products";
import { definePage, type PageDef } from "../lib/page";
import { absoluteUrl } from "../config/seo";
import { orgRef, postalAddress, webPageSchema } from "../lib/schema";
import { ButtonLink, CheckIcon, Container, PageHero, Section, SectionHeader, TextLink } from "../components/ui";
import { ContactForm } from "../components/ContactForm";

/* --------------------------------------------------------------- Insights */
const insightsCrumbs = [{ name: "Home", path: "/" }, { name: "Insights", path: "/insights" }];

export const insights = definePage({
  path: "/insights",
  title: "Insights — Engineering, AI and Product Writing",
  description: "Articles from KrisLynx on AI, software engineering, product development, education technology and enterprise systems.",
  group: "insights",
  breadcrumbs: insightsCrumbs,
  // Kept out of search results until real articles are published.
  noindex: articles.length === 0,
  render: () => (
    <>
      <PageHero crumbs={insightsCrumbs} title="Insights" lede={<p>Practical writing from the team that builds EduLynx ERP: what worked, what didn't, and why.</p>} />
      <Section tone="paper" labelledBy="topics-title">
        <Container>
          {articles.length === 0 ? (
            <div class="empty">
              <h2 id="topics-title" class="display-3">
                Our first articles are in progress
              </h2>
              <p class="lede">
                We'd rather publish nothing than filler. When articles are ready they'll appear here, grouped by the topics below. In the meantime, the <a href="/work">case studies</a> show how we work.
              </p>
            </div>
          ) : (
            <h2 id="topics-title" class="display-3">
              Latest articles
            </h2>
          )}
          {articles.length ? (
            <ul class="articles">
              {articles.map((a) => (
                <li>
                  <p class="small muted">{topics[a.topic].name}</p>
                  <h3>
                    <a href={`/insights/${a.slug}`}>{a.title}</a>
                  </h3>
                  <p>{a.description}</p>
                </li>
              ))}
            </ul>
          ) : null}
          <ul class="topics">
            {Object.values(topics).map((t) => (
              <li>
                <h3>{t.name}</h3>
                <p>{t.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  ),
});

export const articlePages: PageDef[] = articles.map((a) =>
  definePage({
    path: `/insights/${a.slug}`,
    title: a.title,
    description: a.description,
    group: "insights",
    ogType: "article",
    breadcrumbs: [...insightsCrumbs, { name: a.title, path: `/insights/${a.slug}` }],
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: a.title,
        description: a.description,
        datePublished: a.published,
        dateModified: a.updated ?? a.published,
        author: { "@type": "Person", name: a.author },
        publisher: orgRef,
        url: absoluteUrl(`/insights/${a.slug}`),
      },
    ],
    render: () => (
      <>
        <PageHero crumbs={[...insightsCrumbs, { name: a.title, path: `/insights/${a.slug}` }]} title={a.title} lede={<p>{a.description}</p>} tone="paper" />
        <Section tone="white" labelledBy="article-body">
          <Container narrow>
            <h2 id="article-body" class="visually-hidden">
              Article
            </h2>
            <div class="prose">{raw(a.bodyHtml)}</div>
          </Container>
        </Section>
      </>
    ),
  }),
);

/* ---------------------------------------------------------------- Careers */
const careersCrumbs = [{ name: "Home", path: "/" }, { name: "Careers", path: "/careers" }];

export const careers = definePage({
  path: "/careers",
  title: "Careers",
  description: "Careers at KrisLynx Technologies in Nandyal, Andhra Pradesh. See open positions or send an open application to work on software used every day.",
  group: "careers",
  breadcrumbs: careersCrumbs,
  schema: openRoles.map((r) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: r.title,
    description: `<p>${r.summary}</p>`,
    datePosted: r.datePosted,
    validThrough: r.validThrough,
    employmentType: r.employmentType,
    hiringOrganization: { "@type": "Organization", name: company.legalNameReadable, sameAs: company.url },
    jobLocation: { "@type": "Place", address: postalAddress },
    ...(r.remote ? { jobLocationType: "TELECOMMUTE" } : {}),
  })),
  sitemap: { priority: 0.5, changefreq: "weekly" },
  render: () => (
    <>
      <PageHero crumbs={careersCrumbs} title="Build software people rely on every day" lede={<p>We're a small team building real products in production. If you like owning your work end to end, we'd like to hear from you.</p>} />
      <Section tone="white" labelledBy="why-title">
        <Container>
          <SectionHeader id="why-title" title="Working at KrisLynx" />
          <ul class="why-grid why-grid--3">
            {workingHere.map((w) => (
              <li>
                <h3>{w.title}</h3>
                <p>{w.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <Section tone="paper" labelledBy="roles-title">
        <Container>
          <SectionHeader id="roles-title" title="Open positions" />
          {openRoles.length ? (
            <ul class="roles-list">
              {openRoles.map((r) => (
                <li>
                  <h3>{r.title}</h3>
                  <p class="muted">{r.location}</p>
                  <p>{r.summary}</p>
                  <ButtonLink href={`mailto:${company.careersEmail}?subject=${encodeURIComponent(`Application: ${r.title}`)}`} event="career_apply" eventLabel={r.slug}>
                    Apply by email
                  </ButtonLink>
                </li>
              ))}
            </ul>
          ) : (
            <div class="empty">
              <p class="lede">There are no open positions listed right now.</p>
              <p>
                You're still welcome to write to us. Send your CV and a short note about what you'd like to work on — engineering, design, AI or product — and we'll keep it on file for future roles.
              </p>
              <div class="actions">
                <ButtonLink href={`mailto:${company.careersEmail}?subject=${encodeURIComponent("Open application")}`} event="career_apply" eventLabel="open_application">
                  Send an open application
                </ButtonLink>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </>
  ),
});

/* ---------------------------------------------------------------- Contact */
const contactCrumbs = [{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }];
const contactDescription =
  "Contact KrisLynx Technologies about a software, AI or SaaS project, or request an EduLynx ERP demo. We reply to business enquiries within two working days.";

export const contact = definePage({
  path: "/contact",
  title: "Contact KRISLYNX Technologies Private Limited",
  absoluteTitle: true,
  description: contactDescription,
  group: "contact",
  breadcrumbs: contactCrumbs,
  schema: [webPageSchema({ type: "ContactPage", name: "Contact KrisLynx", description: contactDescription, path: "/contact" })],
  sitemap: { priority: 0.9, changefreq: "yearly" },
  render: () => (
    <>
      <section class="contact" aria-labelledby="contact-title">
        <Container class="contact__grid">
          <div class="contact__intro">
            <p class="tlabel">
              <span>Contact / Project pipeline</span>
            </p>
            <h1 id="contact-title" class="display-1 editorial">
              Start a <em>conversation.</em>
            </h1>
            <p class="lede">Tell us what you're building. A senior engineer reads every enquiry — not a sales queue.</p>
          </div>
          <div class="contact__aside">
            <ol class="next-steps" aria-label="What happens next">
              <li>
                <h2>We read and reply</h2>
                <p>An engineer reads it and replies directly — no sales queue.</p>
              </li>
              <li>
                <h2>A short call</h2>
                <p>30–45 minutes to understand the problem, scheduled in your time zone.</p>
              </li>
              <li>
                <h2>A clear proposal</h2>
                <p>Scope, approach and cost for a first release — or an honest "we're not the right fit".</p>
              </li>
            </ol>
            <div class="contact__direct">
              <h2>Prefer email?</h2>
              <p>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </p>
              <p class="muted small">
                {company.locationShort} · {company.timezoneLabel}
              </p>
              <h2>Looking for EduLynx ERP?</h2>
              <p>
                <TextLink href={edulynx.demoUrl} external event="demo_request">
                  Request an EduLynx demo
                </TextLink>
              </p>
            </div>
          </div>
          <div class="contact__form">
            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  ),
});

export const contactThanks = definePage({
  path: "/contact/thanks",
  title: "Thanks — Message Received",
  description: "Your message has reached KrisLynx Technologies. We reply to business enquiries within two working days.",
  group: "contact",
  noindex: true,
  excludeFromSitemap: true,
  render: () => (
    <PageHero
      title="Thanks — your message is with us."
      lede={<p>{company.responseTime} If it's urgent, email {company.email}.</p>}
      actions={
        <ButtonLink href="/" variant="inverse">
          Back to the homepage
        </ButtonLink>
      }
    />
  ),
});

/* ---------------------------------------------------------------- Pricing */
const pricingCrumbs = [{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }];

export const pricing = definePage({
  path: "/pricing",
  title: "Pricing — EduLynx ERP & Engineering",
  description: "How KrisLynx prices its work: published EduLynx ERP licences from ₹35,000 one-time plus AMC, and milestone-based quotes for custom engineering projects.",
  group: "product",
  breadcrumbs: pricingCrumbs,
  sitemap: { priority: 0.6, changefreq: "monthly" },
  render: () => (
    <>
      <PageHero crumbs={pricingCrumbs} title="Pricing" lede={<p>Our product has published prices. Engineering projects are quoted after a short discovery phase, in milestones you approve one at a time.</p>} />
      <Section tone="paper" labelledBy="edx-price">
        <Container>
          <SectionHeader id="edx-price" title="EduLynx ERP" lede={edulynx.pricing.note} align="split" />
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
              </article>
            ))}
          </div>
          <p class="small muted plans__source">
            Purchases of EduLynx ERP are made through the EduLynx ERP site and governed by its <a href="https://erp.edulynxerp.in/terms" rel="noopener" target="_blank">terms</a> and <a href="https://erp.edulynxerp.in/refund-policy" rel="noopener" target="_blank">refund policy</a>.
          </p>
        </Container>
      </Section>
      <Section tone="white" labelledBy="svc-price">
        <Container>
          <div class="split">
            <SectionHeader id="svc-price" title="Engineering services" />
            <div class="prose-lg">
              <p>Every project is different, so we don't publish rate cards. After a short discovery conversation we provide a written estimate for a first release, split into milestones with a fixed scope and price for each.</p>
              <p>No payments are taken on krislynx.com. Service payments are invoiced under a signed agreement.</p>
              <p>
                <TextLink href="/contact">Ask for an estimate</TextLink>
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  ),
});

/* ------------------------------------------------------------------ Legal */
interface LegalSection { title: string; body: Child }

function legalPage(args: { path: string; title: string; h1: string; description: string; updated: string; intro: string; sections: LegalSection[] }): PageDef {
  const crumbs = [{ name: "Home", path: "/" }, { name: args.h1, path: args.path }];
  return definePage({
    path: args.path,
    title: args.title,
    description: args.description,
    group: "legal",
    breadcrumbs: crumbs,
    sitemap: { priority: 0.3, changefreq: "yearly" },
    render: () => (
      <>
        <PageHero crumbs={crumbs} tone="paper" title={args.h1} lede={<p>{args.intro}</p>} meta={<p class="small muted">Last updated <time datetime={args.updated}>{new Date(args.updated).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time></p>} />
        <Section tone="white" labelledBy="legal-body">
          <Container narrow>
            <h2 id="legal-body" class="visually-hidden">
              Policy
            </h2>
            <div class="prose">
              {args.sections.map((s, i) => (
                <section aria-labelledby={`legal-${i}`}>
                  <h2 id={`legal-${i}`}>{s.title}</h2>
                  {s.body}
                </section>
              ))}
            </div>
          </Container>
        </Section>
      </>
    ),
  });
}

const who = `${company.legalNameReadable} (CIN ${company.cin}), registered office ${company.address.building}, ${company.address.street}, ${company.address.locality}, ${company.address.district} – ${company.address.postalCode}, ${company.address.region}, India`;
const UPDATED = "2026-09-26";

export const privacy = legalPage({
  path: "/privacy-policy",
  title: "Privacy Policy",
  h1: "Privacy policy",
  description: "How KRISLYNX TECHNOLOGIES PRIVATE LIMITED collects, uses and protects personal information submitted through krislynx.com, and how to exercise your rights.",
  updated: UPDATED,
  intro: `This policy explains how ${company.legalNameReadable} ("KrisLynx", "we") handles personal information collected through krislynx.com. Our products, such as EduLynx ERP, have their own privacy policies.`,
  sections: [
    { title: "Who we are", body: <p>{who}. Contact: <a href={`mailto:${company.privacyEmail}`}>{company.privacyEmail}</a>.</p> },
    {
      title: "Information we collect",
      body: (
        <ul>
          <li><strong>Enquiries.</strong> When you use the contact form: your name, business email, company, country, optional phone number, what you need, project details, optional timeline, budget and attachment, and your browser time zone.</li>
          <li><strong>Applications.</strong> If you email us a CV, the information you choose to send.</li>
          <li><strong>Technical data.</strong> Our hosting provider processes IP addresses and request logs to deliver and secure the site. We store a one-way hash of your IP address for up to 24 hours to limit spam submissions.</li>
          <li><strong>Analytics (only with consent).</strong> If you accept analytics cookies, Google Analytics collects usage data such as pages viewed and device type. We never send form contents to analytics.</li>
        </ul>
      ),
    },
    { title: "The KrisLynx Assistant", body: <p>The on-site assistant answers from a fixed set of approved company information inside your browser. Your questions are not sent to our servers or to any AI provider. If this changes, we will update this policy before it does.</p> },
    {
      title: "How we use information",
      body: (
        <ul>
          <li>To reply to your enquiry and discuss a potential engagement.</li>
          <li>To consider job applications.</li>
          <li>To keep the site secure and prevent spam and abuse.</li>
          <li>With consent, to understand which pages are useful and improve the site.</li>
        </ul>
      ),
    },
    { title: "Sharing", body: <p>We do not sell personal information. We share it only with service providers who help us operate the site and respond to you (hosting, email delivery and, with consent, analytics), under confidentiality obligations, or where required by law.</p> },
    { title: "International transfers", body: <p>Our service providers may process data outside India. Where they do, we rely on their contractual and security commitments to protect it.</p> },
    { title: "Retention", body: <p>Enquiries are kept for up to 24 months after our last contact with you, then deleted, unless they become part of a contract. You can ask us to delete an enquiry sooner.</p> },
    { title: "Your rights", body: <p>You can ask to access, correct or delete your personal information, withdraw consent, or raise a grievance by emailing <a href={`mailto:${company.privacyEmail}`}>{company.privacyEmail}</a>. We will respond within 30 days. You may also have rights under the laws of your country, including India's Digital Personal Data Protection Act, 2023 once in force, and the GDPR if you are in the EU or UK.</p> },
    { title: "Security", body: <p>We use encrypted connections (HTTPS), restricted access to enquiry data and server-side secret management. No method of transmission or storage is completely secure.</p> },
    { title: "Changes", body: <p>We will post any changes on this page and update the date above.</p> },
  ],
});

export const terms = legalPage({
  path: "/terms-of-service",
  title: "Terms of Service",
  h1: "Terms of service",
  description: "The terms that apply to your use of the krislynx.com website operated by KRISLYNX TECHNOLOGIES PRIVATE LIMITED, Nandyal, Andhra Pradesh, India.",
  updated: UPDATED,
  intro: "These terms govern your use of krislynx.com. Our products and client engagements are governed by their own agreements.",
  sections: [
    { title: "About us", body: <p>This website is operated by {who}.</p> },
    { title: "Using the site", body: <p>You may use this site to learn about KrisLynx and contact us. You must not attempt to disrupt the site, gain unauthorised access to any system, submit unlawful or malicious content, or use automated means to submit forms.</p> },
    { title: "Information on the site", body: <p>We aim to keep information accurate and current, but it is provided for general information and may change. Product details and prices shown for EduLynx ERP are published by the EduLynx ERP site, which is the authoritative source.</p> },
    { title: "Intellectual property", body: <p>The KrisLynx name, logo, product names and site content belong to KrisLynx or its licensors. You may not reuse them without written permission, except to refer to KrisLynx accurately.</p> },
    { title: "Links to other sites", body: <p>Links to third-party sites are provided for convenience. We are not responsible for their content or practices.</p> },
    { title: "Liability", body: <p>To the extent permitted by law, KrisLynx is not liable for indirect or consequential loss arising from use of this site. Nothing in these terms limits liability that cannot be limited by law.</p> },
    { title: "Governing law", body: <p>These terms are governed by the laws of India. Courts in Andhra Pradesh have jurisdiction, subject to any mandatory rights you have in your own country.</p> },
    { title: "Contact", body: <p><a href={`mailto:${company.email}`}>{company.email}</a></p> },
  ],
});

export const refund = legalPage({
  path: "/refund-policy",
  title: "Refund & Cancellation Policy",
  h1: "Refund and cancellation policy",
  description: "Refund and cancellation terms for KrisLynx Technologies: EduLynx ERP licences and engineering services. No payments are taken on krislynx.com.",
  updated: UPDATED,
  intro: "No payments are accepted on krislynx.com. This page explains which terms apply to purchases from KrisLynx.",
  sections: [
    { title: "EduLynx ERP", body: <p>EduLynx ERP licences and annual maintenance are purchased through the EduLynx ERP site and are covered by the <a href="https://erp.edulynxerp.in/refund-policy" rel="noopener" target="_blank">EduLynx ERP refund policy</a>.</p> },
    { title: "Engineering services", body: <p>Refunds and cancellations for software development, AI, SaaS and other engineering services are set out in the signed agreement for each engagement, including what happens to completed milestones and work in progress.</p> },
    { title: "Questions", body: <p>Email <a href={`mailto:${company.email}`}>{company.email}</a> with your invoice or agreement reference.</p> },
  ],
});

export const cookies = legalPage({
  path: "/cookie-policy",
  title: "Cookie Policy",
  h1: "Cookie policy",
  description: "Which cookies and browser storage krislynx.com uses, why, and how to accept or decline analytics cookies at any time.",
  updated: UPDATED,
  intro: "We keep cookies to a minimum. The site works fully without any optional cookies.",
  sections: [
    { title: "Strictly necessary storage", body: <p>If you make a cookie choice, we store it in your browser's local storage under the key <code>kx-consent</code> so we don't ask again. It contains only "granted" or "denied".</p> },
    { title: "Analytics cookies (optional)", body: <p>With your consent, Google Analytics sets cookies (such as <code>_ga</code>) to measure how the site is used. They are never set before you accept. IP addresses are anonymised and advertising features are disabled.</p> },
    { title: "Changing your choice", body: <p>Use the "Cookie settings" link in the footer at any time, or clear your browser storage.</p> },
  ],
});

export const accessibility = legalPage({
  path: "/accessibility",
  title: "Accessibility Statement",
  h1: "Accessibility statement",
  description: "KrisLynx aims for krislynx.com to meet WCAG 2.2 level AA. What we've done, known limitations, and how to report an accessibility problem.",
  updated: UPDATED,
  intro: "We want everyone to be able to use this website, including people who use screen readers, keyboards, magnification or other assistive technology.",
  sections: [
    { title: "Our target", body: <p>We design and test against the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA. We have not yet commissioned an independent audit, so we do not claim formal conformance.</p> },
    {
      title: "What we've done",
      body: (
        <ul>
          <li>Semantic HTML with one main heading per page, landmarks and a skip link.</li>
          <li>Every interactive element works with a keyboard and shows a visible focus indicator.</li>
          <li>Menus, the assistant and the photo viewer use native accessible dialogs.</li>
          <li>Form fields have labels, and errors are announced and linked to their fields.</li>
          <li>Text colours meet AA contrast ratios; animation is disabled when you ask your system to reduce motion.</li>
          <li>Content is fully usable without JavaScript, apart from file attachments and the assistant.</li>
        </ul>
      ),
    },
    { title: "Known limitations", body: <p>Some product logos and photos come from third parties and may not be perfectly optimised. Linked sites, including the EduLynx ERP site, are covered by their own statements.</p> },
    { title: "Report a problem", body: <p>Email <a href={`mailto:${company.email}`}>{company.email}</a> with the page address and the problem. We aim to respond within five working days.</p> },
  ],
});

/* -------------------------------------------------------------------- 404 */
export const notFound = definePage({
  path: "/404",
  title: "Page Not Found",
  description: "The page you were looking for doesn't exist on krislynx.com. It may have moved when we rebuilt the site.",
  group: "system",
  noindex: true,
  excludeFromSitemap: true,
  render: () => (
    <PageHero
      title="This route doesn't exist."
      lede={
        <>
          <p class="tlabel">
            <span>Error 404 · system path not found</span>
          </p>
          <p>The page may have moved when the site was rebuilt. These routes are known to work:</p>
        </>
      }
      actions={
        <>
          <ButtonLink href="/" variant="inverse">
            Return to KrisLynx
          </ButtonLink>
          <ButtonLink href="/products/edulynx-erp" variant="ghost">
            EduLynx ERP
          </ButtonLink>
          <ButtonLink href="/services" variant="ghost">
            Services
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost">
            Contact
          </ButtonLink>
        </>
      }
    />
  ),
});
