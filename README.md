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

### Set environment variables & link to Operator CLI

Create a `.env` file in the root directory and configure necessary environment variables as required

```bash
npm link operator-cli
export NODE_ENV=development
```

### Start the Development Server

```bash
npm run dev
```

## Contributing

Contributions are very welcome! Everyone interacting in our codebases, issue trackers, and any other form of communication, including chat rooms and mailing lists, is expected to follow our [code of conduct](./CODE_OF_CONDUCT.md) so we can all enjoy the effort we put into this project.

## Community

For help, discussion about code, or any other conversation that would benefit from being searchable:

[Discuss Shardeum on GitHub](https://github.com/shardeum/shardeum/discussions)

For chatting with others using Shardeum:

[Join the Shardeum Discord Server](https://discord.com/invite/shardeum)
