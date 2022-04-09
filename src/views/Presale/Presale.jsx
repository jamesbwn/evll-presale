import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TabPanel from "../../components/TabPanel";
import { changeApproval, changeDeposit } from "../../slices/PresaleThunk";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import {
  Paper,
  Grid,
  Typography,
  Box,
  Zoom,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";
import { trim } from "../../helpers";
import "./presale.scss";
import { Skeleton } from "@material-ui/lab";
import { error, info } from "../../slices/MessagesSlice";
import { ethers, BigNumber } from "ethers";
import gif from '../../assets/evll.gif'


function Presale() {
  const dispatch = useDispatch();
  let isLoad = false;
  const { provider, address, connected, connect, chainID } = useWeb3Context();
  const [quantity, setQuantity] = useState("");
  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });
  const rate = useSelector(state => {
    return state.app.rate;
  });
  const ethBalance = useSelector(state => {
    return state.account.balances && state.account.balances.bnb;
  });


  const claimableBalance = useSelector(state => {
    return state.account.claim && state.account.claim.claimableAmount;
  });


  // const isAddedWhitelist = useSelector(state => {
  //   return state.account.presale && state.account.presale.isWhiteList;
  // });

  const minETHLimit = useSelector(state => {
    return state.app.minETHLimit;
  });
  const tokensRemain = useSelector(state => {
    return state.app.totalTokenAmount
  }); 
  const tokenSold = useSelector(state => {
    return state.app.totalTokenSold;
  });

  const isPresaleOpen = useSelector(state => {
    return state.app.isPresaleOpen;
  });

  if (!isLoad && ethBalance && (Number(ethBalance) - Number(ethBalance) < 0)) {
    dispatch(info("You got not enough BNB."));
    isLoad = true;
  }
  // if (!isAddedWhitelist) {
  //   dispatch(info("You are not on the whitelist."));
  // }
  const setMax = () => {
    setQuantity(0.5);
  };

  const onChangeDeposit = async action => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0 || quantity === "") {
      // eslint-disable-next-line no-alert
      return dispatch(error("Please enter a value!"));
    }

    // 1st catch if quantity > balance
    let gweiValue = ethers.utils.parseUnits(quantity, "ether");
    if (action === "presale" && gweiValue.gt(ethers.utils.parseUnits(ethBalance, "ether"))) {
      return dispatch(error("You cannot deposit more than your BNB balance."));
    }
    await dispatch(changeDeposit({ address, action, value: quantity.toString(), provider, networkID: chainID }));
  };

  return (
    <div id="dashboard-view">
      <div className="presale-header">
        <h1>PrivateSale</h1>
        <p>Private sale ended, EVLL can be claimed on launch!</p>
      </div>
      <Paper className="ref-card">
        <img src={gif} style={{width: "100%", height: "auto", borderRadius: "24px"}} />
      </Paper>
      <div style={{marginBottom: "16px"}} />
      <Paper className={`ohm-card`}>
        <Grid container direction="column" spacing={2}>
          {/* {tokenSold &&  
            <Grid item>
              <div className="stake-top-metrics data-row-centered" style={{marginBottom: "18px"}}>
                <Typography className="presale-items">Tokens Sold:</Typography>
                <Typography className="presale-items" style={{marginLeft: "16px"}}><span style={{color: "#11d59e"}}>{tokenSold} EVLL</span></Typography>
              </div>
              <div className="stake-top-metrics data-row-centered" style={{marginBottom: "18px"}}>
                <Typography className="presale-items">Tokens Left:</Typography>
                <Typography className="presale-items" style={{marginLeft: "16px"}}><span style={{color: "#11d59e"}}>{tokensRemain} EVLL</span></Typography>
              </div>
              <div className="stake-top-metrics data-row-centered" style={{marginBottom: "18px"}}>
                <Typography className="presale-items">1 BNB = </Typography>
                <Typography className="presale-items" style={{marginLeft: "16px"}}><span style={{color: "#11d59e"}}> {rate?.toString()} EVLL</span></Typography>
              </div>
            </Grid>
          } */}
          
          {1 > 0 ? 
          <Grid item>
            <div className="stake-top-metrics" style={{ whiteSpace: "normal" }}>
              <Box alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                { address ? (
                    <>
                      {/* <Grid item xs={12} sm={3} md={3} lg={3} /> */}
                      <div className="stake-top-metrics data-row-centered" style={{marginBottom: "12px"}}>
                        <Typography className="presale-items"><span style={{color: "#11d59e"}}>Your Claimable EVLL </span></Typography>
                        <Typography className="presale-items"style={{marginLeft: "16px"}}> {claimableBalance ? Number.parseFloat(claimableBalance).toFixed(3) : 0} </Typography>
                      </div>
                      <div className="stake-top-metrics data-row-centered" style={{marginBottom: "12px"}}>
                        <Typography className="presale-items"><span style={{color: "#11d59e"}}>Your BNB balance</span></Typography>
                        <Typography className="presale-items"style={{marginLeft: "16px"}}>{Number.parseFloat(ethBalance).toFixed(3)}</Typography>
                      </div>
                      <div className="stake-top-metrics data-row-centered" style={{marginBottom: "12px"}}>
                        <Typography className="presale-items"><span style={{color: "#11d59e"}}>Fixed Buy BNB </span></Typography>
                        <Typography className="presale-items"style={{marginLeft: "16px"}}>{Number.parseFloat(minETHLimit).toFixed(1)}</Typography>
                      </div>

                      <Box alignItems="center" justifyContent="center" flexDirection="column" display="flex" style={{marginBottom: "16px", marginTop: "4px"}}>
                          <Typography >Enter Amount in BNB</Typography>
                      </Box>
                      <Box item xs={12} sm={6} md={6} lg={6}>
                        <FormControl className="ohm-input" variant="outlined" color="primary">
                          <InputLabel htmlFor="amount-input"></InputLabel>
                          <OutlinedInput
                            id="amount-input"
                            type="number"
                            placeholder="Enter an amount"
                            className="stake-input"
                            value={quantity}
                            width="100%"
                            onChange={e => setQuantity(e.target.value)}
                            labelWidth={0}
                            endAdornment={
                              <InputAdornment position="end">
                                <Button variant="text" onClick={setMax} color="inherit">
                                  Max
                                </Button>
                              </InputAdornment>
                            }
                          />
                        <Box alignItems="center" justifyContent="center" flexDirection="column" display="flex" style={{marginBottom: "16px"}}>
                          <Typography style={{marginTop: "16px"}}>You will get { rate? quantity * rate : ''} EVLL</Typography>
                        </Box>
                        <Box alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                          {/* <Typography style={{marginTop: "16px"}}>1 EVLL = {rate} BUSD</Typography>
                          <Typography style={{marginTop: "16px"}}>Enter Amount in BUSD</Typography> */}
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "deposit")}
                            style={{marginTop: "16px"}}
                            onClick={() => {
                              onChangeDeposit("presale");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "deposit", "BUY")}
                          </Button>
                        </Box>
                        </FormControl>
                      </Box>
                    </>
                  
                ) : (
                  <>
                    <Skeleton width="35%" />
                  </>
                )}
              </Box>
            </div>
          </Grid>
          :
          <Grid item>
            <Typography className="presale-items" varient="h4">PrviateSale is not live</Typography>
          </Grid>
          }
        </Grid>
      </Paper>
    </div>
  );
}

export default Presale;
