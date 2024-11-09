# ebay-cli

Interact with the eBay API from the command line. This tool provides a simple interface to access eBay's selling APIs, with a focus on transaction management.

## Installation

Install globally via npm:

```bash
npm install -g ebay-cli
```

Or use with Docker:

```bash
docker run -it --rm thegeektechworkshop/ebay-cli:latest
```

## Prerequisites

Before using this tool, you'll need:

1. An eBay developer account
2. API credentials from the eBay developer portal:
   - Client ID
   - Certificate ID
   - Redirect URL name (RuName)

## Authentication

First-time setup requires authentication with eBay:

```bash
ebay authorise <clientId> <certificateId> <redirectUrlName>
```

The authentication process will:

1. Generate an authorization URL
2. Open your browser for eBay login
3. Ask you to paste the redirect URL back into the terminal
4. Securely store your credentials locally

## Commands

### View Configuration

Display the location of your config file:

```bash
ebay config
# or
ebay c
```

### Transactions

View your eBay transaction history:

```bash
ebay transactions [options]
# or
ebay tx [options]
```

Available options:

- `-f, --date-from <string>` - Start date for transaction history (ISO format)
- `-t, --date-to <string>` - End date for transaction history (ISO format)
- `-y, --type <string>` - Filter by transaction type
- `-o, --offset <number>` - Pagination offset
- `-l, --limit <number>` - Number of results to return
- `-r, --raw` - Output raw JSON response
- `-i, --ids` - Include transaction IDs in output

## Docker Usage

When using the Docker image, you'll need to mount a volume to persist your authentication:

```bash
docker run -v ~/.config/configstore:/root/.config/configstore thegeektechworkshop/ebay-cli:latest
```

## Development

This project uses:

- Node.js
- Commander.js for CLI interface
- eBay API client for Node.js
- Docker for containerization

## License

MIT License - Copyright (c) 2024 Andy Todd

See [LICENSE](LICENSE) file for details.
