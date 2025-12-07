import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ApiService from "@/services/ApiService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PaginationComponent from "@/components/common/PaginationComponent";

const SupplyPage = () => {
  const [supplies, setSupplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchSupplies();
  }, []);

  const fetchSupplies = async () => {
    try {
      const response = await ApiService.getAllSupplies();
      if (response.status === 200) {
        setSupplies(response.supplies);
      }
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to load supplies", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this supply?")) return;
    try {
      await ApiService.deleteSupply(id);
      toast({ title: "Success", description: "Supply deleted successfully" });
      fetchSupplies();
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to delete supply", variant: "destructive" });
    }
  };

  const paginatedSupplies = supplies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading supplies...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="page-header">
          <h1>Supplies</h1>
          <Button onClick={() => navigate("/supply/add")} className="btn-primary">
            <Plus className="w-4 h-4" />
            Add Supply
          </Button>
        </div>

        <div className="cards-grid">
          {paginatedSupplies.map((supply) => (
            <Card key={supply.supplyId} className="item-card">
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold text-foreground mb-2">{supply.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">Unit Type: {supply.unitOfMeasurement}</p>
                <p className="text-sm text-muted-foreground mb-1">Current Stock: {supply.currentStock}</p>
                <p className="text-sm text-muted-foreground mb-1">Reorder Level: {supply.reorderLevel}</p>
                <p className="text-sm text-muted-foreground mb-4">Max Quantity: {supply.maximumQuantity}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/supply/edit/${supply.supplyId}`)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(supply.supplyId)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {supplies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No supplies found</p>
          </div>
        )}

        {supplies.length > itemsPerPage && (
          <PaginationComponent
            currentPage={currentPage}
            totalPages={Math.ceil(supplies.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </Layout>
  );
};

export default SupplyPage;
