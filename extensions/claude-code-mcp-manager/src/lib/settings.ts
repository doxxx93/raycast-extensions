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
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
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

// 동적으로 settings.json에서 플러그인 목록 가져오기
export function getAvailablePlugins(): string[] {
  const plugins = getEnabledPlugins();
  return Object.keys(plugins);
}

export function getPluginDisplayName(fullKey: string): string {
  return fullKey.replace("@claude-plugins-official", "");
}
