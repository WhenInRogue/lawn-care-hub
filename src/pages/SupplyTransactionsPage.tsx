import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ApiService from "@/services/ApiService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PaginationComponent from "@/components/common/PaginationComponent";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ArrowDownCircle, ArrowUpCircle, FileText, Calendar, Package } from "lucide-react";

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
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getTransactionBadge = (type: string) => {
    const isCheckIn = type === "CHECK_IN";
    return (
      <Badge 
        variant="outline" 
        className={`flex items-center gap-1.5 font-medium ${
          isCheckIn 
            ? "bg-success/10 text-success border-success/30" 
            : "bg-warning/10 text-warning border-warning/30"
        }`}
      >
        {isCheckIn ? (
          <ArrowDownCircle className="h-3.5 w-3.5" />
        ) : (
          <ArrowUpCircle className="h-3.5 w-3.5" />
        )}
        {isCheckIn ? "Check In" : "Check Out"}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Loading transactions...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Supply Transactions</h1>
              <p className="text-sm text-muted-foreground">Track all supply check-ins and check-outs</p>
            </div>
          </div>
          
          {/* Search */}
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  if (e.target.value === "") {
                    setCurrentPage(1);
                    setValueToSearch("");
                  }
                }}
                className="pl-9 w-64"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </div>

        {/* Transactions Table */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">Quantity</TableHead>
                      <TableHead className="font-semibold">Date & Time</TableHead>
                      <TableHead className="font-semibold">Note</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => {
                      const { date, time } = formatDate(transaction.createdAt);
                      return (
                        <TableRow 
                          key={transaction.supplyTransactionId}
                          className="hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => navigateToDetails(transaction.supplyTransactionId)}
                        >
                          <TableCell>
                            {getTransactionBadge(transaction.supplyTransactionType)}
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-foreground">
                              {transaction.quantity}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{date}</span>
                                <span className="text-xs text-muted-foreground">{time}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-muted-foreground line-clamp-1 max-w-[200px]">
                              {transaction.note || "—"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="hover:bg-primary hover:text-primary-foreground transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigateToDetails(transaction.supplyTransactionId);
                              }}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">No transactions found</h3>
                <p className="text-sm text-muted-foreground">
                  {valueToSearch ? "Try adjusting your search terms" : "Supply transactions will appear here"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
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
