import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";
import { FaDownload } from "react-icons/fa";

const currencySymbols = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  // ...
};

export default function BalancesPage() {
  const user = JSON.parse(sessionStorage.getItem("loggedInUser") || "null");
  const [balances, setBalances] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [groupExpenses, setGroupExpenses] = useState({}); // { group_id: [expenses] }

  useEffect(() => {
    async function loadData() {
      try {
        const [balanceRes, settlementsRes] = await Promise.all([
          fetch(`http://localhost:4000/api/users/${user.user_id}/group-balances`), // <-- use group-balances
          fetch(`http://localhost:4000/api/users/${user.user_id}/settlements`),
        ]);
        if (!balanceRes.ok) throw new Error("Failed to fetch balances");
        if (!settlementsRes.ok) throw new Error("Failed to fetch settlements");
        const balanceData = await balanceRes.json();
        const settlementsData = await settlementsRes.json();
        // balanceData is now an array, not {groups: [...]}
        const roundedBalances = balanceData.map((bal) => ({
          ...bal,
          balance: Math.round(parseFloat(bal.balance)),
        }));
        setBalances(roundedBalances);
        setSettlements(settlementsData);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    }
    if (user?.user_id) loadData();
    window.addEventListener("paymentCompleted", loadData);
    return () => {
      window.removeEventListener("paymentCompleted", loadData);
    };
  }, [user.user_id]);

  // Fetch expenses for a group when expanded
  async function handleExpandGroup(group_id) {
    setExpandedGroup(expandedGroup === group_id ? null : group_id);
    if (!groupExpenses[group_id]) {
      const res = await fetch(`http://localhost:4000/api/expenses?group_id=${group_id}`);
      const expenses = await res.json();
      setGroupExpenses((prev) => ({ ...prev, [group_id]: expenses }));
    }
  }

  // Download CSV for a group
  async function downloadGroupStatement(group) {
    try {
      // Fetch expenses for this group
      const res = await fetch(
        `http://localhost:4000/api/expenses?group_id=${group.group_id}`
      );
      if (!res.ok) throw new Error("Failed to fetch group expenses");
      const expenses = await res.json();

      // Fetch splits for this group
      const splitsRes = await fetch(`http://localhost:4000/api/expense_splits`);
      if (!splitsRes.ok) throw new Error("Failed to fetch expense splits");
      const allSplits = await splitsRes.json();
      // Filter splits for this group
      const groupSplits = allSplits.filter(s => expenses.some(e => e.expense_id === s.expense_id));

      // Prepare CSV content
      let csv = `Group: ${group.group_name}\n\nDescription,Amount,Paid By,Date,Split Between\n`;
      expenses.forEach(e => {
        // Find splits for this expense
        const splits = groupSplits.filter(s => s.expense_id === e.expense_id);
        // Format: Name (₹amount)
        const splitStr = splits.map(s => `${s.user_name} (${group.currency} ${s.share_amount})`).join("; ");
        csv += `"${e.description}",${e.amount},"${e.paid_by_name}","${e.created_at}","${splitStr}"\n`;
      });
      csv += `\nTotal Balance,${group.balance}\n`;

      // Download as CSV
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${group.group_name}_statement.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download statement: " + err.message);
    }
  }

  // Calculate totals per currency
  const totals = {};
  balances.forEach(bal => {
    if (!totals[bal.currency]) totals[bal.currency] = 0;
    totals[bal.currency] += Number(bal.balance);
  });

  return (
    <>
      <UserHeader />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "40px",
          background: "#f4f7fb",
          minHeight: "100vh",
          fontFamily: "Poppins, Segoe UI, Arial, sans-serif",
        }}
        className="bg-light"
      >
        <div
          style={{
            display: "flex",
            gap: "32px",
            width: "100%",
            maxWidth: "1100px",
          }}
        >
          {/* Left: Balances and Expenses */}
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "30px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
              width: "60%",
              fontFamily: "Poppins, Segoe UI, Arial, sans-serif",
            }}
            className="shadow-lg"
          >
            <h2
              className="mb-4 text-center fw-bold"
              style={{ color: "#185a9d", fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' }}
            >
              ⚖️ Your Balances
            </h2>

            {loading ? (
              <p className="text-muted">Loading balances...</p>
            ) : balances.length === 0 ? (
              <p className="text-success fw-bold">You are all settled up!</p>
            ) : (
              <ul className="list-group mb-4" style={{ fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' }}>
                {balances.map((bal) => (
                  <li
                    key={bal.group_id}
                    className="list-group-item d-flex flex-column"
                    style={{
                      border: "none",
                      borderBottom: "1px solid #eee",
                      padding: "14px 18px",
                      borderRadius: "8px",
                      marginBottom: "10px",
                      background:
                        bal.balance > 0
                          ? "linear-gradient(90deg, #e6f9ed, #d4f5e3)"
                          : bal.balance < 0
                          ? "linear-gradient(90deg, #fdecea, #fce3e1)"
                          : "#f8f9fa",
                      fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span
                        style={{
                          color:
                            bal.balance > 0
                              ? "#185a9d"
                              : bal.balance < 0
                              ? "#dc3545"
                              : "#185a9d",
                          fontWeight: 600,
                          fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
                        }}
                      >
                        {bal.balance > 0
                          ? `You are owed in ${bal.group_name}`
                          : bal.balance < 0
                          ? `You owe in ${bal.group_name}`
                          : `Settled in ${bal.group_name}`}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span
                          className="badge"
                          style={{
                            background:
                              bal.balance > 0
                                ? "linear-gradient(90deg, #185a9d, #185a9d)"
                                : bal.balance < 0
                                ? "linear-gradient(90deg, #ff6b6b, #ff8787)"
                                : "#185a9d",
                            color: "#fff",
                            fontSize: "0.95rem",
                            padding: "8px 14px",
                            borderRadius: "20px",
                            fontWeight: "600",
                            fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
                          }}
                        >
                          {currencySymbols[bal.currency] || bal.currency} {Math.abs(bal.balance)}
                        </span>
                        <button
                          title="Download group statement"
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#185a9d",
                            fontSize: "1.2rem",
                          }}
                          onClick={() => downloadGroupStatement(bal)}
                        >
                          <FaDownload />
                        </button>
                        <button
                          className="btn btn-link"
                          style={{ fontSize: "1rem", color: "#185a9d" }}
                          onClick={() => handleExpandGroup(bal.group_id)}
                        >
                          {expandedGroup === bal.group_id ? "Hide Expenses" : "Show Expenses"}
                        </button>
                      </span>
                    </div>
                    {/* Show expenses for this group if expanded */}
                    {expandedGroup === bal.group_id && groupExpenses[bal.group_id] && (
                      <div
                        style={{
                          marginTop: 16,
                          background: '#f8f9fa',
                          borderRadius: '12px',
                          boxShadow: '0 2px 8px rgba(24,90,157,0.08)',
                          padding: '18px',
                          overflowX: 'auto',
                        }}
                      >
                        <table
                          className="table table-sm"
                          style={{
                            borderRadius: '10px',
                            overflow: 'hidden',
                            width: '100%',
                            fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
                            background: '#fff',
                          }}
                        >
                          <thead>
                            <tr style={{ background: '#e3eaf5' }}>
                              <th style={{ padding: '10px', color: '#185a9d', fontWeight: 600, border: 'none' }}>Description</th>
                              <th style={{ padding: '10px', color: '#185a9d', fontWeight: 600, border: 'none' }}>Amount</th>
                              <th style={{ padding: '10px', color: '#185a9d', fontWeight: 600, border: 'none' }}>Currency</th>
                              <th style={{ padding: '10px', color: '#185a9d', fontWeight: 600, border: 'none' }}>Paid By</th>
                              <th style={{ padding: '10px', color: '#185a9d', fontWeight: 600, border: 'none' }}>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[...groupExpenses[bal.group_id]]
                              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                              .map(exp => (
                                <tr key={exp.expense_id} style={{ borderBottom: '1px solid #e3eaf5' }}>
                                  <td style={{ padding: '10px', border: 'none' }}>{exp.description}</td>
                                  <td style={{ padding: '10px', border: 'none', color: '#185a9d', fontWeight: 500 }}>{currencySymbols[exp.currency] || exp.currency}{exp.amount}</td>
                                  <td style={{ padding: '10px', border: 'none' }}>{exp.currency}</td>
                                  <td style={{ padding: '10px', border: 'none' }}>{exp.paid_by_name}</td>
                                  <td style={{ padding: '10px', border: 'none' }}>{new Date(exp.created_at).toLocaleDateString()}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Right: Settlements Card */}
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "30px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
              width: "40%",
              fontFamily: "Poppins, Segoe UI, Arial, sans-serif",
              minHeight: "300px",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
            }}
            className="shadow-lg"
          >
            <h4 className="mb-3 fw-bold text-center" style={{ color: '#185a9d', fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' }}>Detailed Pending Settlements</h4>
            {settlements.length === 0 ? (
              <p className="text-success text-center">No pending settlements!</p>
            ) : (
              <ul className="list-group" style={{ fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' }}>
                {[...settlements]
                  .sort((a, b) => {
                    // Use settlement_date if available, fallback to created_at
                    const dateA = a.settlement_date || a.created_at;
                    const dateB = b.settlement_date || b.created_at;
                    return new Date(dateB) - new Date(dateA);
                  })
                  .map((s) => {
                    const isOwes = s.from_user === user.user_id;
                    return (
                      <li
                        key={s.settlement_id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                        style={{
                          color: isOwes ? "#dc3545" : "#185a9d",
                          background: isOwes
                            ? "linear-gradient(90deg, #fdecea, #fce3e1)"
                            : "linear-gradient(90deg, #e3eaf5, #c7d8f4)",
                          borderRadius: "8px",
                          marginBottom: "8px",
                          fontFamily: 'Poppins, Segoe UI, Arial, sans-serif',
                        }}
                      >
                        <span>
                          {isOwes
                            ? `You owe ${s.to_user_name}`
                            : `${s.from_user_name} owes you`} {currencySymbols[s.currency] || s.currency}{s.amount} in <strong>{s.group_name}</strong>
                        </span>
                      </li>
                    );
                  })}
              </ul>
            )}
          </div>
        </div>
      </div>
      <Outlet />
      <UserFooter />
    </>
  );
}
