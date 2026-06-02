import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FIXER_API_KEY = "0504698c3b2289dcfa9826c912af073f"; // <-- Replace with your actual key

export default function UserHome() {
  const [user, setUser] = useState(null);
  const [groupsCount, setGroupsCount] = useState(0);
  const [expensesCount, setExpensesCount] = useState(0);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [amountToConvert, setAmountToConvert] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [conversionLoading, setConversionLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const u = sessionStorage.getItem("loggedInUser");
    if (u) {
      setUser(JSON.parse(u));
    }
  }, []);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;

      // 1. Groups count
      const groupsRes = await fetch(
        `http://localhost:4000/api/groups/user/${user.user_id}`
      );
      const groups = await groupsRes.json();
      setGroupsCount(groups.length);

      // 2. Expenses count
      const splitsRes = await fetch(`http://localhost:4000/api/expense_splits`);
      const splits = await splitsRes.json();
      setExpensesCount(splits.filter((s) => s.user_id === user.user_id).length);
    }

    fetchDashboardData();
  }, [user]);

  const handleConvertCurrency = async () => {
    setConversionLoading(true);
    setConvertedAmount(null);
    try {
      // Fixer.io only supports EUR as base on free plan, so you need two requests for non-EUR conversions
      let rate = 1;
      if (fromCurrency === "EUR") {
        // Direct conversion from EUR to target
        const res = await fetch(
          `https://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}&symbols=${toCurrency}`
        );
        const data = await res.json();
        if (data.success && data.rates[toCurrency]) {
          rate = data.rates[toCurrency];
        } else {
          setConvertedAmount("N/A");
          setConversionLoading(false);
          return;
        }
      } else {
        // Convert fromCurrency to EUR, then EUR to toCurrency
        const res = await fetch(
          `https://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}&symbols=${fromCurrency},${toCurrency}`
        );
        const data = await res.json();
        if (data.success && data.rates[fromCurrency] && data.rates[toCurrency]) {
          // Convert fromCurrency to EUR, then EUR to toCurrency
          rate = data.rates[toCurrency] / data.rates[fromCurrency];
        } else {
          setConvertedAmount("N/A");
          setConversionLoading(false);
          return;
        }
      }
      setConvertedAmount((amountToConvert * rate).toFixed(2));
    } catch (err) {
      setConvertedAmount("Error");
    }
    setConversionLoading(false);
  };

  return (
    <div
      className="p-4"
      style={{
        minHeight: "100%",
        background: "#fff",
        fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
      }}
    >
      {/* Website description line */}
      <div className="mb-4 text-center" style={{ fontSize: "1.15rem", color: "#185a9d", fontWeight: 500 }}>
        SplitBuddy helps you manage group expenses in real time, with smart tracking and instant updates for every member.
      </div>
      <div className="row g-4 mt-4 justify-content-center">
        {[{
          title: 'Groups Joined',
          value: groupsCount,
          subtitle: 'Total groups you are part of',
        }, {
          title: 'Expenses Participated',
          value: expensesCount,
          subtitle: 'Total expenses you are part of',
        }].map((card, idx) => (
          <div className="col-md-4" key={idx}>
            <div
              className="card border-0 shadow-lg"
              style={{
                borderRadius: "20px",
                background: "#fff",
                minHeight: "220px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 32px rgba(24, 90, 157, 0.18)",
                transition: "transform 0.2s, box-shadow 0.2s, background 0.2s",
                fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = "scale(1.04)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(24, 90, 157, 0.25)";
                e.currentTarget.style.background = "#185a9d";
                Array.from(e.currentTarget.getElementsByClassName("card-title")).forEach(el => el.style.color = "#fff");
                Array.from(e.currentTarget.getElementsByClassName("card-text")).forEach(el => el.style.color = "#fff");
                Array.from(e.currentTarget.getElementsByTagName("small")).forEach(el => el.style.color = "#e3eaf5");
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(24, 90, 157, 0.18)";
                e.currentTarget.style.background = "#fff";
                Array.from(e.currentTarget.getElementsByClassName("card-title")).forEach(el => el.style.color = "#185a9d");
                Array.from(e.currentTarget.getElementsByClassName("card-text")).forEach(el => el.style.color = "#185a9d");
                Array.from(e.currentTarget.getElementsByTagName("small")).forEach(el => el.style.color = "#6c757d");
              }}
            >
              <div className="card-body d-flex flex-column justify-content-center align-items-center text-center w-100">
                <h5 className="card-title fw-bold" style={{color: '#185a9d'}}>{card.title}</h5>
                <p className="card-text display-6 mb-2" style={{color: '#185a9d'}}>
                  <strong>{card.value}</strong>
                </p>
                <small className="text-muted">{card.subtitle}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Centered Create New Group Button */}
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <button
          className="btn fw-semibold"
          style={{
            backgroundColor: '#185a9d',
            color: '#fff',
            border: 'none',
            fontWeight: '600',
            fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
            borderRadius: '12px',
            padding: '16px 32px',
            fontSize: '1.2rem',
            boxShadow: '0 4px 16px rgba(24, 90, 157, 0.10)',
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
          onClick={() => navigate('/groups')}
        >
          ➕ Create New Group
        </button>
      </div>
      {/* Currency Converter Card - Redesigned */}
      <div
        className="card border-0 shadow-lg mb-4"
        style={{
          borderRadius: "20px",
          background: "#fff",
          minHeight: "220px",
          maxWidth: "600px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 32px rgba(24, 90, 157, 0.18)",
          transition: "transform 0.2s, box-shadow 0.2s, background 0.2s",
          fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
        }}
        onMouseOver={e => {
          e.currentTarget.style.transform = "scale(1.04)";
          e.currentTarget.style.boxShadow = "0 12px 40px rgba(24, 90, 157, 0.25)";
          e.currentTarget.style.background = "#185a9d";
          Array.from(e.currentTarget.getElementsByClassName("card-title")).forEach(el => el.style.color = "#fff");
          Array.from(e.currentTarget.getElementsByClassName("card-text")).forEach(el => el.style.color = "#fff");
          Array.from(e.currentTarget.getElementsByTagName("small")).forEach(el => el.style.color = "#e3eaf5");
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(24, 90, 157, 0.18)";
          e.currentTarget.style.background = "#fff";
          Array.from(e.currentTarget.getElementsByClassName("card-title")).forEach(el => el.style.color = "#185a9d");
          Array.from(e.currentTarget.getElementsByClassName("card-text")).forEach(el => el.style.color = "#185a9d");
          Array.from(e.currentTarget.getElementsByTagName("small")).forEach(el => el.style.color = "#6c757d");
        }}
      >
        <div className="card-body d-flex flex-column justify-content-center align-items-center text-center w-100">
          <h5 className="card-title fw-bold mb-3" style={{ color: "#185a9d" }}>Currency Converter</h5>
          <div className="card-text mb-2 d-flex flex-wrap justify-content-center align-items-center" style={{ gap: "8px" }}>
            <input
              type="number"
              value={amountToConvert}
              min={0}
              onChange={e => setAmountToConvert(e.target.value)}
              className="form-control"
              style={{ width: "90px", borderRadius: "8px", border: "1px solid #e3eaf5", fontWeight: "500", fontSize: "1.1rem" }}
            />
            {/* Custom styled dropdown for fromCurrency */}
            <div style={{ position: "relative", width: "110px" }}>
              <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "1.2rem" }}>
                {fromCurrency === "USD" && "🇺🇸"}
                {fromCurrency === "INR" && "🇮🇳"}
                {fromCurrency === "EUR" && "🇪🇺"}
                {fromCurrency === "GBP" && "🇬🇧"}
                {fromCurrency === "JPY" && "🇯🇵"}
              </span>
              <select
                value={fromCurrency}
                onChange={e => setFromCurrency(e.target.value)}
                className="form-select"
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  border: "1px solid #e3eaf5",
                  paddingLeft: "32px",
                  fontWeight: "500",
                  fontSize: "1.1rem",
                  background: "#f7fafd",
                  color: "#185a9d",
                  boxShadow: "0 2px 8px rgba(24, 90, 157, 0.05)",
                  appearance: "none",
                  cursor: "pointer"
                }}
              >
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
              </select>
            </div>
            <span style={{ marginRight: "4px", color: "#185a9d", fontWeight: "bold" }}>to</span>
            {/* Custom styled dropdown for toCurrency */}
            <div style={{ position: "relative", width: "110px" }}>
              <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "1.2rem" }}>
                {toCurrency === "USD" && "🇺🇸"}
                {toCurrency === "INR" && "🇮🇳"}
                {toCurrency === "EUR" && "🇪🇺"}
                {toCurrency === "GBP" && "🇬🇧"}
                {toCurrency === "JPY" && "🇯🇵"}
              </span>
              <select
                value={toCurrency}
                onChange={e => setToCurrency(e.target.value)}
                className="form-select"
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  border: "1px solid #e3eaf5",
                  paddingLeft: "32px",
                  fontWeight: "500",
                  fontSize: "1.1rem",
                  background: "#f7fafd",
                  color: "#185a9d",
                  boxShadow: "0 2px 8px rgba(24, 90, 157, 0.05)",
                  appearance: "none",
                  cursor: "pointer"
                }}
              >
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
              </select>
            </div>
            <button
              className="btn fw-semibold"
              style={{
                backgroundColor: '#185a9d',
                color: '#fff',
                border: 'none',
                fontWeight: '600',
                fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
                borderRadius: '8px',
                padding: '8px 18px',
                fontSize: '1rem',
                boxShadow: '0 2px 8px rgba(24, 90, 157, 0.10)',
                transition: 'background 0.2s, color 0.2s',
              }}
              disabled={conversionLoading}
              onMouseOver={e => {
                e.currentTarget.style.backgroundColor = '#1565c0';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = '#185a9d';
                e.currentTarget.style.color = '#fff';
              }}
              onClick={handleConvertCurrency}
            >
              Convert
            </button>
          </div>
          {convertedAmount !== null && (
            <div className="mt-2 fw-bold card-text" style={{ color: "#185a9d" }}>
              {amountToConvert} {fromCurrency} = {convertedAmount} {toCurrency}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
