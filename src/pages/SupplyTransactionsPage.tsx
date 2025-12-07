import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ApiService from "@/services/ApiService";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import PaginationComponent from "@/components/common/PaginationComponent";

const SupplyTransactionsPage = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    const filtered = transactions.filter((t) =>
      t.supply?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.transactionType?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [searchTerm, transactions]);

  const fetchTransactions = async () => {
    try {
      const response = await ApiService.getAllSupplyTransactions();
      if (response.status === 200) {
        setTransactions(response.supplyTransactions);
        setFilteredTransactions(response.supplyTransactions);
      }
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to load transactions", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
          <h1>Supply Usage</h1>
          <div className="flex gap-4">
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Supply Name</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/supplyTransactions/${transaction.id}`)}
                >
                  <td>{transaction.supply?.name || "N/A"}</td>
                  <td>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      transaction.transactionType === "CHECK_IN" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      {transaction.transactionType === "CHECK_IN" ? "Check In" : "Check Out"}
                    </span>
                  </td>
                  <td>{transaction.quantity}</td>
                  <td>{formatDate(transaction.createdAt)}</td>
                  <td>{transaction.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        )}

        {filteredTransactions.length > itemsPerPage && (
          <PaginationComponent
            currentPage={currentPage}
            totalPages={Math.ceil(filteredTransactions.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </Layout>
  );
};

export default SupplyTransactionsPage;
