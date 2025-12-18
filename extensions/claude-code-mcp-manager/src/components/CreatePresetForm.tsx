import {
  Action,
  ActionPanel,
  Form,
  showToast,
  Toast,
  useNavigation,
} from "@raycast/api";
import { useState } from "react";
import { createPreset } from "../lib/presets";
import {
  getEnabledPlugins,
  getAvailablePlugins,
  getPluginDisplayName,
} from "../lib/settings";

interface Props {
  onCreated: () => void;
}

export default function CreatePresetForm({ onCreated }: Props) {
  const { pop } = useNavigation();
  const [nameError, setNameError] = useState<string | undefined>();

  const availablePlugins = getAvailablePlugins();
  const currentPlugins = getEnabledPlugins();

  const handleSubmit = async (values: Record<string, boolean | string>) => {
    const name = values.name as string;
    const description = values.description as string;

    if (!name?.trim()) {
      setNameError("Name is required");
      return;
    }

    const plugins: Record<string, boolean> = {};
    availablePlugins.forEach((p) => {
      plugins[p] = values[p] as boolean;
    });

    createPreset({
      name: name.trim(),
      description: description?.trim() || "Custom preset",
      plugins,
    });

    await showToast({
      style: Toast.Style.Success,
      title: "Preset created",
      message: name,
    });

    onCreated();
    pop();
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Preset" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="name"
        title="Name"
        placeholder="My Custom Preset"
        error={nameError}
        onChange={() => setNameError(undefined)}
      />
      <Form.TextField
        id="description"
        title="Description"
        placeholder="Description of what this preset is for"
      />
      <Form.Separator />
      <Form.Description
        title="Plugins"
        text="Toggle which MCP plugins to enable (current state pre-selected)"
      />
      {availablePlugins.map((plugin) => (
        <Form.Checkbox
          key={plugin}
          id={plugin}
          label={getPluginDisplayName(plugin)}
          defaultValue={currentPlugins[plugin] ?? false}
        />
      ))}
    </Form>
  );
}
