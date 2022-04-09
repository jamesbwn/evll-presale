import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as PresaleContract } from "../abi/Presale.json";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { setAll, getTokenPrice, getMarketPrice } from "../helpers";
import { NodeHelper } from "../helpers/NodeHelper";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAsyncThunk } from "./interfaces";

const initialState = {
  loading: false,
  loadingMarketPrice: false,
};

export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch }) => {
    const presaleContract = new ethers.Contract(
      addresses[networkID].PRESALE_ADDRESS as string,
      PresaleContract,
      provider,
    );
    const evllContract = new ethers.Contract(addresses[networkID].EVLL_ADDRESS as string, ierc20Abi, provider);
    const tokenBalance = await evllContract.balanceOf(addresses[networkID].PRESALE_ADDRESS);
    const totalTokenAmount = ethers.utils.formatEther(tokenBalance);
    // console.log("debug tokenbalance", tokenBalance, typeof(tokenBalance));
    // const percentReleased = await presaleContract.getPercentReleased();
    // const isList = await presaleContract.isList();
    const isPresaleOpen = await presaleContract.isSaleActive();
    const isClaimOpen = await presaleContract.isClaimActive();
    let fixedETHLimit = await presaleContract.fixedBuyETHAmount();
    fixedETHLimit = ethers.utils.formatEther(fixedETHLimit);
    const rate = await presaleContract.tokenPerBNB();
    // const rate_decimals = await presaleContract.RATE_DECIMALS();
    // const price = rate_decimals / rate;
    let totalTokenSold = await presaleContract.totalTokensSold();
    totalTokenSold = ethers.utils.formatEther(totalTokenSold);
    return {
      // percentReleased,
      // isList,
      isPresaleOpen,
      isClaimOpen,
      fixedETHLimit,
      rate,
      totalTokenSold,
      totalTokenAmount,
    } as IPresaleData;
  },
);

interface IPresaleData {
  // readonly percentReleased: number;
  // readonly isList: boolean;
  readonly isPresaleOpen: boolean;
  readonly isClaimOpen: boolean;
  readonly fixedETHLimit: number;
  readonly rate: number;
  readonly totalTokenSold: number;
  readonly totalTokenAmount: string;
}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      })
  },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
