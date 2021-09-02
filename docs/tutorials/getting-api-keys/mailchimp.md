# Mailchimp

### TL;DR

[Mailchimp](https://mailchimp.com) lets users send email via its API through an add-on service called [Mandrill](http://mandrillapp.com/). To be able to use it, you will need to:

1. [Create a Mailchimp account](https://login.mailchimp.com/signup/)
2. Activate [Mandrill](https://mandrillapp.com/login/) ([a demo with 500 emails is available](https://mailchimp.com/help/transactional-email-demo/))
3. [Verify ownership](https://mailchimp.com/developer/transactional/docs/authentication-delivery/#authentication) of your sending domain and [updating your DNS records](https://mandrill.zendesk.com/hc/en-us/articles/360038803434-How-to-Add-DNS-Records-for-Sending-Domains).
4. Get an API key in Mandrill settings
5. Follow instructions at [https://www.superface.ai/solutions/resilient-email](https://www.superface.ai/solutions/resilient-email).

## Mailchimp account

1. Sign up at [https://login.mailchimp.com/signup/](https://login.mailchimp.com/signup/)
2. Follow the instructions to set up your account - you will be asked about your physical business address among other things to comply with the anti spam laws.

## Mandrill activation

1. Once you're in, head to Automations → Transactional Email

    ![mandrill-transaction-email.png](/img/tutorials/getting-api-keys/mandrill-transaction-email.png)

2.  Select "Try Our Demo" to jump to Mandrill

    ![mandrill-try-demo.png](/img/tutorials/getting-api-keys/mandrill-try-demo.png)

## Domain verification

1. Next add and verify a sending domain. You will need to add TXT records for [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail) and [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework) to your DNS. The easiest way is to follow the [domain verification guide](https://mailchimp.com/developer/transactional/docs/authentication-delivery/#add-a-sending-domain). 

    ![mandrill-domain.png](/img/tutorials/getting-api-keys/mandrill-domain.png)

    ![mandrill-domain-settings.png](/img/tutorials/getting-api-keys/mandrill-domain-settings.png)

## Adding new API Key

1. Go to Settings and select Add API Key

    ![mandrill-key.png](/img/tutorials/getting-api-keys/mandrill-key.png)

## Using Mailchimp with Superface

Follow instructions at [https://www.superface.ai/solutions/resilient-email](https://www.superface.ai/solutions/resilient-email).