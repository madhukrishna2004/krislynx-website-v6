import { products } from "../config/products";
import { definePage } from "../lib/page";
import { webPageSchema } from "../lib/schema";
import { absoluteUrl } from "../config/seo";
import { Container, CtaBand, PageHero, Section, SectionHeader, StatusBadge, ButtonLink } from "../components/ui";
import { ProductCard } from "../components/cards";
import { ProductSystem } from "../components/viz";

const crumbs = [{ name: "Home", path: "/" }, { name: "Products", path: "/products" }];
const description =
  "Software, AI and product engineering by KRISLYNX. EduLynx ERP is the flagship school management platform.";

export default definePage({
  path: "/products",
  title: "Products | Software & AI Products",
  description,
  group: "product",
  breadcrumbs: crumbs,
  schema: [
    {
      ...webPageSchema({ type: "CollectionPage", name: "KrisLynx products", description, path: "/products" }),
      mainEntity: {
        "@type": "ItemList",
        itemListElement: products.filter((p) => p.status === "live").map((p, i) => ({ "@type": "ListItem" as const, position: i + 1, name: p.name, url: absoluteUrl(p.href) })),
      },
    },
  ],
  sitemap: { priority: 0.8, changefreq: "monthly" },
  render: () => {
    const featured = products.find((p) => p.status === "live");
    const others = products.filter((p) => p !== featured);
    return (
      <>
        <PageHero
          crumbs={crumbs}
          title="Products we build and operate"
          lede={<p>KrisLynx is the company; each product is its own brand. EduLynx ERP is our flagship.</p>}
        />
        <Section tone="ink-deep" labelledBy="eco-title" class="lightfield lightfield--mint">
          <Container>
            <h2 id="eco-title" class="visually-hidden">
              Product ecosystem
            </h2>
            <ProductSystem />
          </Container>
        </Section>
        <Section tone="paper" labelledBy="featured-title">
          <Container>
            <h2 id="featured-title" class="visually-hidden">
              Featured product
            </h2>

            {featured ? (
              <article class="product-feature">
                <div class="product-feature__meta">
                  <p>{featured.category}</p>
                  <StatusBadge status={featured.status} />
                </div>
                <h3 class="display-2">{featured.name}</h3>
                <p class="lede">{featured.summary}</p>
                <p class="muted">{featured.audience}</p>
                <div class="actions">
                  <ButtonLink href={featured.href} event="product_click" eventLabel={featured.slug}>
                    Explore EduLynx ERP
                  </ButtonLink>
                  {featured.externalUrl ? (
                    <ButtonLink href={featured.externalUrl} variant="secondary" external event="external_product_click" eventLabel={featured.slug}>
                      Visit EduLynx ERP
                    </ButtonLink>
                  ) : null}
                </div>
              </article>
            ) : null}
          </Container>
        </Section>
        <Section tone="white" labelledBy="portfolio-title">
          <Container>
            <SectionHeader id="portfolio-title" title="The rest of the portfolio" lede="Other products from KrisLynx, each built on the same engineering foundation." align="split" />
            <div class="product-grid">
              {others.map((p) => (
                <ProductCard product={p} />
              ))}
            </div>
          </Container>
        </Section>
        <CtaBand title="Building a product of your own?" body="We bring the same engineering we use on our products to yours — from first release to long-term operation." primary={{ label: "Start a conversation", href: "/contact?need=new-product" }} secondary={{ label: "Product engineering", href: "/services/product-engineering" }} />
      </>
    );
  },
});
