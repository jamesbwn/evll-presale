export const EPOCH_INTERVAL = 9600;

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 3;

interface IAddresses {
  [key: number]: { [key: string]: string };
}
export const addresses: IAddresses = {
  56: {
    BUSD_ADDRESS: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    TOKEN_ADDRESS: "0x794a69b423726d470Ac1218f7db7CC94F97b7002",
    PRESALE_ADDRESS: "0x64Fb46650d3e242E2D37A150e514B1F26856EFd5",  // production
    BPT_ADDRESS: "0x17e82d8004590A927204A0729f1AA010Fa889989",      // production
    // PRESALE_ADDRESS: "0x20D13885B2B2068A44BD217E8C00750dEA6a56AC", // demo
    // BPT_ADDRESS: "0x4b2BE03d1D59e1D7fEf4Dd22E364f1A00BC18299",     // demo
  },
};
