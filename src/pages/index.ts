import type { PageDef } from "../lib/page";
import home from "./home";
import company from "./company";
import technology from "./technology";
import leadership from "./leadership";
import office from "./office";
import products from "./products";
import edulynx from "./edulynx";
import industries from "./industries";
import { servicesIndex, servicePages } from "./services";
import { workIndex, casePages } from "./work";
import { accessibility, articlePages, careers, contact, contactThanks, cookies, insights, notFound, pricing, privacy, refund, terms } from "./misc";

/** Every route on the public site. Order = sitemap order. */
export const pages: PageDef[] = [
  home,
  company,
  leadership,
  office,
  products,
  edulynx,
  servicesIndex,
  technology,
  ...servicePages,
  industries,
  workIndex,
  ...casePages,
  insights,
  ...articlePages,
  careers,
  contact,
  contactThanks,
  pricing,
  privacy,
  terms,
  refund,
  cookies,
  accessibility,
  notFound,
];
