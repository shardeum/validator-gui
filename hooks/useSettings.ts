import useSWR from 'swr'
import { fetcher } from './fetcher';
import { useGlobals } from '../utils/globals';

export type NodeSettings = {
  autoRestart: boolean
}

export type SettingsResult = {
  settings: NodeSettings | undefined,
  updateSettings: (settings: NodeSettings) => Promise<void>
}

export const useSettings = (): SettingsResult => {
  const {apiBase} = useGlobals()
  const {data, mutate} = useSWR<NodeSettings>(`${apiBase}/api/settings`, fetcher)

  async function updateSettings(settings: NodeSettings) {
    const newSettings = await fetcher(`${apiBase}/api/settings`, {method: 'POST', body: JSON.stringify(settings)})
    await mutate(newSettings)
  }

  return {
    settings: data,
    updateSettings
  }
};
