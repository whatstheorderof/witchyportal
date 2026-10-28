# Email with Brevo

The site uses Brevo (account: feralgoddessrising@gmail.com) for:

| When | What happens |
| --- | --- |
| Newsletter sign-up (footer and elsewhere) | Contact added to the **Newsletter** list |
| "Tell me when the compatibility report launches" | Added to the **Reports** list (or Newsletter if that list isn't set) |
| Retreat waitlist | Added to the **Waitlist** list; the visitor gets a confirmation email; Yulia gets an alert at the retreat email (feralgoddessrising@gmail.com) |
| Contact form | Yulia gets the enquiry by email (retreat enquiries → retreat email; others → the public email). Reply goes straight to the visitor |

Everything is still saved in the database first (Admin → Inbox), so nothing is lost if Brevo is down or not set up. Newsletters themselves are written and sent from Brevo (Campaigns), which also handles unsubscribes.

## Setting it up (once)

1. **Brevo → Contacts → Lists**: create three lists — `Newsletter`, `Retreat waitlist`, `Report launch`. Note each list's ID (the number shown next to it).
2. **Brevo → SMTP & API → API keys**: create a key named `witchyportal`.
3. **Sender.** Best: authenticate the domain so emails come from `hello@witchyportal.org` and land in inboxes, not spam:
   - Brevo → Senders, Domains & Dedicated IPs → **Domains → Add a domain** → `witchyportal.org`.
   - Brevo shows a few DNS records (a Brevo code TXT, DKIM, and DMARC). Add each one in **Vercel → Domains → witchyportal.org → DNS Records**, then click *Authenticate* in Brevo.
   - Brevo → Senders → add `hello@witchyportal.org` (name "Witchy Portal").
   Gmail addresses (feralgoddessrising@gmail.com) can't be authenticated by Brevo, so mail "from" a gmail address is more likely to go to spam or be rewritten. Replies still reach Yulia: every email sets reply-to to her address.
4. **Vercel → Settings → Environment Variables** (Production), then redeploy:

| Variable | Value |
| --- | --- |
| `BREVO_API_KEY` | the key from step 2 |
| `BREVO_SENDER_EMAIL` | `hello@witchyportal.org` (or a sender verified in Brevo) |
| `BREVO_LIST_NEWSLETTER` | list ID, e.g. `3` |
| `BREVO_LIST_WAITLIST` | list ID |
| `BREVO_LIST_REPORTS` | list ID (optional) |

Without `BREVO_API_KEY` the site works as before and sends nothing. Errors from Brevo are written to the Vercel logs and never stop a form.

People who signed up before Brevo was connected are in Admin → Inbox → Subscribers / Waitlist → *Export CSV*; import that file in Brevo → Contacts → Import.
