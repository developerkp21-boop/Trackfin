import React, { useMemo, useState, useEffect } from "react";
import {
  ArrowLeftRight,
  Plus,
  Wallet,
  Landmark,
  CreditCard,
  PiggyBank,
  Banknote,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { apiRequest, PAYMENT_METHODS_ENDPOINT } from "../../services/api";
import { toast } from "react-hot-toast";
import "./Accounts.css";

const accountTypes = ["Bank", "Cash", "Card", "Savings", "UPI", "Other"];

const accountIcons = {
  Bank: Landmark,
  Cash: Wallet,
  Card: CreditCard,
  Savings: PiggyBank,
  UPI: Wallet,
  Other: Banknote,
};

const accountColors = {
  Bank: "#3b82f6",
  Cash: "#10b981",
  Card: "#ef4444",
  Savings: "#f59e0b",
  UPI: "#8b5cf6",
  Other: "#64748b",
};

const initialForm = { name: "", type: "Bank", color: "#3b82f6", balance: "" };

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [transfer, setTransfer] = useState({ from: "", to: "", amount: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const data = await apiRequest(PAYMENT_METHODS_ENDPOINT);
      setAccounts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const totalBalance = useMemo(
    () => accounts.reduce((sum, a) => sum + Number(a.balance || 0), 0),
    [accounts],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return;

    try {
      setIsSubmitting(true);
      const payload = {
        ...form,
        balance: Number(form.balance || 0),
        color: form.color || accountColors[form.type] || "#64748b",
      };

      if (editingId) {
        await apiRequest(`${PAYMENT_METHODS_ENDPOINT}/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Account updated successfully");
      } else {
        await apiRequest(PAYMENT_METHODS_ENDPOINT, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Account added successfully");
      }

      setForm(initialForm);
      setEditingId(null);
      setShowAccountModal(false);
      fetchAccounts();
    } catch (error) {
      toast.error(error.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (account) => {
    setForm({
      name: account.name,
      type: account.type,
      color: account.color || accountColors[account.type],
      balance: account.balance,
    });
    setEditingId(account.id);
    setShowAccountModal(true);
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    const amount = Number(transfer.amount);
    if (
      !transfer.from ||
      !transfer.to ||
      amount <= 0 ||
      transfer.from === transfer.to
    ) {
      toast.error("Invalid transfer details");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest(`${PAYMENT_METHODS_ENDPOINT}/transfer`, {
        method: "POST",
        body: JSON.stringify({
          from_id: transfer.from,
          to_id: transfer.to,
          amount: amount,
        }),
      });

      toast.success(`Transferred $${amount} successfully!`);
      setTransfer({ from: "", to: "", amount: "" });
      setShowTransferModal(false);
      fetchAccounts();
    } catch (error) {
      toast.error(error.message || "Transfer failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!selectedAccount || !depositAmount || Number(depositAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest(
        `${PAYMENT_METHODS_ENDPOINT}/${selectedAccount.id}/deposit`,
        {
          method: "POST",
          body: JSON.stringify({ amount: Number(depositAmount) }),
        },
      );

      toast.success(`$${depositAmount} added to ${selectedAccount.name}`);
      setShowDepositModal(false);
      setDepositAmount("");
      setSelectedAccount(null);
      fetchAccounts();
    } catch (error) {
      toast.error(error.message || "Failed to add funds");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      await apiRequest(`${PAYMENT_METHODS_ENDPOINT}/${deleteTarget.id}`, {
        method: "DELETE",
      });
      toast.success("Account deleted successfully");
      setDeleteTarget(null);
      fetchAccounts();
    } catch (error) {
      toast.error(error.message || "Failed to delete account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-4 pb-5">
      <PageHeader
        title="Account Management"
        subtitle="Manage cash, bank, card, and savings ledgers in one place."
        actions={
          <div className="d-flex gap-2">
            <Button
              variant="outline"
              className="d-flex align-items-center gap-2"
              onClick={() => setShowTransferModal(true)}
            >
              <ArrowLeftRight size={16} /> Transfer
            </Button>
            <Button
              onClick={() => {
                setEditingId(null);
                setForm(initialForm);
                setShowAccountModal(true);
              }}
              className="d-flex align-items-center gap-2"
              style={{
                backgroundColor: "#a8df8e",
                border: "none",
                color: "#1a1a1a",
              }}
            >
              <Plus size={16} /> Add Account
            </Button>
          </div>
        }
      />

      {/* Account Cards */}
      <div className="row g-3 g-lg-4">
        {loading ? (
          <div className="col-12 py-5 text-center text-muted">
            <Loader2 className="animate-spin d-inline-block me-2" size={24} />
            Loading accounts...
          </div>
        ) : accounts.length === 0 ? (
          <div className="col-12 py-5 text-center text-muted border border-dashed rounded-3">
            No accounts found. Start by adding one below.
          </div>
        ) : (
          accounts.map((account) => {
            const Icon = accountIcons[account.type] || Wallet;
            const color =
              account.color || accountColors[account.type] || "#3b82f6";
            return (
              <div
                key={account.id}
                className="col-12 col-md-6 col-lg-3 account-card-container"
              >
                <Card className="p-0 overflow-hidden border-0 shadow-sm h-100 position-relative">
                  <div className="d-flex align-items-stretch h-100">
                    <div className="p-4 flex-grow-1 d-flex flex-column justify-content-between">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <div
                          className="rounded-3 d-flex align-items-center justify-content-center shadow-sm"
                          style={{
                            width: 44,
                            height: 44,
                            background: color + "15",
                          }}
                        >
                          <Icon size={20} style={{ color }} />
                        </div>
                      </div>
                      <div>
                        <h5 className="small fw-bold text-muted mb-1">
                          {account.name}
                        </h5>
                        <h3 className="h4 fw-bold mb-0" style={{ color }}>
                          ${Number(account.balance || 0).toLocaleString()}
                        </h3>
                      </div>
                    </div>
                    <div
                      style={{
                        width: "40%",
                        background: color,
                        borderRadius: "10px",
                      }}
                    />
                  </div>

                  {/* Hover Overlay with Buttons - INSIDE Card */}
                  <div className="account-card-overlay">
                    <button
                      onClick={() => startEdit(account)}
                      className="hover-action-btn btn-edit"
                      title="Edit Account"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAccount(account);
                        setDepositAmount("");
                        setShowDepositModal(true);
                      }}
                      className="hover-action-btn btn-add"
                      title="Add Money"
                    >
                      <Plus size={20} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(account)}
                      className="hover-action-btn btn-delete"
                      title="Delete Account"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </Card>
              </div>
            );
          })
        )}
      </div>

      {/* Total Balance */}
      <Card className="border-0 shadow-sm p-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="small fw-bold text-muted mb-1">
              Total Balance Across All Accounts
            </p>
            <h2 className="h4 fw-bold mb-0">
              ${totalBalance.toLocaleString()}
            </h2>
          </div>
          <div
            className="rounded-3 d-flex align-items-center justify-content-center shadow-sm"
            style={{ width: 56, height: 56, background: "#a8df8e" + "30" }}
          >
            <Wallet size={28} style={{ color: "rgb(128, 197, 112)" }} />
          </div>
        </div>
      </Card>

      {/* Account Form Modal */}
      {showAccountModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowAccountModal(false)}
        >
          <div
            className="modal-content-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="border-0 shadow-lg p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="h5 fw-bold mb-0">
                  {editingId ? "Edit Account" : "Add Account"}
                </h3>
                <button
                  className="btn btn-light rounded-circle p-1"
                  onClick={() => setShowAccountModal(false)}
                >
                  <Plus size={20} style={{ transform: "rotate(45deg)" }} />
                </button>
              </div>
              <form
                onSubmit={handleSubmit}
                className="d-flex flex-column gap-3"
              >
                <Input
                  label="Account Name"
                  placeholder="e.g. Primary Business Account"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <div className="row g-3">
                  <div className="col-6">
                    <Select
                      label="Account Type"
                      value={form.type}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          type: e.target.value,
                          color: accountColors[e.target.value] || "#64748b",
                        })
                      }
                    >
                      {accountTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted mb-1">
                      Color Label
                    </label>
                    <div className="d-flex gap-2 align-items-center">
                      <input
                        type="color"
                        className="form-control form-control-color p-0 border-0"
                        style={{
                          width: 44,
                          height: 38,
                          borderRadius: 8,
                          cursor: "pointer",
                        }}
                        value={form.color}
                        onChange={(e) =>
                          setForm({ ...form, color: e.target.value })
                        }
                      />
                      <span className="small text-muted font-monospace">
                        {form.color.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <Input
                  label="Balance ($)"
                  type="number"
                  placeholder="0"
                  value={form.balance}
                  onChange={(e) =>
                    setForm({ ...form, balance: e.target.value })
                  }
                  required
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-100 mt-2"
                  style={{
                    backgroundColor: "#a8df8e",
                    border: "none",
                    color: "#1a1a1a",
                  }}
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingId
                      ? "Update Changes"
                      : "Create Account"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowTransferModal(false)}
        >
          <div
            className="modal-content-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="border-0 shadow-lg p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="h5 fw-bold mb-0 d-flex align-items-center gap-2">
                  <ArrowLeftRight size={20} /> Transfer Between Accounts
                </h3>
                <button
                  className="btn btn-light rounded-circle p-1"
                  onClick={() => setShowTransferModal(false)}
                >
                  <Plus size={20} style={{ transform: "rotate(45deg)" }} />
                </button>
              </div>
              <form
                onSubmit={handleTransfer}
                className="d-flex flex-column gap-3"
              >
                <Select
                  label="From Account"
                  value={transfer.from}
                  onChange={(e) =>
                    setTransfer({ ...transfer, from: e.target.value })
                  }
                >
                  <option value="">Select account</option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} (${(acc.balance || 0).toLocaleString()})
                    </option>
                  ))}
                </Select>
                <Select
                  label="To Account"
                  value={transfer.to}
                  onChange={(e) =>
                    setTransfer({ ...transfer, to: e.target.value })
                  }
                >
                  <option value="">Select account</option>
                  {accounts
                    .filter((acc) => acc.id !== transfer.from)
                    .map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name}
                      </option>
                    ))}
                </Select>
                <Input
                  label="Amount ($)"
                  type="number"
                  placeholder="0"
                  value={transfer.amount}
                  onChange={(e) =>
                    setTransfer({ ...transfer, amount: e.target.value })
                  }
                />
                <Button
                  variant="outline"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-100 mt-2 d-flex align-items-center justify-content-center gap-2"
                >
                  <ArrowLeftRight size={16} />{" "}
                  {isSubmitting ? "Processing..." : "Execute Transfer"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      )}

      {/* Add Balance Modal */}
      {showDepositModal && selectedAccount && (
        <div
          className="modal-backdrop"
          onClick={() => setShowDepositModal(false)}
        >
          <div
            className="modal-content-wrapper"
            style={{ maxWidth: 400 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="border-0 shadow-lg p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="h5 fw-bold mb-0">Add Balance</h3>
                <button
                  className="btn btn-light rounded-circle p-1"
                  onClick={() => setShowDepositModal(false)}
                >
                  <Plus size={20} style={{ transform: "rotate(45deg)" }} />
                </button>
              </div>
              <div className="text-center mb-4">
                <div className="small fw-bold text-muted mb-1 text-uppercase">
                  Adding funds to
                </div>
                <div
                  className="h5 fw-bold"
                  style={{
                    color:
                      selectedAccount.color ||
                      accountColors[selectedAccount.type],
                  }}
                >
                  {selectedAccount.name}
                </div>
              </div>
              <form
                onSubmit={handleDeposit}
                className="d-flex flex-column gap-3"
              >
                <Input
                  label="Amount ($)"
                  type="number"
                  placeholder="Enter amount"
                  autoFocus
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-100 mt-2"
                  style={{
                    backgroundColor: "#a8df8e",
                    border: "none",
                    color: "#1a1a1a",
                  }}
                >
                  {isSubmitting
                    ? "Adding..."
                    : `Add $${depositAmount || "0"} to Balance`}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 z-3"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        >
          <Card
            className="border-0 shadow-lg p-4 text-center"
            style={{ maxWidth: 400 }}
          >
            <div className="bg-danger bg-opacity-10 text-danger rounded-circle p-3 d-inline-block mb-3">
              <Trash2 size={32} />
            </div>
            <h4 className="fw-bold mb-2">Delete Account?</h4>
            <p className="text-muted small mb-4">
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.name}</strong>? This action cannot be
              undone.
            </p>
            <div className="d-flex gap-2">
              <Button
                variant="outline"
                className="flex-grow-1"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                className="flex-grow-1"
                onClick={confirmDelete}
              >
                Delete Now
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Accounts;
