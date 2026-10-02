import { company } from "../config/company";
import { definePage } from "../lib/page";
import { Container, PageHero, Section, TextLink } from "../components/ui";
import { Picture } from "../components/media";

/**
 * INTERNAL leadership record. Owner decision (26 Sep 2026): the public story is about KrisLynx, not one
 * person. This route preserves the approved founder content but is NOT linked from navigation or any page,
 * is noindex, and is excluded from the sitemap. tests/founder.test.ts enforces all three.
 */
export default definePage({
  path: "/company/leadership",
  title: "Leadership (internal record)",
  description: "Internal record of KrisLynx Technologies leadership information. Not part of the public site navigation.",
  group: "company",
  noindex: true,
  excludeFromSitemap: true,
  render: () => {
    const people = company.leadership;
    return (
      <>
        <PageHero title="Leadership" lede={<p>Internal record. This page is intentionally not linked from the public site.</p>} />
        <Section tone="paper" labelledBy="lead-list">
          <Container>
            <h2 id="lead-list" class="visually-hidden">
              People
            </h2>
            {people.map((p) => (
              <article class="leader">
                <Picture name={p.image} alt={`Portrait of ${p.name}, ${p.role} of KrisLynx Technologies`} sizes="(min-width: 48rem) 20rem, 80vw" class="leader__photo" />
                <div class="leader__text">
                  <h3 class="display-3">{p.name}</h3>
                  <p class="leader__role">{p.role}</p>
                  <p class="lede">{p.bio}</p>
                  <p>
                    <TextLink href={p.linkedin} external>
                      {`${p.name} on LinkedIn`}
                    </TextLink>
                  </p>
                </div>
              </article>
            ))}
          </Container>
        </Section>
      </>
    );
  },
});
