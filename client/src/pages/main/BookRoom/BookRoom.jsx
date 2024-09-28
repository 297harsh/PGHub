import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../context/UserData";
import { useParams, useNavigate } from "react-router-dom";

import {
  Button,
  Grid,
  Typography,
  Box,
  TextField,
  Backdrop, 
  CircularProgress,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import RoomSquareCard from "./RoomSquareCard";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";

const serverapiUrl = import.meta.env.VITE_API_URL;

const BookRoom = () => {
  const { user } = useContext(UserContext);
  const { pgId } = useParams();
  const [pgData, setPgData] = useState(null);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [selectedBeds, setSelectedBeds] = useState(0);

  const handleCardClick = (roomType) => {
    console.log(roomType);
    setSelectedRoomType(roomType);
    setSelectedBeds(0); // Reset beds count when changing room type
  };

  const handleIncrease = () => {
    if (
      selectedRoomType &&
      pgData.remainRoom[selectedRoomType].numOfBed - selectedBeds > 0
    ) {
      setSelectedBeds((prevCount) => prevCount + 1);
    }
  };

  const handleDecrease = () => {
    if (selectedRoomType && selectedBeds > 0) {
      setSelectedBeds((prevCount) => prevCount - 1);
    }
  };

  const calculatePrice = () => {
    if (selectedRoomType) {
      return pgData.roomInfo[selectedRoomType].RentOfBed * selectedBeds;
    }
    return 0;
  };

  let cashfree;
  let initializeSDK = async function () {
    cashfree = await load({
      mode: "sandbox",
    });
  };

  initializeSDK();

  const [orderId, setOrderId] = useState("");
  let order = 0;
  // let payedTotalAmount= 0

  const getSessionId = async () => {
    try {
      const totalAmount = await calculatePrice();
      // payedTotalAmount=totalAmount;

      let res = await axios.get(`${serverapiUrl}/payment/bookPg`, {
        params: {
          userId: user._id,
          mobileNo: user.mobileNo,
          email: user.email,
          userName: user.userName,
          pgId: pgData._id,
          amount: totalAmount,
        },
      });

      if (res.data && res.data.payment_session_id) {
        console.log("8888888888");
        console.log("res.data.order_id ",res.data.order_id);
        order = res.data.order_id;
        setOrderId(res.data.order_id);

        return res.data.payment_session_id;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const verifyPayment = async () => {
  //   try {
  //     console.log("----------------");
  //     console.log(orderId);
  //     console.log(order);
  //     let res = await axios.post(`${serverapiUrl}/payment/verify`, {
  //       orderId: order,
  //     });

  //     if (res && res.data) {
  //       console.log(res.data);
  //       alert("Payment verified");

  //       const paymentDetails = {
  //         ownerId: pgData.ownerId,
  //         renterId: user._id,
  //         pgId: pgData._id,
  //         booking: {
  //           typesOfRoom: selectedRoomType,
  //           numbedbook: selectedBeds,
  //           rent: pgData.roomInfo[selectedRoomType].RentOfBed,
  //           deposit: pgData.deposit,
  //           depositAmount: pgData.depositAmount || 0,
  //           totalAmount: await calculatePrice(),
  //         },
  //         paymentId: order,
  //         paymentStatus: res.data[0].payment_status,
  //         paymentDate: new Date(),
  //       };

  //       console.log("paymentDetails");
  //       console.log(paymentDetails);
  //       const response = await fetch(`${serverapiUrl}/payment/save`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ paymentDetails }),
  //       });

  //       const data = await response.json();
  //       console.log("**********************");
  //       if (data.success) {
  //         console.log(data.message);
  //       }
  //       else {
  //         console.log(data.message);
  //       }
  //     }
  //   }
  //   catch (error) {
  //     console.log(error);
  //   }
  // };

  // const handlePay = async (e) => {
  //   e.preventDefault();
  //   try {
  //     let sessionId = await getSessionId();
  //     let checkoutOptions = {
  //       paymentSessionId: sessionId,
  //       redirectTarget: "_modal",
  //     };

  //     cashfree.checkout(checkoutOptions).then((res) => {
  //       console.log("hii !!!!!!!!!!!!!!!!!!!");
  //       verifyPayment(orderId);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const [bedCounts, setBedCounts] = useState(
  //   Object.keys(pgData.roomInfo).reduce((acc, roomType) => {
  //     acc[roomType] = pgData.remainRoom[roomType].numOfBed;
  //     return acc;
  //   }, {})
  // );

  const verifyPayment = async () => {
    try {
      console.log("Payment ");

      let res = await axios.post(`${serverapiUrl}/payment/verify`, {
        orderId: orderId,
      });

      if (res && res.data) {
        if (res.data.payment_status === "SUCCESS") {
          console.log("Payment verified successfully");
          await savePaymentDetails(); // Function to save payment
        } 
        else {
          console.error("Payment verification failed:", res.data);
        }
      }
    } catch (error) {
      console.error("Payment verification error:", error);
    }
  };

  const handlePay = async (e) => {
    e.preventDefault();
    try {
      let sessionId = await getSessionId();
      let checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      };

      cashfree.checkout(checkoutOptions).then((res) => {
        console.log("=======================")
        console.log(res)
        console.log(res.status)
        if (res.status === "SUCCESS") {
          verifyPayment();
        } 
        else {
          console.error("Payment failed", res);
        }
      });
    } catch (error) {
      console.log("Payment error:", error);
    }
  };

  const getPgDetails = async () => {
    if (!pgId) {
      alert("Pg Not Found.");
      return;
    }
    try {
      const response = await fetch(`${serverapiUrl}/pgDetails/pg/${pgId}`, {
        method: "GET",
      });
      const data = await response.json();
      console.log(data.pgDetails);

      if (data.success) {
        // toast.success("Fetched PG data successfully.");
        setPgData(data.pgDetails);
      } else {
        // toast.error(data.message || "Internal error, please try again later.");
        alert(`${data.message}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPgDetails();
  }, []);

  if (pgData == null || !pgData) {
    return (
      <Box m="20px">
        <Box
          height="100vh"
          position="relative"
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Backdrop
            sx={{
              color: "#41a5a9",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "80%",
              zIndex: (theme) => theme.zIndex.drawer + 1,
              bgcolor: "inherit",
            }}
            open={true}
          >
            <CircularProgress sx={{ color: "#7a5af5" }} />
          </Backdrop>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          padding: 4,
          backgroundColor: "#ffffff",
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          marginTop: 5,
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <img
              src={`${pgData.images[0]}`}
              alt="PG Property"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: 8,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Box mt={2}>
              {/* PG Details */}
              <Typography variant="h5" fontWeight="bold">
                {pgData.pgName}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {pgData.address}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Owner: Walter White
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Email: owner@example.com
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Mobile: +91 98765 43210
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box sx={{ marginBottom: 4 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ marginBottom: 2, color: "#41a5a9" }}
              >
                Room Details
              </Typography>
              <Grid container spacing={2}>
                {Object.keys(pgData.roomInfo).map((roomType) => (
                  <Grid item xs={12} sm={6} md={4} key={roomType}>
                    <RoomSquareCard
                      roomType={roomType}
                      RentOfBed={pgData.roomInfo[roomType].RentOfBed}
                      numOfBed={pgData.roomInfo[roomType].numOfBed}
                      remainNumOfRoom={pgData.remainRoom[roomType].numOfBed}
                      // numOfBed={bedCounts[roomType]}
                      selected={selectedRoomType === roomType}
                      // onClick={() => handleCardClick(roomType)}
                      handleCardClick={handleCardClick}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Bed Selector */}
            <Box sx={{ marginTop: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "left",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }} gap={2}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Beds
                  </Typography>

                  <IconButton
                    onClick={() => handleDecrease()}
                    aria-label="decrease"
                    size="small"
                    sx={{ border: "1px solid #ccc", borderRadius: "10px" }}
                  >
                    <RemoveIcon />
                  </IconButton>

                  <Typography variant="body2" sx={{ mx: 1 }}>
                    {selectedBeds}
                  </Typography>

                  <IconButton
                    onClick={() => handleIncrease()}
                    aria-label="increase"
                    size="small"
                    sx={{ border: "1px solid #ccc", borderRadius: "10px" }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            {/* Price and Deposit */}
            <Box
              sx={{
                marginTop: 4,
                padding: 2,
                backgroundColor: "#f1f1f1",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Price for {selectedBeds} Bed{selectedBeds > 1 ? "s" : ""}:
              </Typography>
              <TextField
                variant="outlined"
                value={`₹${calculatePrice()}`}
                InputProps={{ readOnly: true }}
                sx={{
                  marginBottom: 2,
                  width: "15%",
                  "&:hover": {
                    borderColor: "#41a5a9",
                    backgroundColor: "rgba(65, 165, 169, 0.1)",
                  },
                  transition: "border-color 0.3s, background-color 0.3s",
                }}
              />

              <Typography variant="h6" gutterBottom>
                Deposit:
              </Typography>
              <Typography
                sx={{
                  width: "15%",
                  border: "1px solid #c4c4c4", // Equivalent to the "outlined" effect
                  padding: "10px", // Add padding to make it look like a TextField
                  borderRadius: "4px", // Same border radius as TextField
                  "&:hover": {
                    borderColor: "#41a5a9",
                    backgroundColor: "rgba(65, 165, 169, 0.1)",
                  },
                  transition: "border-color 0.3s, background-color 0.3s",
                }}
              >
                {pgData.deposit == "Require"
                  ? pgData.depositAmount
                  : pgData.deposit}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Payment Button */}
        <Box textAlign="center" mt={5}>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePay}
            sx={{
              padding: "10px 20px",
              backgroundColor: "#41a5a9",
              "&:hover": {
                backgroundColor: "#379a8f",
              },
            }}
          >
            Pay Now
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default BookRoom;
