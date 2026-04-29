# n8n-nodes-pingram

This is an n8n community node for [Pingram](https://pingram.io) - a notification infrastructure service that lets you send SMS and Email notifications.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Usage](#usage)  
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### SMS

- **Send**: Send an SMS message to a phone number

### Email

- **Send**: Send an email to an email address

## Credentials

To use this node, you need a Pingram API key:

1. Sign up at [Pingram](https://pingram.io)
2. Navigate to **Environments** in your dashboard
3. Copy your API key (starts with `pingram_sk_...`)
4. Select your region (US, Canada, or EU)

### Supported Regions

| Region       | API Endpoint                |
| ------------ | --------------------------- |
| US (Default) | `https://api.pingram.io`    |
| Canada       | `https://api.ca.pingram.io` |
| EU           | `https://api.eu.pingram.io` |

## Usage

### Send SMS

1. Add the **Pingram** node to your workflow
2. Select **SMS** as the resource
3. Select **Send** as the operation
4. Enter the required fields:
   - **Phone Number**: The recipient's phone number in E.164 format (e.g., `+15005550006`)
   - **Message**: The SMS content

Optional:

- **Type**: Notification type ID for categorizing the send (defaults to `n8n` when empty)

Example request body sent to Pingram API:

```json
{
  "type": "n8n",
  "to": {
    "number": "+15005550006"
  },
  "sms": {
    "message": "Hello from n8n!"
  }
}
```

### Send Email

1. Add the **Pingram** node to your workflow
2. Select **Email** as the resource
3. Select **Send** as the operation
4. Enter the required fields:
   - **Email Address**: The recipient's email address
   - **Subject**: Email subject line
   - **HTML Body**: HTML content of the email

Optional:

- **Type**: Notification type ID for categorizing the send (defaults to `n8n` when empty)

Optional fields (in Additional Fields):

- **Sender Name**: Display name of the sender
- **Sender Email**: Sender email address
- **Preview Text**: Preview text shown in inbox
- **Notification Type**: Same as **Type** when the main field is empty (ID for categorizing notifications)

Example request body sent to Pingram API:

```json
{
  "type": "n8n",
  "to": {
    "email": "user@example.com"
  },
  "email": {
    "subject": "Welcome!",
    "html": "<h1>Hello, World!</h1>",
    "senderName": "My App",
    "senderEmail": "noreply@example.com"
  }
}
```

## Resources

- [Pingram Documentation](https://pingram.io/docs)
- [Pingram API Reference](https://pingram.io/docs/reference/node)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE)
