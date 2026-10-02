import { company } from "../config/company";
import { officeShots } from "../config/office";
import { definePage } from "../lib/page";
import { postalAddress, webPageSchema } from "../lib/schema";
import { largest } from "../lib/images";
import { Container, CtaBand, PageHero, Section, SectionHeader } from "../components/ui";
import { MediaPlaceholder, Picture } from "../components/media";

const crumbs = [{ name: "Home", path: "/" }, { name: "Company", path: "/company" }, { name: "Office", path: "/office" }];
const description =
  "Photos of the KrisLynx Technologies office in Nandyal, Andhra Pradesh: reception, workspace, engineering desks and meeting room at Sreenivasa Nilayam.";

export default definePage({
  path: "/office",
  title: "Our Office in Nandyal, Andhra Pradesh",
  description,
  group: "company",
  breadcrumbs: crumbs,
  schema: [
    {
      ...webPageSchema({ name: "KrisLynx Technologies office", description, path: "/office" }),
      contentLocation: { "@type": "Place", name: "KrisLynx Technologies registered office", address: postalAddress },
    },
  ],
  sitemap: { priority: 0.5, changefreq: "monthly" },
  render: () => (
    <>
      <PageHero
        crumbs={crumbs}
        title="Where KrisLynx builds"
        lede={
          <p>
            Our registered office and engineering base is on the second floor of Sreenivasa Nilayam, Noone Palle, {company.address.locality}. It's where we build EduLynx ERP, run client calls and demonstrate products.
          </p>
        }
      />
      <Section tone="white" labelledBy="gallery-title">
        <Container>
          <h2 id="gallery-title" class="visually-hidden">
            Office photographs
          </h2>
          <ul class="gallery">
            {/* Unfilled slots (image: null) are listed in docs/IMAGE-REPLACEMENT.md, not shown publicly. */}
            {officeShots.filter((s) => s.image).map((s, i) => (
              <li class={`gallery__item gallery__item--${s.layout}`}>
                <figure>
                  {s.image ? (
                    <a href={largest(s.image, "jpg")} data-lightbox data-caption={s.caption} class="gallery__link">
                      <Picture name={s.image} alt={s.alt} priority={i === 0} sizes={s.layout === "wide" ? "(min-width: 64rem) 66vw, 100vw" : "(min-width: 64rem) 33vw, 100vw"} />
                      <span class="visually-hidden">Open larger photo</span>
                    </a>
                  ) : (
                    <MediaPlaceholder label={s.category} caption={s.caption} ratio="4-3" />
                  )}
                  <figcaption>
                    <span class="gallery__cat">{s.category}</span> {s.image ? s.caption : null}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <Section tone="paper" labelledBy="visit-title" tight>
        <Container>
          <div class="split">
            <SectionHeader id="visit-title" title="Visiting us" lede="Meetings at the office are by appointment. Email us to arrange a time." />
            <address class="visit">
              {company.legalNameReadable}
              <br />
              {company.address.building}
              <br />
              {company.address.street}
              <br />
              {company.address.locality}, {company.address.district} – {company.address.postalCode}
              <br />
              {company.address.region}, {company.address.country}
              <br />
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </address>
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  ),
});
