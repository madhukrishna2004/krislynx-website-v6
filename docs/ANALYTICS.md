# Analytics

## Default: none
With `KX_GA_ID` unset (the default), the site ships no analytics code paths that run, sets no cookies
and shows no banner.

## Enabling GA4
Set `KX_GA_ID=G-XXXXXXXXXX` at build time. Then:
- a cookie banner appears until the visitor chooses; the choice is stored in `localStorage` (`kx-consent`);
- Google Analytics loads **only after "Accept"**, with Consent Mode (ads storage denied) and IP anonymisation;
- the footer shows "Cookie settings" to change the choice.

## Events
| Event | Fired when | Parameters |
|---|---|---|
| `contact_submit` | contact form accepted by the server | `need` (category only) |
| `demo_request` | EduLynx demo CTA clicked, or a form submitted with need = EduLynx demo | `label` |
| `product_view` | a product-group page loads | `label` = path |
| `product_click` | a product card link is clicked | `label` = product slug |
| `external_product_click` | link to the EduLynx site clicked | `label` |
| `chatbot_open` | assistant opened | — |
| `chatbot_question` | assistant answered | `topic` = matched entry id or `unmatched` |
| `chatbot_lead` | "Contact the team" clicked in the assistant | — |
| `career_apply` | apply / open-application link clicked | `label` |
| `cta_click` | header or hero CTA clicked | `label` |

All events include `page_group`. **No form contents, names, emails or assistant questions are ever sent.**
Add an event anywhere with `data-event="name" data-event-label="…"` on a link or button.

Recommended GA4 setup: mark `contact_submit` and `demo_request` as key events; add `page_group` as a
custom dimension.
