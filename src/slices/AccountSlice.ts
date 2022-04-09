import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as sBHD } from "../abi/Presale.json";
import { abi as PresaleContractAbi } from "../abi/Presale.json";
import { abi as pBHD } from "../abi/Presale.json";
import { setAll } from "../helpers";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk } from "./interfaces";


export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    const bhdContract = new ethers.Contract(addresses[networkID].PRESALE_ADDRESS as string, ierc20Abi, provider);
    const bhdBalance = await bhdContract.balanceOf(address);
    const sbhdContract = new ethers.Contract(addresses[networkID].PRESALE_ADDRESS as string, sBHD, provider);
    const sbhdBalance = await sbhdContract.balanceOf(address);
    // let poolBalance = 0;
    // const poolTokenContract = new ethers.Contract(addresses[networkID].PT_TOKEN_ADDRESS as string, ierc20Abi, provider);
    // poolBalance = await poolTokenContract.balanceOf(address);

    return {
      balances: {
        bhd: ethers.utils.formatUnits(bhdBalance, "gwei"),
        sbhd: ethers.utils.formatUnits(sbhdBalance, "gwei"),
        // pool: ethers.utils.formatUnits(poolBalance, "gwei"),
      },
    };
  },
);

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk) => {
    let bhdBalance = 0;
    let busdBalance = 0;
    let presaleAllowance = 0;
    let claimAllowance = 0;
    let claimableAmount = 0;
    // let totalPurchasedAmount = 0;
    // let claimedAmount = 0;
    let isAddedWhitelist = false;
    let bptBalance = 0;
    let bnbBalance;

    bnbBalance = await provider.getBalance(address);
    const busdContract = new ethers.Contract(addresses[networkID].BUSD_ADDRESS as string, ierc20Abi, provider);
    busdBalance = await busdContract.balanceOf(address);


    const bhdContract = new ethers.Contract(addresses[networkID].TOKEN_ADDRESS as string, ierc20Abi, provider);
    bhdBalance = await bhdContract.balanceOf(address);

    const bptContract = new ethers.Contract(addresses[networkID].EVLL_ADDRESS as string, ierc20Abi, provider);
    bptBalance = await bptContract.balanceOf(address);

    const presaleContract = new ethers.Contract(
      addresses[networkID].PRESALE_ADDRESS as string,
      PresaleContractAbi,
      provider,
    );

    if (addresses[networkID].BUSD_ADDRESS) {
      presaleAllowance = await busdContract.allowance(address, addresses[networkID].PRESALE_ADDRESS);
    }

    if (addresses[networkID].TOKEN_ADDRESS) {
      claimAllowance = await bhdContract.allowance(address, addresses[networkID].PRESALE_ADDRESS);
    }
    isAddedWhitelist = await presaleContract.whiteListed(address);

    claimableAmount = await presaleContract.tokensUnclaimed(address);
    // totalPurchasedAmount = (await presaleContract.preBuys(address)).busdAmount;
    // claimedAmount = (await presaleContract.preBuys(address)).pTokenClaimedAmount;
    return {
      balances: {
        bnb: ethers.utils.formatEther(bnbBalance),
        busd: ethers.utils.formatEther(busdBalance),
        bhd: ethers.utils.formatUnits(bhdBalance, "gwei"),
        bpt: ethers.utils.formatEther(bptBalance),
      },
      presale: {
        presaleAllowance: +presaleAllowance,
        isWhiteList: isAddedWhitelist,
      },
      claim: {
        claimAllowance: +claimAllowance,
        claimableAmount: ethers.utils.formatEther(claimableAmount),
        // totalPurchasedAmount: ethers.utils.formatEther(totalPurchasedAmount),
        // claimedAmount: ethers.utils.formatEther(claimedAmount),
      },
      // staking: {
      //   bhdStake: +stakeAllowance,
      //   bhdUnstake: +unstakeAllowance,
      // },
      // bonding: {
      //   daiAllowance: daiBondAllowance,
      // },
      // pooling: {
      //   sbhdPool: +poolAllowance,
      // },
    };
  },
);


interface IAccountSlice {
  balances: {
    bnb: string;
    bhd: string;
    busd: string;
    bpt: string;
  };
  loading: boolean;
}
const initialState: IAccountSlice = {
  loading: false,
  balances: { bnb: "", bhd: "", busd: "", bpt: "" },
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
