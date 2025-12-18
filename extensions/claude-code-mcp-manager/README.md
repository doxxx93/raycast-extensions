# Claude Code MCP Manager

A Raycast extension to manage Claude Code MCP (Model Context Protocol) plugins.

## Features

- **Toggle MCP**: Enable/disable individual MCP plugins
- **MCP Presets**: Create, edit, delete, and apply custom presets

## Commands

| Command | Description | Shortcut |
|---------|-------------|----------|
| Toggle MCP | Toggle individual MCP plugins on/off | - |
| MCP Presets | Manage and apply MCP presets | - |

### Preset Actions

| Action | Shortcut |
|--------|----------|
| Apply Preset | `Enter` |
| Create Preset | `⌘ + N` |
| Edit Preset | `⌘ + E` |
| Delete Preset | `⌘ + ⌫` |

## Built-in Presets

- **Minimal**: Only commit-commands & feature-dev
- **Coding**: commit-commands, feature-dev, serena
- **All On**: Enable all MCP plugins
- **All Off**: Disable all MCP plugins

## Supported MCP Plugins

- `atlassian` - Jira & Confluence integration
- `commit-commands` - Git commit utilities
- `context7` - Context management
- `feature-dev` - Feature development workflows
- `greptile` - PR reviews & code analysis
- `playwright` - Browser automation
- `serena` - Code symbol analysis & editing

## File Locations

- Claude settings: `~/.claude/settings.json`
- Custom presets: `~/.claude/mcp-presets.json`

## Installation

### From Source

```bash
git clone https://github.com/doxxx93/claude-code-mcp-manager.git
cd claude-code-mcp-manager
npm install
npm run dev
```

## Why?

MCP plugins consume context tokens on every conversation. Managing which plugins are active helps:

- Reduce token usage
- Improve response latency
- Focus on relevant tools for the task

## License

MIT
