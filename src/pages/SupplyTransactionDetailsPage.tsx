import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ApiService from "@/services/ApiService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SupplyTransactionDetailsPage = () => {
  const { supplyTransactionId } = useParams();
  const [supplyTransaction, setSupplyTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await ApiService.getSupplyTransactionById(supplyTransactionId!);
        if (response.status === 200) {
          setSupplyTransaction(response.supplyTransaction);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to fetch supply transaction details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [supplyTransactionId]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading transaction details...</p>
        </div>
      </Layout>
    );
  }

  if (!supplyTransaction) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Transaction not found</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/supplyTransactions")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Transactions
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="page-header">
          <h1>Transaction Details</h1>
          <Button variant="outline" onClick={() => navigate("/supplyTransactions")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Transaction Information */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Transaction Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium">{supplyTransaction.supplyTransactionType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Note</p>
                <p className="font-medium">{supplyTransaction.note || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Quantity</p>
                <p className="font-medium">{supplyTransaction.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium">{new Date(supplyTransaction.createdAt).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Supply Information */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Supply Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{supplyTransaction.supply?.name || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unit of Measurement</p>
                <p className="font-medium">{supplyTransaction.supply?.unitOfMeasurement || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Stock</p>
                <p className="font-medium">{supplyTransaction.supply?.currentStock || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reorder Level</p>
                <p className="font-medium">{supplyTransaction.supply?.reorderLevel || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Maximum Quantity</p>
                <p className="font-medium">{supplyTransaction.supply?.maximumQuantity || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{supplyTransaction.supply?.description || "-"}</p>
              </div>
            </CardContent>
          </Card>

          {/* User Information */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{supplyTransaction.user?.name || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{supplyTransaction.user?.email || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium">{supplyTransaction.user?.phoneNumber || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium">{supplyTransaction.user?.role || "-"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SupplyTransactionDetailsPage;