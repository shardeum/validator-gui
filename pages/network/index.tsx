import { useRouter } from "next/router";
import { useNodeNetwork } from "../../hooks/useNodeNetwork";
import { nullPlaceholder } from "../../utils/null-placerholder";
import { useEffect } from "react";

export default function Network() {
  const router = useRouter();
  useEffect(() => {
    router.push("/dashboard");
  }, [router]);
  const { network } = useNodeNetwork();

  return (
    <>
      {!!network && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">Network Size</h1>
              <div className="bg-white text-stone-500 rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                <div>Active validators: {nullPlaceholder(network.active)}</div>
                <div>
                  Standby validators: {nullPlaceholder(network.standby)}
                </div>
                <div>
                  Desired network size: {nullPlaceholder(network.desired)}
                </div>
                <div>
                   Syncing: {nullPlaceholder(network.syncing)}</div>
              </div>
            </div>
            <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">Network Load - Coming Soon</h1>
              <div className="bg-white text-stone-500	rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                <div>Max TPS: {nullPlaceholder(null)}</div>
                <div>Avg TPS: {nullPlaceholder(null)}</div>
                <div>Total TXs processed: {nullPlaceholder(null)}</div>
                <div>Network load: {nullPlaceholder(null)}</div>
              </div>
            </div>
            <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">
                Network Health - Coming Soon
              </h1>
              <div className="bg-white text-stone-500	rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                <div>Current A:S Ratio: {network.standby > 0 ? network.active/network.standby * 100 : 0}%</div>
                <div>Target A:S Ratio: {nullPlaceholder(null)}</div>
                <div>Network health: {nullPlaceholder(null)}%</div>
              </div>
            </div>
            <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">
                Network Reward - Coming Soon
              </h1>
              <div className="bg-white text-stone-500	rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                <div>Current daily issuance: {nullPlaceholder(null)}</div>
                <div>Average daily issuance: {nullPlaceholder(null)}</div>
                <div>Average daily node reward: {nullPlaceholder(null)}</div>
              </div>
            </div>
            <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">Average APR - Coming Soon</h1>
              <div className="bg-white text-stone-500	rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                <div>Your APR: {nullPlaceholder(null)}%</div>
                <div>Network average APR: {nullPlaceholder(null)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
