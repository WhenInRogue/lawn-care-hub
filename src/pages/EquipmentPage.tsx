import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ApiService from "@/services/ApiService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Clock, Wrench, User, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PaginationComponent from "@/components/common/PaginationComponent";
import { Badge } from "@/components/ui/badge";

const equipmentStatusOptions = ["AVAILABLE", "IN_USE", "MAINTENANCE"];

const EquipmentPage = () => {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [equipmentStatusFilter, setEquipmentStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchEquipment();
  }, [currentPage, equipmentStatusFilter]);

  const fetchEquipment = async () => {
    try {
      const response = await ApiService.getAllEquipment(equipmentStatusFilter || undefined);
      if (response.status === 200) {
        const records = response.equipments || [];
        setTotalPages(Math.ceil(records.length / itemsPerPage));
        setEquipment(
          records.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
          )
        );
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to load equipment", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (equipmentId: string) => {
    if (!window.confirm("Are you sure you want to delete this equipment?")) return;
    try {
      await ApiService.deleteEquipment(equipmentId);
      toast({ title: "Success", description: "Equipment deleted successfully" });
      fetchEquipment();
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to delete equipment", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading equipment...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="page-header">
          <h1>Equipment</h1>
          <div className="flex gap-4">
            <Select 
              value={equipmentStatusFilter} 
              onValueChange={(v) => {
                setEquipmentStatusFilter(v === "all" ? "" : v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {equipmentStatusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => navigate("/equipment/add")} className="btn-primary">
              <Plus className="w-4 h-4" />
              Add Equipment
            </Button>
          </div>
        </div>

        <div className="cards-grid">
          {equipment.map((item) => (
            <Card 
              key={item.equipmentId} 
              className={`item-card overflow-hidden ${item.maintenanceDue ? "ring-2 ring-destructive" : ""}`}
            >
              <CardContent className="p-0">
                {/* Header with name and status */}
                <div className="p-4 pb-3 border-b border-border">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold text-foreground leading-tight">{item.name}</h3>
                    <Badge 
                      variant={item.equipmentStatus === "AVAILABLE" ? "default" : item.equipmentStatus === "MAINTENANCE" ? "secondary" : "outline"}
                      className={item.equipmentStatus === "AVAILABLE" ? "bg-accent text-accent-foreground" : ""}
                    >
                      {item.equipmentStatus?.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className={`flex items-center gap-1.5 mt-2 text-sm font-medium ${item.maintenanceDue ? "text-destructive" : "text-accent"}`}>
                    <AlertTriangle className="w-4 h-4" />
                    Maintenance Due: {item.maintenanceDue ? "Yes" : "No"}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-muted-foreground text-xs">Total Hours</p>
                        <p className="font-medium text-foreground">{item.totalHours}h</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Wrench className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-muted-foreground text-xs">Maint. Interval</p>
                        <p className="font-medium text-foreground">{item.maintenanceIntervalHours}h</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-border/50 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Next Maintenance</span>
                      <span className="font-medium text-foreground">{item.nextMaintenanceDueHours}h</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Last Checked Out:</span>
                      <span className="font-medium text-foreground truncate">{item.lastCheckedOutBy || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 p-4 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/equipment/edit/${item.equipmentId}`)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDelete(item.equipmentId)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {equipment.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No equipment found</p>
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

export default EquipmentPage;