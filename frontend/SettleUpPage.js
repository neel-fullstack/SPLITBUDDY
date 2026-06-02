// src/User/SettleUpPage.js
import { useEffect, useState, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

export default function SettleUpPage() {
  const user = JSON.parse(sessionStorage.getItem("loggedInUser") || "null");
  const location = useLocation();
  const navigate = window.reactRouterNavigate || require("react-router-dom").useNavigate();

  const [balances, setBalances] = useState([]);
  const settlementInfo = location.state?.settlement;
  const [selectedUser, setSelectedUser] = useState(settlementInfo ? settlementInfo.to_user : "");
  const [amount, setAmount] = useState(settlementInfo ? settlementInfo.amount : "");
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  // Load balances
  const loadBalances = useCallback(async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/users/${user.user_id}/balance`
      );
      const data = await res.json();
      let balancesArray = [];
      if (Array.isArray(data)) {
        balancesArray = data;
      } else if (Array.isArray(data.balances)) {
        balancesArray = data.balances;
      }
      const roundedBalances = balancesArray.map((bal) => ({
        ...bal,
        amount: Math.round(parseFloat(bal.amount)),
      }));
      setBalances(roundedBalances);
    } catch (err) {
      setBalances([]);
    }
  }, [user]);

  useEffect(() => {
    if (user?.user_id) {
      loadBalances();
      if (settlementInfo) {
        setShowPaymentOptions(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user_id]);

  async function handleSettleOnHand(e) {
    e.preventDefault();
    setMessage("");
    const roundedAmount = Math.round(parseFloat(amount));
    const toUser = settlementInfo ? settlementInfo.to_user : selectedUser;
    if (!toUser || !roundedAmount) {
      setMessage("⚠️ Please select a user and enter a valid amount.");
      return;
    }
    try {
      const res = await fetch("http://localhost:4000/api/settlements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_user: user.user_id,
          to_user: toUser,
          amount: roundedAmount,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMessage("✅ Payment successful! Settlement completed.");
      setAmount("");
      setSelectedUser("");
      setPaymentMethod("");
      setShowPaymentOptions(false);
      setTimeout(() => {
        if (settlementInfo && settlementInfo.group_id) {
          navigate(`/groups/${settlementInfo.group_id}/expenses`);
        } else {
          navigate("/expenses");
        }
      }, 1000);
    } catch (err) {
      setMessage("❌ Failed to settle, please try again.");
    }
  }

  async function handleRazorpayPay() {
    setMessage("");
    const roundedAmount = Math.round(parseFloat(amount));
    const toUser = settlementInfo ? settlementInfo.to_user : selectedUser;
    if (!toUser || !roundedAmount) {
      setMessage("⚠️ Please select a user and enter a valid amount.");
      return;
    }
    try {
      const orderRes = await fetch("http://localhost:4000/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: roundedAmount * 100,
          currency: "INR",
          from_user: user.user_id,
          to_user: toUser,
          group_id: settlementInfo?.group_id || null,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.id) throw new Error("Failed to create Razorpay order");

      const options = {
        key: "rzp_test_RLJtrMpC4SnfN2",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "SplitBuddy",
        description: "Group Settlement Payment",
        order_id: orderData.id,
        handler: async function (response) {
          const verifyRes = await fetch("http://localhost:4000/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              from_user: user.user_id,
              to_user: toUser,
              amount: roundedAmount,
              group_id: settlementInfo?.group_id || null,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            setMessage("✅ Razorpay payment successful! Settlement completed.");
            setTimeout(() => {
              if (settlementInfo && settlementInfo.group_id) {
                navigate(`/groups/${settlementInfo.group_id}/expenses`);
              } else {
                navigate("/expenses");
              }
            }, 1000);
          } else {
            setMessage("❌ Razorpay payment verification failed.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#185a9d" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setMessage("❌ Razorpay payment failed. " + err.message);
    }
  }

  return (
    <>
      <UserHeader />
      <div
        className="bg-light"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "40px",
          background: "#f4f7fb",
          minHeight: "83.5vh",
          fontFamily: "Poppins, Segoe UI, Arial, sans-serif",
        }}
      >
        <div
          className="shadow-lg"
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "40px 48px",
            boxShadow: "0 50px 100px #185a9d",
            width: "100%",
            maxWidth: "800px",
            fontFamily: "Poppins, Segoe UI, Arial, sans-serif",
          }}
        >
          <h2
            className="mb-4 text-center fw-bold"
            style={{ color: "#185a9d", fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' }}
          >
            💸 Settle Up
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowPaymentOptions(true);
              setMessage("");
            }}
            style={{ fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' }}
          >
            <div className="mb-3 text-start">
              <label className="form-label fw-bold" style={{ color: '#185a9d' }}>Select User</label>
              <select
                className="form-select"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                style={{ borderRadius: "8px", padding: "10px" }}
                disabled={!!settlementInfo}
              >
                <option value="">-- Select --</option>
                {balances.map((bal, idx) => (
                  <option key={idx} value={bal.to_user_id}>
                    {bal.to_user_name} ({bal.to_user_email})
                  </option>
                ))}
                {settlementInfo && !balances.some(bal => bal.to_user_id === settlementInfo.to_user) && (
                  <option value={settlementInfo.to_user}>
                    {settlementInfo.to_user_name}
                  </option>
                )}
              </select>
            </div>

            <div className="mb-3 text-start">
              <label className="form-label fw-bold" style={{ color: '#185a9d' }}>Amount</label>
              <input
                type="number"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                style={{ borderRadius: "8px", padding: "10px" }}
                readOnly={!!settlementInfo}
              />
            </div>

            {showPaymentOptions && selectedUser && amount ? (
              <div className="mb-3 text-center">
                <label className="fw-bold" style={{ color: '#185a9d' }}>Choose Payment Method:</label>
                <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "10px" }}>
                  <button
                    type="button"
                    className={`btn btn-outline-success${paymentMethod === "hand" ? " active" : ""}`}
                    style={{ borderRadius: "8px", fontWeight: "bold" }}
                    onClick={() => setPaymentMethod("hand")}
                  >
                    Pay on Hand
                  </button>
                  <button
                    type="button"
                    className={`btn btn-outline-primary${paymentMethod === "razorpay" ? " active" : ""}`}
                    style={{ borderRadius: "8px", fontWeight: "bold" }}
                    onClick={() => setPaymentMethod("razorpay")}
                  >
                    Pay by Razorpay
                  </button>
                </div>
              </div>
            ) : (
              <div className="d-grid">
                <button
                  type="submit"
                  className="btn fw-semibold"
                  style={{
                    backgroundColor: '#185a9d',
                    color: '#fff',
                    border: 'none',
                    fontWeight: '600',
                    borderRadius: "8px",
                    padding: "10px",
                    fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.backgroundColor = '#1565c0';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.backgroundColor = '#185a9d';
                    e.currentTarget.style.color = '#fff';
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </form>

          {showPaymentOptions && paymentMethod === "hand" && (
            <div className="d-grid mt-3">
              <button
                className="btn fw-semibold"
                style={{
                  backgroundColor: '#2ecc40',
                  color: '#fff',
                  border: 'none',
                  fontWeight: '600',
                  borderRadius: "8px",
                  padding: "10px",
                  fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.backgroundColor = '#27ae60';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.backgroundColor = '#2ecc40';
                  e.currentTarget.style.color = '#fff';
                }}
                onClick={handleSettleOnHand}
              >
                Settle Up
              </button>
            </div>
          )}
          {showPaymentOptions && paymentMethod === "razorpay" && (
            <div className="d-grid mt-3">
              <button
                className="btn fw-semibold"
                style={{
                  backgroundColor: '#185a9d',
                  color: '#fff',
                  border: 'none',
                  fontWeight: '600',
                  borderRadius: "8px",
                  padding: "10px",
                  fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.backgroundColor = '#1565c0';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.backgroundColor = '#185a9d';
                  e.currentTarget.style.color = '#fff';
                }}
                onClick={handleRazorpayPay}
              >
                Pay with Razorpay
              </button>
            </div>
          )}

          {message && (
            <div
              className="alert alert-info text-center mt-4"
              style={{
                borderRadius: "8px",
                fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
                fontWeight: "500",
              }}
            >
              {message}
            </div>
          )}
        </div>
      </div>
      <Outlet />
      <UserFooter />
    </>
  );
}
