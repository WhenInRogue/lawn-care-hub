import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ApiService from "@/services/ApiService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PaginationComponent from "@/components/common/PaginationComponent";

const SupplyTransactionsPage = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [valueToSearch, setValueToSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, valueToSearch]);

  const fetchTransactions = async () => {
    try {
      const response = await ApiService.getAllSupplyTransactions(valueToSearch || undefined);
      if (response.status === 200) {
        const records = response.supplyTransactions || [];
        setTotalPages(Math.ceil(records.length / itemsPerPage));
        setTransactions(
          records.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
          )
        );
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to load transactions", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setValueToSearch(filter);
  };

  const navigateToDetails = (supplyTransactionId: string) => {
    navigate(`/supplyTransactions/${supplyTransactionId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="page-header">
          <h1>Supply Transactions</h1>
          <div className="flex gap-2">
            <Input
              placeholder="Search transaction..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-64"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.supplyTransactionId}>
                  <td>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      transaction.supplyTransactionType === "CHECK_IN" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      {transaction.supplyTransactionType === "CHECK_IN" ? "Check In" : "Check Out"}
                    </span>
                  </td>
                  <td>{transaction.quantity}</td>
                  <td>{formatDate(transaction.createdAt)}</td>
                  <td>{transaction.note || "-"}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigateToDetails(transaction.supplyTransactionId)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {transactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        )}

        {totalPages > 1 && (
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </Layout>
  );
};

export default SupplyTransactionsPage;