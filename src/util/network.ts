import * as Web3 from "web3";

const NetworkId = {
  MAIN: "1",
};

const isMainNetwork = async (web3: Web3): Promise<boolean> => {
  try {
    await new Promise((resolve: () => void, reject: (reason?: any) => void) => {
      web3.version.getNetwork((err, networkId) => {
        // main net
        if (networkId === NetworkId.MAIN) {
          return resolve();
        }
        return reject();
      });
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export { NetworkId, isMainNetwork };
