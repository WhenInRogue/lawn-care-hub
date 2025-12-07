import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ApiService from "@/services/ApiService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PaginationComponent from "@/components/common/PaginationComponent";

const EquipmentTransactionsPage = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [equipmentTransactionFilter, setEquipmentTransactionFilter] = useState("");
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
      const response = await ApiService.getAllEquipmentTransactions(valueToSearch || undefined);
      if (response.status === 200) {
        const records = response.equipmentTransactions || [];
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
    setValueToSearch(equipmentTransactionFilter);
  };

  const navigateToDetails = (equipmentTransactionId: string) => {
    navigate(`/equipmentTransactions/${equipmentTransactionId}`);
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
          <h1>Equipment Transactions</h1>
          <div className="flex gap-2">
            <Input
              placeholder="Search transaction..."
              value={equipmentTransactionFilter}
              onChange={(e) => {
                setEquipmentTransactionFilter(e.target.value);
                if (e.target.value === "") {
                  setCurrentPage(1);
                  setValueToSearch("");
                }
              }}
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
                <th>Total Hours</th>
                <th>Date</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.equipmentTransactionId}>
                  <td>{transaction.equipmentTransactionType}</td>
                  <td>{transaction.totalHoursInput}</td>
                  <td>{formatDate(transaction.timestamp)}</td>
                  <td>{transaction.note || "-"}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigateToDetails(transaction.equipmentTransactionId)}
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

export default EquipmentTransactionsPage;