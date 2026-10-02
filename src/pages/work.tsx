import { caseStudies, type CaseStudy } from "../config/work";
import { serviceBySlug } from "../config/services";
import { definePage, type PageDef } from "../lib/page";
import { orgRef, webPageSchema } from "../lib/schema";
import { absoluteUrl } from "../config/seo";
import { assets } from "../lib/assets";
import { ButtonLink, Container, CtaBand, PageHero, Section, Tags, TextLink } from "../components/ui";
import { CaseFiles } from "../components/viz";
import { Picture } from "../components/media";

const indexCrumbs = [{ name: "Home", path: "/" }, { name: "Work", path: "/work" }];
const indexDescription =
  "KrisLynx case studies: EduLynx ERP (live), SelfMate and FearLink (research) and an internal trade-classification project. Problem, approach, technology, status.";

export const workIndex = definePage({
  path: "/work",
  title: "Work & Case Studies",
  description: indexDescription,
  group: "work",
  breadcrumbs: indexCrumbs,
  schema: [
    {
      ...webPageSchema({ type: "CollectionPage", name: "KrisLynx work", description: indexDescription, path: "/work" }),
      mainEntity: {
        "@type": "ItemList",
        itemListElement: caseStudies.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, url: absoluteUrl(`/work/${c.slug}`) })),
      },
    },
  ],
  sitemap: { priority: 0.8, changefreq: "monthly" },
  render: () => (
    <>
      <PageHero
        crumbs={indexCrumbs}
        title="Work"
        lede={<p>Products and projects that show how we engineer. Each case study states the problem, our approach, the technology and where the work stands today. We don't publish results we can't evidence.</p>}
      />
      <Section tone="ink" labelledBy="cases-title">
        <Container>
          <h2 id="cases-title" class="visually-hidden">
            Case studies
          </h2>
          <CaseFiles />
        </Container>
      </Section>
      <CtaBand />
    </>
  ),
});

const Block = (props: { id: string; title: string; children?: import("@kx/jsx-runtime").Child }) => (
  <section class="cs-block" aria-labelledby={props.id}>
    <h2 id={props.id} class="cs-block__title">
      {props.title}
    </h2>
    <div class="cs-block__body">{props.children}</div>
  </section>
);

function casePage(c: CaseStudy): PageDef {
  const path = `/work/${c.slug}`;
  const crumbs = [...indexCrumbs, { name: c.name, path }];
  const description = `${c.name} case study: ${c.summary}`.slice(0, 165).replace(/\s\S*$/, "") + ".";
  return definePage({
    path,
    title: `${c.name} — Case Study`,
    description,
    group: "work",
    breadcrumbs: crumbs,
    ogType: "article",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: `${c.name} — case study`,
        description: c.summary,
        url: absoluteUrl(path),
        author: orgRef,
        publisher: orgRef,
        dateModified: assets.buildDate,
        about: c.name,
      },
    ],
    sitemap: { priority: 0.7, changefreq: "monthly" },
    render: () => (
      <>
        <PageHero
          crumbs={crumbs}
          meta={
            <>
              <span class="page-hero__by">{c.kind}</span>
            </>
          }
          title={c.name}
          lede={<p>{c.summary}</p>}
          actions={
            c.links.length ? (
              <>
                {c.links.map((l, i) => (
                  <ButtonLink href={l.href} external={l.external} variant={i === 0 ? "inverse" : "ghost"} event={l.external ? "external_product_click" : undefined}>
                    {l.label}
                  </ButtonLink>
                ))}
              </>
            ) : undefined
          }
        />
        <Section tone="white" labelledBy="cs-overview">
          <Container>
            <h2 id="cs-overview" class="visually-hidden">
              Case study
            </h2>
            <div class="cs">
              <aside class="cs__aside" aria-label="Summary">
                {c.image ? <Picture name={c.image} alt={`${c.name} logo`} sizes="16rem" class="cs__logo" /> : null}
                <dl>
                  <div>
                    <dt>Type</dt>
                    <dd>{c.kind}</dd>
                  </div>
                  <div>
                    <dt>Services involved</dt>
                    <dd>
                      <ul class="plain-list">
                        {c.relatedServices.map((slug) => {
                          const s = serviceBySlug(slug);
                          return s ? (
                            <li>
                              <a href={`/services/${s.slug}`}>{s.name}</a>
                            </li>
                          ) : null;
                        })}
                      </ul>
                    </dd>
                  </div>
                </dl>
              </aside>
              <div class="cs__main">
                <Block id="cs-challenge" title="The challenge">
                  <p>{c.challenge}</p>
                </Block>
                <Block id="cs-context" title="The context">
                  <p>{c.context}</p>
                </Block>
                <Block id="cs-approach" title="The approach">
                  <ol class="numbered">
                    {c.approach.map((a) => (
                      <li>{a}</li>
                    ))}
                  </ol>
                </Block>
                <Block id="cs-solution" title="The solution">
                  <ul class="bulleted">
                    {c.solution.map((a) => (
                      <li>{a}</li>
                    ))}
                  </ul>
                </Block>
                <Block id="cs-tech" title="The technology">
                  <Tags items={c.technology} />
                </Block>
                <Block id="cs-experience" title="The product experience">
                  <p>{c.experience}</p>
                </Block>
                <Block id="cs-status" title="The current status">
                  <p>
                    
                  </p>
                </Block>
                <p class="cs__back">
                  <TextLink href="/work">All work</TextLink>
                </p>
              </div>
            </div>
          </Container>
        </Section>
        <CtaBand />
      </>
    ),
  });
}

export const casePages: PageDef[] = caseStudies.map(casePage);
