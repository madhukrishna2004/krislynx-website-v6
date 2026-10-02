import { industries } from "../config/industries";
import { serviceBySlug } from "../config/services";
import { definePage } from "../lib/page";
import { webPageSchema } from "../lib/schema";
import { Container, CtaBand, PageHero, Section, StatusBadge } from "../components/ui";

const crumbs = [{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }];
const description =
  "Industries KrisLynx builds for: education (EduLynx ERP), trade and compliance, personal safety and wellbeing research, and business operations software.";

export default definePage({
  path: "/industries",
  title: "Industries We Build For",
  description,
  group: "service",
  breadcrumbs: crumbs,
  schema: [webPageSchema({ name: "Industries", description, path: "/industries" })],
  sitemap: { priority: 0.6, changefreq: "monthly" },
  render: () => (
    <>
      <PageHero
        crumbs={crumbs}
        title="Industries we build for"
        lede={<p>We list an industry only where we have built something real, and we show exactly what — and its status. Our engineering services apply well beyond these areas.</p>}
      />
      <Section tone="paper" labelledBy="ind-title">
        <Container>
          <h2 id="ind-title" class="visually-hidden">
            Industries
          </h2>
          <ul class="industries">
            {industries.map((ind) => (
              <li class="industry">
                <h3 class="display-3">{ind.name}</h3>
                <p class="industry__body">{ind.body}</p>
                <div class="industry__cols">
                  <div>
                    <h4>What we've built</h4>
                    {ind.evidence.length ? (
                      <ul class="industry__evidence">
                        {ind.evidence.map((e) => (
                          <li>
                            <a href={e.href}>{e.label}</a> <StatusBadge status={e.status} />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p class="muted">Delivered through our services rather than a KrisLynx product.</p>
                    )}
                  </div>
                  <div>
                    <h4>Relevant services</h4>
                    <ul class="industry__services">
                      {ind.services.map((slug) => {
                        const s = serviceBySlug(slug);
                        return s ? (
                          <li>
                            <a href={`/services/${s.slug}`}>{s.name}</a>
                          </li>
                        ) : null;
                      })}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <CtaBand title="Working in a different industry?" body="Most of our engineering isn't industry-specific. Tell us about the problem and we'll tell you honestly whether we're a good fit." />
    </>
  ),
});
