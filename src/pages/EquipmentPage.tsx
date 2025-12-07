import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ApiService from "@/services/ApiService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PaginationComponent from "@/components/common/PaginationComponent";

const EquipmentPage = () => {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await ApiService.getAllEquipment();
      if (response.status === 200) {
        setEquipment(response.equipment);
      }
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to load equipment", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this equipment?")) return;
    try {
      await ApiService.deleteEquipment(id);
      toast({ title: "Success", description: "Equipment deleted successfully" });
      fetchEquipment();
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to delete equipment", variant: "destructive" });
    }
  };

  const paginatedEquipment = equipment.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          <Button onClick={() => navigate("/equipment/add")} className="btn-primary">
            <Plus className="w-4 h-4" />
            Add Equipment
          </Button>
        </div>

        <div className="cards-grid">
          {paginatedEquipment.map((item) => (
            <Card key={item.id} className="item-card">
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">Serial: {item.serialNumber}</p>
                <p className="text-sm text-muted-foreground mb-1">Status: {item.status}</p>
                <p className="text-sm text-muted-foreground mb-4">Location: {item.location}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/equipment/edit/${item.id}`)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
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

        {equipment.length > itemsPerPage && (
          <PaginationComponent
            currentPage={currentPage}
            totalPages={Math.ceil(equipment.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </Layout>
  );
};

export default EquipmentPage;
