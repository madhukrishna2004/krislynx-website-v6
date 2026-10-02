import type { SafeHtml } from "@kx/jsx-runtime";
import { Picture } from "./media";
import type { Product } from "../config/products";
import type { CaseStudy } from "../config/work";
import type { Service } from "../config/services";
import { ChevronIcon, StatusBadge, Tags, TextLink } from "./ui";

export function ProductCard(props: { product: Product; headingLevel?: 2 | 3 }): SafeHtml {
  const p = props.product;
  const H = props.headingLevel === 2 ? "h2" : "h3";
  return (
    <article class={`product-card product-card--${p.status}`}>
      {p.mark ? (
        <div class="product-card__mark">
          <Picture name={p.mark.image} alt={p.mark.alt} sizes="120px" />
        </div>
      ) : null}
      <div class="product-card__head">
        <p class="product-card__category">{p.category}</p>
        <StatusBadge status={p.status} />
      </div>
      <H class="product-card__name">
        {p.status === "concept" ? (
          p.name
        ) : (
          <a href={p.href} data-event="product_click" data-event-label={p.slug}>
            {p.name}
          </a>
        )}
      </H>
      <p class="product-card__summary">{p.summary}</p>
      <p class="product-card__audience">
        <span class="visually-hidden">For: </span>
        {p.audience}
      </p>
      {p.externalUrl ? (
        <TextLink href={p.externalUrl} external event="external_product_click" class="product-card__ext">
          {p.externalLabel ?? "Visit"}
        </TextLink>
      ) : null}
    </article>
  );
}

export function CaseStudyCard(props: { study: CaseStudy }): SafeHtml {
  const s = props.study;
  return (
    <article class="case-card">
      <div class="case-card__head">
        <p class="case-card__kind">{s.kind}</p>
        <StatusBadge status={s.status} />
      </div>
      <h3 class="case-card__name">
        <a href={`/work/${s.slug}`}>{s.name}</a>
      </h3>
      <dl class="case-card__facts">
        <div>
          <dt>Problem</dt>
          <dd>{s.challenge.split(". ")[0]}.</dd>
        </div>
        <div>
          <dt>What we built</dt>
          <dd>{s.summary}</dd>
        </div>
        <div>
          <dt>Technology</dt>
          <dd>
            <Tags items={s.technology.slice(0, 4)} />
          </dd>
        </div>
      </dl>
      <span class="case-card__more" aria-hidden="true">
        Read case study <ChevronIcon />
      </span>
    </article>
  );
}

export function ServiceCard(props: { service: Service; index?: number }): SafeHtml {
  const s = props.service;
  return (
    <article class="service-card">
      <h3 class="service-card__name">
        <a href={`/services/${s.slug}`}>{s.name}</a>
      </h3>
      <p class="service-card__short">{s.short}</p>
      <ul class="service-card__caps">
        {s.capabilities.slice(0, 4).map((c) => (
          <li>{c.title}</li>
        ))}
      </ul>
      <span class="service-card__more" aria-hidden="true">
        Explore <ChevronIcon />
      </span>
    </article>
  );
}
