/* Ashford Capital — site configuration.
   Fill these in before launch. Nothing here is a secret: it is public, client-side config. */
window.ASHFORD_CONFIG = {
  // POST endpoint that receives assessment + contact submissions as JSON
  // (e.g. a Formspree / Basin / Getform URL, or your own API). Leave empty while testing:
  // the site then shows a visible "not connected" notice instead of pretending to send.
  formEndpoint: "",

  // Public contact email. Leave empty to hide the email line on the Contact page.
  contactEmail: "",

  // Public profile URLs for the Social section on the Home page. Leave a value empty to keep the
  // default link in the page. Set the LinkedIn company page here once its URL is final.
  social: {
    instagram: "https://www.instagram.com/ashfordcapital_/",
    substack: "https://substack.com/@ashfordcapital",
    linkedin: ""
  }
};
