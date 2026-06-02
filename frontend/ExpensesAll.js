// ExpensesAll.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

export default function ExpensesAll() {
  // Delete expense logic
  async function handleDeleteExpense(expenseId, expenseAmount) {
    if (!window.confirm("Are you sure you want to delete this expense? This will update all balances and settlements.")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/expenses/${expenseId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete expense");

      setSuccess("✅ Expense deleted successfully!");
      const [expenseData, settData] = await Promise.all([
        fetch(`http://localhost:4000/api/expenses?group_id=${groupId}`).then((r) => r.json()),
        fetch(`http://localhost:4000/api/groups/${groupId}/settlements`).then((r) => r.json()),
      ]);
      setGroupExpenses(expenseData);
      setSettlements(settData);
      window.dispatchEvent(new Event("paymentCompleted"));
    } catch (err) {
      alert("❌ Error deleting expense");
    }
  }
  const { groupId } = useParams();
  const user = JSON.parse(sessionStorage.getItem("loggedInUser") || "null");
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState("");
  const [success, setSuccess] = useState("");
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [splitResult, setSplitResult] = useState([]);
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [paidBy, setPaidBy] = useState("");
  const [groupCurrency, setGroupCurrency] = useState("INR"); // Add this line

  const currencySymbols = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    // Add more as needed
  };

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch group info to get currency
        const groupRes = await fetch(`http://localhost:4000/api/groups/user/${user.user_id}`);
        const groupList = await groupRes.json();
        const group = groupList.find(g => String(g.group_id) === String(groupId));
        setGroupCurrency(group?.currency || "INR");
        setGroupName(group?.group_name ? `${group.group_name}` : `Group ${groupId}`);

        const memberRes = await fetch(
          `http://localhost:4000/api/groups/${groupId}/all-members`
        );
        const memberData = await memberRes.json();
        setMembers(memberData);

        const expenseRes = await fetch(
          `http://localhost:4000/api/expenses?group_id=${groupId}`
        );
        const expenseData = await expenseRes.json();

        const splitsRes = await fetch(`http://localhost:4000/api/expense_splits`);
        const splitsData = await splitsRes.json();

        const expensesWithSplits = expenseData.map(exp => {
          let splits = splitsData.filter(s => s.expense_id === exp.expense_id);
          if ((!splits || splits.length === 0) && exp.split_between && Array.isArray(exp.split_between) && exp.split_between.length > 0) {
            const perHead = exp.amount && exp.split_between ? Math.round(exp.amount / exp.split_between.length) : null;
            splits = exp.split_between.map(uid => ({
              user_id: uid,
              share_amount: perHead
            }));
          }
          if ((!splits || splits.length === 0) && memberData.length > 0) {
            const perHead = exp.amount && memberData.length > 0 ? Math.round(exp.amount / memberData.length) : null;
            splits = memberData.map(m => ({
              user_id: m.user_id,
              share_amount: perHead
            }));
          }
          return { ...exp, splits };
        });
        setGroupExpenses(expensesWithSplits);

        const settRes = await fetch(
          `http://localhost:4000/api/groups/${groupId}/settlements`
        );
        const settData = await settRes.json();

        const mergedSettlements = {};
        settData.forEach((s) => {
          if (s.status !== "pending" || s.from_user === s.to_user) return;
          const key = `${s.from_user}_${s.to_user}`;
          if (!mergedSettlements[key]) {
            mergedSettlements[key] = {
              ...s,
              amount: s.amount,
              status: s.status,
            };
          } else {
            mergedSettlements[key].amount += s.amount;
          }
        });
        setSettlements(Object.values(mergedSettlements));

      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [groupId, user.user_id]);

  function handleCheckbox(uid) {
    setSelectedMembers((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  }

  async function handleAddExpense() {
    if (!amount || !description || selectedMembers.length === 0 || !paidBy) {
      alert("Please fill all fields, select members and who paid.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          group_id: groupId,
          paid_by: paidBy,
          description,
          category: "general",
          amount: parseFloat(amount),
          currency: groupCurrency, // ✅ Use the group's currency
          split_between: selectedMembers,
        }),
      });

      if (!res.ok) throw new Error("Failed to add expense");
      const data = await res.json();

      setAmount("");
      setDescription("");
      setSelectedMembers([]);
      setPaidBy("");
      setSuccess("✅ Expense added successfully!");

      const [expenseData, settData] = await Promise.all([
        fetch(`http://localhost:4000/api/expenses?group_id=${groupId}`).then(
          (r) => r.json()
        ),
        fetch(
          `http://localhost:4000/api/groups/${groupId}/settlements`
        ).then((r) => r.json()),
      ]);

      const splitsRes = await fetch(`http://localhost:4000/api/expense_splits`);
      const splitsData = await splitsRes.json();
      const expensesWithSplits = expenseData.map(exp => {
        let splits = splitsData.filter(s => s.expense_id === exp.expense_id);
        if ((!splits || splits.length === 0) && exp.split_between && Array.isArray(exp.split_between) && exp.split_between.length > 0) {
          const perHead = exp.amount && exp.split_between ? Math.round(exp.amount / exp.split_between.length) : null;
          splits = exp.split_between.map(uid => ({
            user_id: uid,
            share_amount: perHead
          }));
        }
        if ((!splits || splits.length === 0) && members.length > 0) {
          const perHead = exp.amount && members.length > 0 ? Math.round(exp.amount / members.length) : null;
          splits = members.map(m => ({
            user_id: m.user_id,
            share_amount: perHead
          }));
        }
        return { ...exp, splits };
      });
      setGroupExpenses(expensesWithSplits);

      const mergedSettlements = {};
      settData.forEach((s) => {
        if (s.status !== "pending" || s.from_user === s.to_user) return;
        const key = `${s.from_user}_${s.to_user}`;
        if (!mergedSettlements[key]) {
          mergedSettlements[key] = {
            ...s,
            amount: s.amount,
            status: s.status,
          };
        } else {
          mergedSettlements[key].amount += s.amount;
        }
      });
      setSettlements(Object.values(mergedSettlements));

      const perHead = data.per_head;
      const result = data.split_between.map((uid) => ({
        user: members.find((m) => m.user_id === uid)?.name,
        shouldPay: perHead,
        status: uid === data.paid_by ? "lent" : "owe",
      }));
      setSplitResult(result);

      window.dispatchEvent(new Event("paymentCompleted"));
    } catch (err) {
      console.error(err);
      alert("Error adding expense");
    }
  }

  async function handleGenerateSettlement() {
    try {
      const res = await fetch(
        `http://localhost:4000/api/groups/${groupId}/generate-settlement`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );

      if (!res.ok) throw new Error("Failed to generate settlement");

      const settRes = await fetch(
        `http://localhost:4000/api/groups/${groupId}/settlements`
      );
      const settData = await settRes.json();

      const mergedSettlements = {};
      settData.forEach((s) => {
        if (s.status !== "pending" || s.from_user === s.to_user) return;
        const key = `${s.from_user}_${s.to_user}`;
        if (!mergedSettlements[key]) {
          mergedSettlements[key] = {
            ...s,
            amount: s.amount,
            status: s.status,
          };
        } else {
          mergedSettlements[key].amount += s.amount;
        }
      });
      setSettlements(Object.values(mergedSettlements));

      alert("✅ Final Settlement generated!");

      window.dispatchEvent(new Event("paymentCompleted"));
    } catch (err) {
      console.error(err);
      alert("❌ Error generating settlement");
    }
  }

  if (loading) return <p className="p-3">Loading...</p>;

  return (
    <>
      <UserHeader />
      <style>
        {`
        body, .bg-light {
          background: linear-gradient(135deg, #e3eafc 0%, #f8fafc 100%);
        }
        .card {
          border-radius: 18px !important;
          box-shadow: 0 6px 32px rgba(24,90,157,0.10), 0 1.5px 6px rgba(24,90,157,0.06);
        }
        .btn-primary, .btn-danger, .btn {
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(24,90,157,0.06);
        }
        .btn-primary:hover, .btn-danger:hover, .btn:hover {
          filter: brightness(0.95);
        }
        .list-group-item {
          border-radius: 10px !important;
          margin-bottom: 10px;
          transition: background 0.15s;
        }
        .list-group-item:hover {
          background: #e3eaf5;
        }
        .badge-status {
          font-size: 0.85em;
          padding: 4px 10px;
          border-radius: 8px;
          margin-left: 8px;
        }
        .badge-status.pending {
          background: #ffe082;
          color: #7c5700;
        }
        .badge-status.paid {
          background: #c8e6c9;
          color: #256029;
        }
        `}
      </style>
      <div
        className="bg-light"
        style={{
          minHeight: "100vh",
          fontFamily: "Poppins, Segoe UI, Arial, sans-serif",
          padding: "40px 0",
          background: "linear-gradient(135deg, #e3eafc 0%, #f8fafc 100%)"
        }}
      >
        <div className="container">
          <h2 className="mb-4 text-center fw-bold" style={{ color: "#185a9d", fontSize: "2.2rem", letterSpacing: "1px" }}>
            💰 {groupName} - Expenses
          </h2>
          <div className="row g-4 justify-content-center align-items-stretch" style={{ minHeight: "600px" }}>
            {/* Left: Add Expense */}
            <div className="col-12 col-md-5 d-flex">
              <div
                className="card shadow-lg p-4 flex-fill d-flex flex-column"
                style={{ borderRadius: "18px", border: "none", minHeight: "600px", background: "#fff" }}
              >
                <h5 className="mb-3 fw-semibold" style={{ color: "#185a9d", fontSize: "1.3rem" }}>➕ Add Expense</h5>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <input
                  type="number"
                  className="form-control mb-3"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div className="mb-3">
                  <strong>Paid By:</strong>
                  <select
                    className="form-select"
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                  >
                    <option value="">-- Select Payer --</option>
                    {members.map((m) => (
                      <option key={m.user_id} value={m.user_id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <strong>Split Between:</strong>
                  <div
                    className="custom-scrollbar"
                    style={{
                      maxHeight: '180px',
                      overflowY: 'auto',
                      padding: '8px 0',
                      marginTop: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <ul style={{ paddingLeft: 0, listStyle: 'none', marginBottom: 0 }}>
                      {members.map((m) => (
                        <li
                          key={m.user_id}
                          style={{
                            marginBottom: '8px',
                            fontSize: '15px',
                            borderRadius: '10px',
                            padding: '10px 18px',
                            cursor: 'pointer',
                            width: '100%',
                            boxSizing: 'border-box',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: '#fff',
                            border: '1px solid #e3eaf5',
                            boxShadow: '0 2px 8px rgba(24,90,157,0.06)',
                          }}
                          onMouseOver={e => {
                            e.currentTarget.style.background = '#185a9d';
                            e.currentTarget.style.color = '#fff';
                            Array.from(e.currentTarget.getElementsByTagName('span')).forEach(el => el.style.color = '#fff');
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.background = '#fff';
                            e.currentTarget.style.color = '';
                            Array.from(e.currentTarget.getElementsByTagName('span')).forEach(el => el.style.color = '#185a9d');
                          }}
                        >
                          <label style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 0, width: '100%'}}>
                            <input
                              type="checkbox"
                              checked={selectedMembers.includes(m.user_id)}
                              onChange={() => handleCheckbox(m.user_id)}
                              style={{ marginRight: '8px' }}
                            />
                            {m.name}
                            {m.is_admin && (
                              <span
                                style={{
                                  marginLeft: '8px',
                                  padding: '2px 6px',
                                  background: '#185a9d',
                                  color: 'white',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                }}
                              >
                                (Admin)
                              </span>
                            )}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button
                  className="btn w-100 fw-semibold"
                  style={{
                    backgroundColor: '#185a9d',
                    color: '#fff',
                    border: 'none',
                    fontSize: "1.1rem",
                    marginTop: "10px"
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.backgroundColor = '#1565c0';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.backgroundColor = '#185a9d';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onClick={handleAddExpense}
                  title="Add a new expense"
                >
                  ➕ Add Expense
                </button>
              </div>
            </div>
            {/* Right: Expenses List */}
            <div className="col-12 col-md-7 d-flex">
              <div
                className="card shadow-lg p-4 flex-fill d-flex flex-column"
                style={{
                  borderRadius: "18px",
                  border: "none",
                  minHeight: "600px",
                  maxHeight: "600px",
                  overflow: "hidden",
                  background: "#fff"
                }}
              >
                <h5 className="fw-bold mb-3" style={{ fontSize: "1.2rem" }}>📋 Expenses</h5>
                {/* Success and Split Details moved here */}
                {success && <div className="alert alert-success mb-3">{success}</div>}
                {splitResult.length > 0 && (
                  <div className="alert alert-info mb-4">
                    <h6 className="fw-bold">💸 Split Details:</h6>
                    <ul>
                      {splitResult.map((s, idx) => (
                        <li key={idx}>
                          {s.user} {s.status === "owe" ? "has to pay" : "gets back"} {currencySymbols[groupCurrency] || groupCurrency}{Math.round(s.shouldPay)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
                  {groupExpenses.length === 0 ? (
                    <p>No expenses yet.</p>
                  ) : (
                    <ul className="list-group">
                      {groupExpenses.map((exp) => (
                        <li key={exp.expense_id} className="list-group-item d-flex justify-content-between align-items-start" style={{ border: "none" }}>
                          <div style={{ flex: 1 }}>
                            <strong style={{ color: "#185a9d" }}>
                              {members.find((m) => m.user_id === exp.paid_by)?.name}
                            </strong>{" "}
                            paid <span style={{ color: "#1565c0", fontWeight: 600 }}>
  {currencySymbols[exp.currency] || exp.currency}{exp.amount}
</span> for <strong>{exp.description}</strong> (
                            {new Date(exp.created_at).toLocaleDateString()})<br />
                            <span style={{ fontSize: '14px', color: '#185a9d' }}>
                              <strong>Split between:</strong>
                              <ul style={{ margin: '6px 0 0 0', padding: 0, listStyle: 'none' }}>
                                {exp.splits && exp.splits.length > 0 ? (
                                  exp.splits.map(split => {
                                    const member = members.find(m => m.user_id === split.user_id);
                                    return member ? (
                                      <li key={member.user_id} style={{ marginBottom: 2 }}>
                                        {member.name} <span style={{ color: '#333', fontWeight: 500 }}>
                                          {currencySymbols[exp.currency] || exp.currency}{Math.round(split.share_amount)}
                                        </span>
                                      </li>
                                    ) : null;
                                  })
                                ) : (
                                  exp.split_between && Array.isArray(exp.split_between) && exp.split_between.length > 0 ? (
                                    exp.split_between.map(uid => {
                                      const member = members.find(m => m.user_id === uid);
                                      const share = exp.amount && exp.split_between ? Math.round(exp.amount / exp.split_between.length) : null;
                                      return member ? (
                                        <li key={member.user_id} style={{ marginBottom: 2 }}>
                                          {member.name} <span style={{ color: '#333', fontWeight: 500 }}>{currencySymbols[groupCurrency] || groupCurrency}{share}</span>
                                        </li>
                                      ) : null;
                                    })
                                  ) : <li style={{ color: '#c00' }}>No split data available</li>
                                )}
                              </ul>
                            </span>
                          </div>
                          <button
                            className="btn btn-sm btn-danger ms-3"
                            style={{ fontWeight: 600 }}
                            onClick={() => handleDeleteExpense(exp.expense_id, exp.amount)}
                            title="Delete this expense"
                          >
                            🗑️
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Bottom Center Card for Generate Final Settlement & Settlements */}
          <div className="row justify-content-center mt-4">
            <div className="col-12">
              <div
                className="card shadow-lg p-4 mx-auto text-center"
                style={{
                  borderRadius: "18px",
                  border: "none",
                  background: "#f8fafc",
                  maxWidth: "1300px",
                }}
              >
                <button
                  className="btn fw-semibold mb-3"
                  style={{
                    backgroundColor: '#185a9d',
                    color: '#fff',
                    border: 'none',
                    fontSize: "1.1rem"
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.backgroundColor = '#1565c0';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.backgroundColor = '#185a9d';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onClick={handleGenerateSettlement}
                  title="Generate final settlement for this group"
                >
                  Generate Final Settlement
                </button>
                <h5 className="fw-bold mb-3 mt-4" style={{ color: "#185a9d" }}>Final Settlements</h5>
                <div style={{ maxHeight: "220px", overflowY: "auto" }}>
                  <ul className="list-group">
                    {settlements.length === 0 ? (
                      <li className="list-group-item alert alert-success m-0" style={{ border: "none" }}>
                        ✅ All settlements are paid!
                      </li>
                    ) : (
                      settlements.map((s) => (
                        <li
                          key={s.settlement_id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                          style={{ border: "none" }}
                        >
                          <span>
                            {s.from_user_name} pays <span style={{ color: "#1565c0", fontWeight: 600 }}>
                              {currencySymbols[groupCurrency] || groupCurrency}{s.amount}
                            </span> to {s.to_user_name}
                            <span className={`badge-status ${s.status}`}>{s.status}</span>
                          </span>
                          {s.from_user === user.user_id && s.status === "pending" && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => {
                                navigate("/settle-up", {
                                  state: {
                                    settlement: {
                                      settlement_id: s.settlement_id,
                                      from_user: s.from_user,
                                      from_user_name: s.from_user_name,
                                      to_user: s.to_user,
                                      to_user_name: s.to_user_name,
                                      amount: s.amount,
                                      group_id: s.group_id,
                                    },
                                  },
                                });
                              }}
                              title="Pay this settlement"
                            >
                              Pay
                            </button>
                          )}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UserFooter />
    </>
  );
}

