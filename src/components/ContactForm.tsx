import type { SafeHtml } from "@kx/jsx-runtime";
import { contactConfig } from "../config/contact";
import { countries, priorityCountries } from "../config/countries";
import { company } from "../config/company";

function Field(props: { id: string; label: string; required?: boolean; hint?: string; children?: SafeHtml | SafeHtml[]; class?: string }): SafeHtml {
  return (
    <div class={`field ${props.class ?? ""}`} data-field={props.id}>
      <label for={props.id} class="field__label">
        {props.label}
        {props.required ? <span class="field__req"> (required)</span> : <span class="field__opt"> (optional)</span>}
      </label>
      {props.hint ? (
        <p class="field__hint" id={`${props.id}-hint`}>
          {props.hint}
        </p>
      ) : null}
      {props.children}
      <p class="field__error" id={`${props.id}-error`} data-error-for={props.id} hidden></p>
    </div>
  );
}

const describedBy = (id: string, hint?: boolean): string => `${hint ? `${id}-hint ` : ""}${id}-error`;

/**
 * B2B enquiry form. Works without JavaScript (standard POST to the function,
 * which redirects to /contact/thanks). With JS it validates inline, submits
 * with fetch and shows loading, success and error states in place.
 */
export function ContactForm(): SafeHtml {
  const priority = priorityCountries.map((c) => countries.find((x) => x.code === c)).filter((c) => c !== undefined);
  return (
    <form class="contact-form" action={contactConfig.endpoint} method="post" novalidate data-contact-form>
      <fieldset class="contact-form__stage">
        <legend>
          <span class="mono">01</span> The project
        </legend>
        <div class="contact-form__grid">
        <fieldset class="field field--full chips-field" id="cf-need" data-field="cf-need" tabindex="-1" aria-describedby="cf-need-error">
          <legend class="field__label">
            What are you building?<span class="field__req"> (required)</span>
          </legend>
          <div class="choice-chips">
            {contactConfig.needs.map((n, i) => (
              <label class="choice">
                <input type="radio" name="need" value={n.value} required={i === 0} />
                <span>{n.label}</span>
              </label>
            ))}
          </div>
          <p class="field__error" id="cf-need-error" data-error-for="cf-need" hidden></p>
        </fieldset>
        <fieldset class="field field--full chips-field" id="cf-stage" data-field="cf-stage" tabindex="-1" aria-describedby="cf-stage-error">
          <legend class="field__label">
            What stage are you at?<span class="field__opt"> (optional)</span>
          </legend>
          <div class="choice-chips">
            {contactConfig.stages.map((n) => (
              <label class="choice">
                <input type="radio" name="stage" value={n.value} />
                <span>{n.label}</span>
              </label>
            ))}
          </div>
          <p class="field__error" id="cf-stage-error" data-error-for="cf-stage" hidden></p>
        </fieldset>
        <Field id="cf-details" label="What problem are you solving?" required hint="Who is it for, what happens today, and what has to change?" class="field--full">
          <textarea
            id="cf-details"
            name="details"
            rows={6}
            required
            minlength={contactConfig.minDetails}
            maxlength={contactConfig.maxDetails}
            aria-describedby={describedBy("cf-details", true)}
          ></textarea>
        </Field>
        <Field id="cf-timeline" label="Timeline">
          <select id="cf-timeline" name="timeline" aria-describedby={describedBy("cf-timeline")}>
            <option value="">Choose one</option>
            {contactConfig.timelines.map((n) => (
              <option value={n.value}>{n.label}</option>
            ))}
          </select>
        </Field>
        <Field id="cf-budget" label="Budget range">
          <select id="cf-budget" name="budget" aria-describedby={describedBy("cf-budget")}>
            <option value="">Choose one</option>
            {contactConfig.budgets.map((n) => (
              <option value={n.value}>{n.label}</option>
            ))}
          </select>
        </Field>
        <Field id="cf-file" label="Attachment" hint="A brief, spec or screenshot. PDF, DOCX, PPTX, PNG or JPG, up to 4 MB." class="field--full js-only">
          <input id="cf-file" name="attachment" type="file" accept={contactConfig.attachmentAccept} aria-describedby={describedBy("cf-file", true)} />
        </Field>
        </div>
      </fieldset>
      <fieldset class="contact-form__stage">
        <legend>
          <span class="mono">02</span> How can we reach you?
        </legend>
        <div class="contact-form__grid">
        <Field id="cf-name" label="Your name" required>
          <input id="cf-name" name="name" type="text" autocomplete="name" required maxlength={120} aria-describedby={describedBy("cf-name")} />
        </Field>
        <Field id="cf-email" label="Business email" required>
          <input id="cf-email" name="email" type="email" autocomplete="email" required maxlength={200} inputmode="email" aria-describedby={describedBy("cf-email")} />
        </Field>
        <Field id="cf-company" label="Company or organization" required>
          <input id="cf-company" name="company" type="text" autocomplete="organization" required maxlength={160} aria-describedby={describedBy("cf-company")} />
        </Field>
        <Field id="cf-country" label="Country" required>
          <select id="cf-country" name="country" autocomplete="country" required aria-describedby={describedBy("cf-country")}>
            <option value="">Select a country</option>
            <optgroup label="Common">
              {priority.map((c) => (
                <option value={c.code} data-dial={c.dial}>
                  {c.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="All countries">
              {countries.map((c) => (
                <option value={c.code} data-dial={c.dial}>
                  {c.name}
                </option>
              ))}
            </optgroup>
          </select>
        </Field>
        <Field id="cf-phone" label="Phone" hint="Include your country code, e.g. +44 20 7946 0000." class="field--wide-sm">
          <div class="phone">
            <span class="phone__dial" data-dial-display aria-hidden="true">
              +
            </span>
            <input id="cf-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" maxlength={24} aria-describedby={describedBy("cf-phone", true)} />
          </div>
        </Field>
        </div>
      </fieldset>
      <div class="contact-form__grid">
        {/* Spam traps: hidden from people and assistive tech, filled by bots. */}
        <div class="hp" aria-hidden="true">
          <label for="cf-website">Website</label>
          <input id="cf-website" name="website" type="text" tabindex="-1" autocomplete="off" />
        </div>
        <input type="hidden" name="started" value="" data-started />
        <input type="hidden" name="tz" value="" data-tz />
        <input type="hidden" name="source" value="" data-source />
        <div class="field field--full field--check" data-field="cf-consent">
          <input id="cf-consent" name="consent" type="checkbox" value="yes" required aria-describedby="cf-consent-error" />
          <label for="cf-consent">
            I agree that KrisLynx may use these details to respond to my enquiry, as described in the <a href="/privacy-policy">privacy policy</a>.
          </label>
          <p class="field__error" id="cf-consent-error" data-error-for="cf-consent" hidden></p>
        </div>
      </div>
      <div class="contact-form__submit">
        <button type="submit" class="btn btn--primary btn--lg" data-submit>
          <span class="btn__label">Start the conversation</span>
          <span class="spinner" aria-hidden="true"></span>
        </button>
        <p class="contact-form__note">{company.responseTime}</p>
      </div>
      <div class="form-status" data-form-status role="status" aria-live="polite" tabindex="-1" hidden></div>
    </form>
  );
}
