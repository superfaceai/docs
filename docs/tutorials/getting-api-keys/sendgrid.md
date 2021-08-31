# Sendgrid

### TL;DR

1. Create an account at [https://signup.sendgrid.com/](https://signup.sendgrid.com/).
2. Set up single sender (for testing) or verify your domain (for the real thing).
3. Create an API key in Settings → API Keys → Create API Key.
4. Follow instructions at [https://www.superface.ai/solutions/resilient-email](https://www.superface.ai/solutions/resilient-email).

## Starting with Sendgrid

1. Head to [https://signup.sendgrid.com/](https://signup.sendgrid.com/) and fill in the required information to create an account.
2. To be able to start sending emails, you will have to create a single sender (which allows you to send emails from one email address) or verify your domain to be able to send from any address on it. Here is a [great comparison](https://docs.sendgrid.com/for-developers/sending-email/sender-identity).

    ![sendgrid-sender.png](/img/tutorials/getting-api-keys/sendgrid-sender.png)

3. Creating a sender requires filling in some information about yourself and your business and accessing your mailbox to verify your address.

    ![sendgrid-create-sender.png](/img/tutorials/getting-api-keys/sendgrid-create-sender.png)

4. Verifying a domain requires editing DNS records of your domain to allow SendGrid to send emails on you behalf. The easiest way is to follow this [step by step tutorial](https://docs.sendgrid.com/ui/account-and-settings/how-to-set-up-domain-authentication) from Sendgrid.
5. The next step is to generate an API key. Go to Settings → API Keys → Create API Key

    ![sendgrid-api-key.png](/img/tutorials/getting-api-keys/sendgrid-api-key.png)

6. Copy and store your newly created key. You will be asked to provide to by the installation command.
7. Run `npx @superfaceai/cli install communication/send-email -i`
8. Follow instructions at [https://www.superface.ai/solutions/resilient-email](https://www.superface.ai/solutions/resilient-email).