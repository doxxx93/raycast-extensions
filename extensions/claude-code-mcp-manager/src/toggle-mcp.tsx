import {
  Action,
  ActionPanel,
  Color,
  Icon,
  List,
  showToast,
  Toast,
} from "@raycast/api";
import { useEffect, useState } from "react";
import {
  getEnabledPlugins,
  togglePlugin,
  getAvailablePlugins,
  getPluginDisplayName,
} from "./lib/settings";

interface McpPlugin {
  name: string;
  fullKey: string;
  enabled: boolean;
}

function getMcpPlugins(): McpPlugin[] {
  const enabledPlugins = getEnabledPlugins();
  const availablePlugins = getAvailablePlugins();

  return availablePlugins.map((fullKey) => ({
    name: getPluginDisplayName(fullKey),
    fullKey,
    enabled: enabledPlugins[fullKey] ?? false,
  }));
}

export default function Command() {
  const [plugins, setPlugins] = useState<McpPlugin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPlugins = () => {
    setPlugins(getMcpPlugins());
    setIsLoading(false);
  };

  useEffect(() => {
    loadPlugins();
  }, []);

  const handleToggle = async (plugin: McpPlugin) => {
    const newState = togglePlugin(plugin.fullKey);
    loadPlugins();
    await showToast({
      style: Toast.Style.Success,
      title: `${plugin.name}: ${newState ? "ON" : "OFF"}`,
    });
  };

  const enabledCount = plugins.filter((p) => p.enabled).length;

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search MCP plugins...">
      <List.Section
        title="MCP Plugins"
        subtitle={`${enabledCount}/${plugins.length} enabled`}
      >
        {plugins.map((plugin) => (
          <List.Item
            key={plugin.fullKey}
            icon={{
              source: plugin.enabled ? Icon.CheckCircle : Icon.Circle,
              tintColor: plugin.enabled ? Color.Green : Color.SecondaryText,
            }}
            title={plugin.name}
            accessories={[
              {
                tag: {
                  value: plugin.enabled ? "ON" : "OFF",
                  color: plugin.enabled ? Color.Green : Color.SecondaryText,
                },
              },
            ]}
            actions={
              <ActionPanel>
                <Action
                  title={plugin.enabled ? "Disable" : "Enable"}
                  icon={plugin.enabled ? Icon.XMarkCircle : Icon.CheckCircle}
                  onAction={() => handleToggle(plugin)}
                />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}
