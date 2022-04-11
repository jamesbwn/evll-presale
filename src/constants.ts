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
    PRESALE_ADDRESS: "0xABBAE4374b5a091544d84868A644204E9157473a",  // production
    EVLL_ADDRESS: "0xa633f1cAA907B74e223DCa17bbd675C17e57E4fF",      // production
    // PRESALE_ADDRESS: "0xbA7728F9cB4D478FA0e00f320BAc0a4bd884a334", // demo
    // EVLL_ADDRESS: "0x0b806E477dE582bC018A178e80010Cf1049074AC",     // demo
  },
};
