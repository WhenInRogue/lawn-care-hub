import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ApiService from "@/services/ApiService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PaginationComponent from "@/components/common/PaginationComponent";

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
              className={`item-card ${item.maintenanceDue ? "border-destructive border-2" : ""}`}
            >
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">Total Hours: {item.totalHours}</p>
                <p className="text-sm text-muted-foreground mb-1">Maintenance Interval: {item.maintenanceIntervalHours}</p>
                <p className="text-sm text-muted-foreground mb-1">Status: {item.equipmentStatus}</p>
                <p className="text-sm text-muted-foreground mb-1">
                  Maintenance Due: <span className={item.maintenanceDue ? "text-destructive font-semibold" : ""}>{item.maintenanceDue ? "Yes" : "No"}</span>
                </p>
                <p className="text-sm text-muted-foreground mb-1">Next Maintenance At: {item.nextMaintenanceDueHours}</p>
                <p className="text-sm text-muted-foreground mb-4">Last Checked Out By: {item.lastCheckedOutBy || "N/A"}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/equipment/edit/${item.equipmentId}`)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
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