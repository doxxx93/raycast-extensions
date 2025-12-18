import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { getEnabledPlugins } from "./settings";

export interface Preset {
  id: string;
  name: string;
  description: string;
  plugins: Record<string, boolean>;
}

const PRESETS_PATH = path.join(os.homedir(), ".claude", "mcp-presets.json");

export function loadPresets(): Preset[] {
  try {
    if (fs.existsSync(PRESETS_PATH)) {
      const content = fs.readFileSync(PRESETS_PATH, "utf-8");
      return JSON.parse(content);
    }
  } catch {
    // ignore
  }
  return [];
}

export function savePresets(presets: Preset[]): void {
  try {
    const dir = path.dirname(PRESETS_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(PRESETS_PATH, JSON.stringify(presets, null, 2));
  } catch {
    // Silently fail if unable to write presets
  }
}

export function getAllPresets(): Preset[] {
  return loadPresets();
}

export function createPreset(preset: Omit<Preset, "id">): Preset {
  const presets = loadPresets();
  const newPreset: Preset = {
    ...preset,
    id: `preset-${Date.now()}`,
  };
  presets.push(newPreset);
  savePresets(presets);
  return newPreset;
}

// Create preset from current settings
export function createPresetFromCurrent(
  name: string,
  description: string,
): Preset {
  const plugins = getEnabledPlugins();
  return createPreset({ name, description, plugins });
}

export function updatePreset(
  id: string,
  updates: Partial<Preset>,
): Preset | null {
  const presets = loadPresets();
  const index = presets.findIndex((p) => p.id === id);
  if (index === -1) return null;

  presets[index] = { ...presets[index], ...updates };
  savePresets(presets);
  return presets[index];
}

export function deletePreset(id: string): boolean {
  const presets = loadPresets();
  const filtered = presets.filter((p) => p.id !== id);
  if (filtered.length === presets.length) return false;

  savePresets(filtered);
  return true;
}
