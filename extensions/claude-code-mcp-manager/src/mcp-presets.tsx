import {
  Action,
  ActionPanel,
  Alert,
  Color,
  confirmAlert,
  Icon,
  List,
  showToast,
  Toast,
  useNavigation,
} from "@raycast/api";
import { useState } from "react";
import { getAllPresets, deletePreset, Preset } from "./lib/presets";
import {
  setEnabledPlugins,
  getPluginDisplayName,
  getEnabledPlugins,
} from "./lib/settings";
import CreatePresetForm from "./components/CreatePresetForm";
import EditPresetForm from "./components/EditPresetForm";

// 프리셋이 현재 상태와 일치하는지 확인
function isCurrentState(preset: Preset): boolean {
  const current = getEnabledPlugins();
  const presetKeys = Object.keys(preset.plugins);
  const currentKeys = Object.keys(current);

  // 키가 다르면 false
  if (presetKeys.length !== currentKeys.length) return false;

  // 모든 값이 일치하는지 확인
  return presetKeys.every((key) => preset.plugins[key] === current[key]);
}

function getPresetDetailMarkdown(preset: Preset, isCurrent: boolean): string {
  const enabledPlugins = Object.entries(preset.plugins)
    .filter(([, enabled]) => enabled)
    .map(([key]) => getPluginDisplayName(key));

  const disabledPlugins = Object.entries(preset.plugins)
    .filter(([, enabled]) => !enabled)
    .map(([key]) => getPluginDisplayName(key));

  let md = `# ${preset.name}`;
  if (isCurrent) {
    md += ` ✨`;
  }
  md += `\n\n`;
  md += `${preset.description}\n\n`;

  if (isCurrent) {
    md += `> **Currently Active**\n\n`;
  }

  md += `---\n\n`;

  if (enabledPlugins.length > 0) {
    md += `## ✓ ON (${enabledPlugins.length})\n\n`;
    enabledPlugins.forEach((p) => {
      md += `- \`${p}\`\n`;
    });
    md += "\n";
  }

  if (disabledPlugins.length > 0) {
    md += `## ✗ OFF (${disabledPlugins.length})\n\n`;
    disabledPlugins.forEach((p) => {
      md += `- ${p}\n`;
    });
  }

  return md;
}

export default function Command() {
  const [presets, setPresets] = useState<Preset[]>(getAllPresets());
  const { push } = useNavigation();

  const refresh = () => setPresets(getAllPresets());

  const handleApplyPreset = async (preset: Preset) => {
    setEnabledPlugins(preset.plugins);
    refresh(); // 상태 새로고침해서 Current 표시 업데이트
    const enabledCount = Object.values(preset.plugins).filter(Boolean).length;
    await showToast({
      style: Toast.Style.Success,
      title: `Applied: ${preset.name}`,
      message: `${enabledCount} plugins enabled`,
    });
  };

  const handleDeletePreset = async (preset: Preset) => {
    const confirmed = await confirmAlert({
      title: "Delete Preset",
      message: `Are you sure you want to delete "${preset.name}"?`,
      primaryAction: {
        title: "Delete",
        style: Alert.ActionStyle.Destructive,
      },
    });

    if (confirmed) {
      deletePreset(preset.id);
      refresh();
      await showToast({
        style: Toast.Style.Success,
        title: `Deleted: ${preset.name}`,
      });
    }
  };

  return (
    <List
      isShowingDetail={presets.length > 0}
      searchBarPlaceholder="Search presets..."
    >
      {presets.length === 0 ? (
        <List.EmptyView
          icon={Icon.Star}
          title="No Presets"
          description="Create your first preset to save MCP configurations"
          actions={
            <ActionPanel>
              <Action
                title="Create Preset"
                icon={Icon.Plus}
                onAction={() => push(<CreatePresetForm onCreated={refresh} />)}
              />
            </ActionPanel>
          }
        />
      ) : (
        <List.Section title="Presets" subtitle={`${presets.length} presets`}>
          {presets.map((preset) => {
            const isCurrent = isCurrentState(preset);
            const enabledCount = Object.values(preset.plugins).filter(
              Boolean,
            ).length;
            const totalCount = Object.keys(preset.plugins).length;

            return (
              <List.Item
                key={preset.id}
                icon={{
                  source: isCurrent ? Icon.CheckCircle : Icon.Star,
                  tintColor: isCurrent ? Color.Green : Color.Yellow,
                }}
                title={preset.name}
                accessories={[
                  ...(isCurrent
                    ? [{ tag: { value: "Current", color: Color.Green } }]
                    : []),
                  { tag: `${enabledCount}/${totalCount}` },
                ]}
                detail={
                  <List.Item.Detail
                    markdown={getPresetDetailMarkdown(preset, isCurrent)}
                  />
                }
                actions={
                  <ActionPanel>
                    <ActionPanel.Section>
                      <Action
                        title="Apply Preset"
                        icon={Icon.CheckCircle}
                        onAction={() => handleApplyPreset(preset)}
                      />
                    </ActionPanel.Section>
                    <ActionPanel.Section>
                      <Action
                        title="Edit Preset"
                        icon={Icon.Pencil}
                        shortcut={{ modifiers: ["cmd"], key: "e" }}
                        onAction={() =>
                          push(
                            <EditPresetForm
                              preset={preset}
                              onUpdated={refresh}
                            />,
                          )
                        }
                      />
                      <Action
                        title="Delete Preset"
                        icon={Icon.Trash}
                        style={Action.Style.Destructive}
                        shortcut={{ modifiers: ["cmd"], key: "backspace" }}
                        onAction={() => handleDeletePreset(preset)}
                      />
                    </ActionPanel.Section>
                    <ActionPanel.Section>
                      <Action
                        title="Create New Preset"
                        icon={Icon.Plus}
                        shortcut={{ modifiers: ["cmd"], key: "n" }}
                        onAction={() =>
                          push(<CreatePresetForm onCreated={refresh} />)
                        }
                      />
                    </ActionPanel.Section>
                  </ActionPanel>
                }
              />
            );
          })}
        </List.Section>
      )}
    </List>
  );
}
