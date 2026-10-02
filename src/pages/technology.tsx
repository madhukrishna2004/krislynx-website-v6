import { definePage } from "../lib/page";
import { webPageSchema } from "../lib/schema";
import { Container, PageHero, SectionHeader, TextLink } from "../components/ui";
import { AIFlow, InfraPhoto, LifecycleFlow, TechArchitecture } from "../components/viz";

const crumbs = [{ name: "Home", path: "/" }, { name: "Technology", path: "/technology" }];
const description =
  "How KrisLynx engineers software: a six-layer architecture, an AI pipeline that ends in a human decision, and an eight-step engineering lifecycle.";

export default definePage({
  path: "/technology",
  title: "Technology & Engineering | KRISLYNX",
  absoluteTitle: true,
  description,
  group: "company",
  breadcrumbs: crumbs,
  schema: [webPageSchema({ name: "Technology & Engineering at KrisLynx", description, path: "/technology" })],
  sitemap: { priority: 0.8, changefreq: "monthly" },
  render: () => (
    <>
      <PageHero crumbs={crumbs} title="How we engineer software that has to work" lede={<p>Architecture first, then tools. Every system we build has the same layers, the same review points and a person at the end of every AI decision.</p>} />
      <section class="room room--ice chapter" aria-labelledby="t-arch">
        <Container>
          <SectionHeader id="t-arch" kicker="01 · Architecture" title="Six layers, security through all of them" lede="The technology we actually use, placed where it belongs." align="split" />
          <TechArchitecture />
          <InfraPhoto />
        </Container>
      </section>
      <section class="room room--lilac chapter from--ice" aria-labelledby="t-ai">
        <Container>
          <SectionHeader id="t-ai" kicker="02 · Intelligence" title="AI with a person at the end of it" lede="Question, context, authorised data, model, validation, response — then a human decision." align="split" />
          <AIFlow />
        </Container>
      </section>
      <section class="room room--void chapter from--lilac" aria-labelledby="t-eng">
        <Container>
          <SectionHeader id="t-eng" kicker="03 · Engineering" title="From idea to production in eight steps" lede="Each step ends with something you can review." align="split" />
          <LifecycleFlow />
          <p class="tech-next">
            <TextLink href="/services">Engineering services</TextLink>
            <TextLink href="/work">Case files</TextLink>
            <TextLink href="/contact">Start a project</TextLink>
          </p>
        </Container>
      </section>
    </>
  ),
});
