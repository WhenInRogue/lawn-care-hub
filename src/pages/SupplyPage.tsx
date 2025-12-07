import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ApiService from "@/services/ApiService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Edit, Trash2, Package, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PaginationComponent from "@/components/common/PaginationComponent";
import { Badge } from "@/components/ui/badge";

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
          {paginatedSupplies.map((supply) => {
            const isLowStock = supply.currentStock <= supply.reorderLevel;
            const stockPercentage = (supply.currentStock / supply.maximumQuantity) * 100;
            
            return (
              <Card 
                key={supply.supplyId} 
                className={`item-card overflow-hidden ${isLowStock ? "ring-2 ring-destructive" : ""}`}
              >
                <CardContent className="p-0">
                  {/* Header with name and stock status */}
                  <div className="p-4 pb-3 border-b border-border">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold text-foreground leading-tight">{supply.name}</h3>
                      <Badge 
                        variant={isLowStock ? "destructive" : "default"}
                        className={!isLowStock ? "bg-accent text-accent-foreground" : ""}
                      >
                        {isLowStock ? "Low Stock" : "In Stock"}
                      </Badge>
                    </div>
                    {isLowStock && (
                      <div className="flex items-center gap-1.5 mt-2 text-destructive text-sm font-medium">
                        <AlertTriangle className="w-4 h-4" />
                        Below reorder level
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-muted-foreground text-xs">Current Stock</p>
                          <p className="font-medium text-foreground">{supply.currentStock} {supply.unitOfMeasurement}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground text-xs">Max Capacity</p>
                          <p className="font-medium text-foreground">{supply.maximumQuantity} {supply.unitOfMeasurement}</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="pt-2 border-t border-border/50">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                        <span>Stock Level</span>
                        <span>{Math.round(stockPercentage)}%</span>
                      </div>
                      <Progress 
                        value={stockPercentage} 
                        className={`h-2 ${isLowStock ? '[&>div]:bg-destructive' : ''}`}
                      />
                      <div className="flex items-center justify-between text-xs mt-1.5">
                        <span className="text-muted-foreground">Reorder at: {supply.reorderLevel}</span>
                        <span className="font-medium text-foreground">{supply.currentStock}/{supply.maximumQuantity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 p-4 pt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/supply/edit/${supply.supplyId}`)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDelete(supply.supplyId)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
