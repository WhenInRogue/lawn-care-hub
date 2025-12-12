import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import ApiService from "../services/ApiService";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Wrench, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface EquipmentTransaction {
  equipmentTransactionId: number;
  equipmentTransactionType: string;
  note: string;
  totalHoursInput: number;
  hoursLogged: number;
  timestamp: string;
  equipment: {
    name: string;
    totalHours: number;
    equipmentStatus: string;
    lastCheckOutTime: string;
    description: string;
  };
  user: {
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
  };
}

const EquipmentTransactionDetailsPage = () => {
  const { equipmentTransactionId } = useParams();
  const [equipmentTransaction, setEquipmentTransaction] = useState<EquipmentTransaction | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getEquipmentTransaction = async () => {
      try {
        const equipmentTransactionData = await ApiService.getEquipmentTransactionById(equipmentTransactionId);
        if (equipmentTransactionData.status === 200) {
          setEquipmentTransaction(equipmentTransactionData.equipmentTransaction);
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
          "Failed to fetch equipment transaction details"
        );
      } finally {
        setLoading(false);
      }
    };

    getEquipmentTransaction();
  }, [equipmentTransactionId]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/equipmentTransactions")}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Equipment Transaction Details</h1>
        </div>

        {equipmentTransaction && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Transaction Information */}
            <Card className="glass-effect border-border/50 shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  Transaction Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Type</span>
                  <Badge variant={equipmentTransaction.equipmentTransactionType === "CHECK_OUT" ? "default" : "secondary"}>
                    {equipmentTransaction.equipmentTransactionType}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Hours</span>
                  <span className="font-medium">{equipmentTransaction.totalHoursInput}</span>
                </div>
                {equipmentTransaction.equipmentTransactionType === "CHECK_IN" && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hours Logged</span>
                    <span className="font-medium">{equipmentTransaction.hoursLogged ?? 0}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timestamp</span>
                  <span className="font-medium text-sm">{new Date(equipmentTransaction.timestamp).toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-border/50">
                  <span className="text-muted-foreground text-sm">Note</span>
                  <p className="mt-1 text-foreground">{equipmentTransaction.note || "No note provided"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Equipment Information */}
            <Card className="glass-effect border-border/50 shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wrench className="h-5 w-5 text-primary" />
                  Equipment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {equipmentTransaction.equipment ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name</span>
                      <span className="font-medium">{equipmentTransaction.equipment.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant={equipmentTransaction.equipment.equipmentStatus === "AVAILABLE" ? "default" : "secondary"}>
                        {equipmentTransaction.equipment.equipmentStatus}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Hours</span>
                      <span className="font-medium">{equipmentTransaction.equipment.totalHours ?? "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Check-out</span>
                      <span className="font-medium text-sm">
                        {equipmentTransaction.equipment.lastCheckOutTime 
                          ? new Date(equipmentTransaction.equipment.lastCheckOutTime).toLocaleString()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-border/50">
                      <span className="text-muted-foreground text-sm">Description</span>
                      <p className="mt-1 text-foreground">{equipmentTransaction.equipment.description || "No description"}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-4">Equipment information not available</p>
                )}
              </CardContent>
            </Card>

            {/* User Information */}
            <Card className="glass-effect border-border/50 shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{equipmentTransaction.user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium text-sm">{equipmentTransaction.user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">{equipmentTransaction.user.phoneNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Role</span>
                  <Badge variant="outline">{equipmentTransaction.user.role}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EquipmentTransactionDetailsPage;
