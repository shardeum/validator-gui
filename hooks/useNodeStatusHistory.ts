import useSWR from 'swr';
import { NodeStatusHistory } from '../model/node-status-history';
import { useGlobals } from '../utils/globals';

type NodeStatusHistoryResult = {
  nodeStatusHistory: NodeStatusHistory | undefined
  isLoading: boolean
  isError: boolean
}

type keyValuePair = {
  [key: string]: any
}

async function sendRequest(url: string, { arg }: { arg: keyValuePair }) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg)
  })
}

const fetcher = async (
  url: string
) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  return fetch(url, options).then(r => r.json());
};

export const useNodeStatusHistory = (address: string, from?: Date) => {

  const { apiBase } = useGlobals();

  const { data, isValidating, mutate } = useSWR(
    [
      `${apiBase}/api/node/status/history?address=${address}`
    ],
    fetcher
  );

  return {
    nodeStatusHistory: data,
  }
}


