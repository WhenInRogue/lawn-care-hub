import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ApiService from "@/services/ApiService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const CheckInSupplyPage = () => {
  const [supplies, setSupplies] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    supplyId: "",
    quantity: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchSupplies();
  }, []);

  const fetchSupplies = async () => {
    try {
      const response = await ApiService.getAllSupplies();
      if (response.status === 200) {
        setSupplies(response.supplies || []);
      }
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to load supplies", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.supplyId || !formData.quantity) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const data = {
        supplyId: formData.supplyId,
        quantity: Number(formData.quantity),
        notes: formData.notes,
      };
      await ApiService.checkInSupply(data);
      toast({ title: "Success", description: "Supply checked in successfully" });
      navigate("/supplyTransactions");
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Check-in failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="form-container animate-fade-in">
        <div className="button-group mb-6">
          <Button onClick={() => navigate("/checkInSupply")} className="btn-primary">
            Check-In Supply
          </Button>
          <Button variant="outline" onClick={() => navigate("/checkOutSupply")}>
            Check-Out Supply
          </Button>
          <Button variant="outline" onClick={() => navigate("/checkInEquipment")}>
            Check-In Equipment
          </Button>
          <Button variant="outline" onClick={() => navigate("/checkOutEquipment")}>
            Check-Out Equipment
          </Button>
        </div>

        <h1>Check-In Supply</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Supply</label>
            <Select value={formData.supplyId} onValueChange={(v) => setFormData({ ...formData, supplyId: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a supply" />
              </SelectTrigger>
              <SelectContent>
                {supplies.map((supply) => (
                  <SelectItem key={supply.supplyId} value={supply.supplyId}>
                    {supply.name} (Current: {supply.currentStock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <Input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="Enter quantity"
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>Notes (Optional)</label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes"
              rows={3}
            />
          </div>
          <Button type="submit" className="w-full btn-primary" disabled={loading}>
            {loading ? "Processing..." : "Check In Supply"}
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default CheckInSupplyPage;