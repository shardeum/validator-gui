export const fetcher = (...args: any) => {
  // @ts-ignore
  return fetch(...args).then(res => {
    return res.json()
  }).catch((e) => {
    console.error('ERROR: HTTP request failed', e);
  });
}
