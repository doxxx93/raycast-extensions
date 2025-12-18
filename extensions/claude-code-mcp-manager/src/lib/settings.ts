import * as fs from "fs";
import * as os from "os";
import * as path from "path";

const SETTINGS_PATH = path.join(os.homedir(), ".claude", "settings.json");

export function loadSettings(): Record<string, unknown> {
  try {
    const content = fs.readFileSync(SETTINGS_PATH, "utf-8");
    return JSON.parse(content);
  } catch {
    return {};
  }
}

export function saveSettings(settings: Record<string, unknown>): void {
  try {
    const dir = path.dirname(SETTINGS_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
  } catch {
    // Silently fail if unable to write settings
  }
}

export function getEnabledPlugins(): Record<string, boolean> {
  const settings = loadSettings();
  return (settings.enabledPlugins as Record<string, boolean>) || {};
}

export function setEnabledPlugins(plugins: Record<string, boolean>): void {
  const settings = loadSettings();
  settings.enabledPlugins = plugins;
  saveSettings(settings);
}

export function togglePlugin(fullKey: string): boolean {
  const plugins = getEnabledPlugins();
  const newState = !plugins[fullKey];
  plugins[fullKey] = newState;
  setEnabledPlugins(plugins);
  return newState;
}

// Get available plugins dynamically from settings.json
export function getAvailablePlugins(): string[] {
  const plugins = getEnabledPlugins();
  return Object.keys(plugins);
}

export function getPluginDisplayName(fullKey: string): string {
  return fullKey.replace("@claude-plugins-official", "");
}
