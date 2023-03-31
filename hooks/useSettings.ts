import useSWR from 'swr'
import { fetcher } from './fetcher';
import { useGlobals } from '../utils/globals';

export type NodeSettings = {
  autoRestart: boolean
}

export type SettingsResult = {
  settings: NodeSettings | undefined,
  updateSettings: Function
}

export const useSettings = (): SettingsResult => {
  const {apiBase} = useGlobals()
  const {data, mutate} = useSWR<NodeSettings>(`${apiBase}/api/settings`, fetcher)

  async function updateSettings(settings: NodeSettings): Promise<void> {
    const newSettings = await fetcher<NodeSettings>(`${apiBase}/api/settings`, {method: 'POST', body: JSON.stringify(settings)})
    await mutate(newSettings)
  }

  return {
    settings: data,
    updateSettings
  }
};
