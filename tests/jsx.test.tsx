/** @jsxRuntime automatic */
/** @jsxImportSource @kx */
import { test } from "node:test";
import assert from "node:assert/strict";
import { escapeHtml, raw, render } from "../src/jsx/jsx-runtime";

test("text children are escaped", () => {
  assert.equal(render(<p>{"<script>alert(1)</script>"}</p>), "<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>");
});

test("attribute values are escaped", () => {
  assert.equal(render(<a href={'x" onmouseover="alert(1)'}>t</a>), '<a href="x&quot; onmouseover=&quot;alert(1)">t</a>');
});

test("raw() passes trusted HTML through unchanged", () => {
  assert.equal(render(<div>{raw("<b>ok</b>")}</div>), "<div><b>ok</b></div>");
});

test("boolean and nullish attributes", () => {
  assert.equal(render(<input required disabled={false} name={undefined} />), "<input required>");
});

test("inline style attributes are rejected (CSP forbids them)", () => {
  assert.throws(() => render(<div {...({ style: "color:red" } as Record<string, string>)} />));
});

test("escapeHtml covers the five significant characters", () => {
  assert.equal(escapeHtml(`&<>"'`), "&amp;&lt;&gt;&quot;&#39;");
});

test("Picture emits phone art-direction sources only when a mobile crop is given", async () => {
  const { Picture } = await import("../src/components/media");
  const withCrop = render(Picture({ name: "office-meeting-room", mobile: "office-meeting-room", alt: "x", sizes: "100vw" }));
  const without = render(Picture({ name: "office-meeting-room", alt: "x", sizes: "100vw" }));
  assert.match(withCrop, /<source media="\(max-width: 47\.99rem\)" type="image\/avif"/);
  assert.doesNotMatch(without, /media=/);
});
