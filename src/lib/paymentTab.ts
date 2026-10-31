// Atmos payment opens in a new tab. Browsers only allow window.open during the
// click itself, but the payment URL arrives after an API call — so open an empty
// tab right away (openPaymentTab, call it synchronously in the click handler)
// and point it at the URL once it is known (sendPaymentTab).

export function openPaymentTab(): Window | null {
  const tab = window.open("", "_blank");
  if (!tab) return null; // blocked — callers fall back to the current tab
  tab.opener = null; // payment page must not control this tab
  tab.document.title = "Atmos";
  tab.document.body.innerHTML =
    '<p style="font-family:sans-serif;padding:24px;color:#697586">Loading payment…</p>';
  return tab;
}

/** Sends the pre-opened tab to the payment URL; returns false if there is no usable tab. */
export function sendPaymentTab(tab: Window | null, url: string): boolean {
  if (!tab || tab.closed) return false;
  tab.location.href = url;
  return true;
}

export function closePaymentTab(tab: Window | null) {
  if (tab && !tab.closed) tab.close();
}
