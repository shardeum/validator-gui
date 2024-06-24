# Validator GUI

The GUI allows you to start operating a node with just a few mouse clicks. Shardeum is one of the first L1 networks to enable a user-friendly GUI feature for node validators.

## Getting Started with Local Development

Before running Shardus CLI, it's essential to set up the [Shardeum server](https://github.com/shardeum/shardeum), [JSON RPC server](https://github.com/shardeum/json-rpc-server) and configure [CLI](https://github.com/shardeum/validator-cli) with updated node details.

```bash
git clone git@github.com:shardeum/validator-gui.git
cd validator-gui
```

### Install Dependencies

```bash
npm install
```

### Set Environment Variables & Link to Operator CLI

1. Create a `.env` file in the root directory and configure necessary environment variables as required. If running the RPC locally, set the NEXT_PUBLIC_RPC_URL variable.

```bash
export NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8081
```

Adjust the port (8081 in this example) as needed.

2. Link to the Operator CLI and set the environment to development:

```bash
npm link operator-cli
export NODE_ENV=development
```

### Build and Start the Development Server

```bash
npm run build
npm run start
```

## Contributing

Contributions are very welcome! Everyone interacting in our codebases, issue trackers, and any other form of communication, including chat rooms and mailing lists, is expected to follow our [code of conduct](./CODE_OF_CONDUCT.md) so we can all enjoy the effort we put into this project.

## Community

For help, discussion about code, or any other conversation that would benefit from being searchable:

[Discuss Shardeum on GitHub](https://github.com/shardeum/shardeum/discussions)

For chatting with others using Shardeum:

[Join the Shardeum Discord Server](https://discord.com/invite/shardeum)
