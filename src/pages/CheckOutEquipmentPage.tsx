import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ApiService from "@/services/ApiService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const CheckOutEquipmentPage = () => {
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    equipmentId: "",
    totalHoursInput: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await ApiService.getAllEquipment();
      if (response.status === 200) {
        // Only show available equipment for checkout
        setEquipmentList((response.equipments || []).filter((eq: any) => eq.equipmentStatus === "AVAILABLE"));
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load equipment", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.equipmentId) {
      toast({ title: "Error", description: "Please select equipment", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const response = await ApiService.checkOutEquipment({ 
        equipmentId: formData.equipmentId,
        totalHoursInput: parseFloat(formData.totalHoursInput) || 0,
        note: formData.note 
      });
      if (response.status === 200) {
        toast({ title: "Success", description: response.message || "Equipment checked out successfully" });
        navigate("/equipmentTransactions");
      } else {
        toast({ title: "Error", description: response.message || "Check-out failed", variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to check out equipment", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="form-container animate-fade-in">
        <div className="button-group mb-6 flex justify-center">
          <Button variant="outline" onClick={() => navigate("/checkInSupply")}>
            Check-In Supply
          </Button>
          <Button variant="outline" onClick={() => navigate("/checkOutSupply")}>
            Check-Out Supply
          </Button>
          <Button variant="outline" onClick={() => navigate("/checkInEquipment")}>
            Check-In Equipment
          </Button>
          <Button onClick={() => navigate("/checkOutEquipment")} className="btn-primary">
            Check-Out Equipment
          </Button>
        </div>

        <h1>Check-Out Equipment</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Equipment</label>
            <Select value={formData.equipmentId} onValueChange={(v) => setFormData({ ...formData, equipmentId: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Choose equipment" />
              </SelectTrigger>
              <SelectContent>
                {equipmentList.map((eq) => (
                  <SelectItem key={eq.equipmentId} value={String(eq.equipmentId)}>
                    {eq.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="form-group">
            <label>Total Hours</label>
            <Input
              type="number"
              step="0.5"
              value={formData.totalHoursInput}
              onChange={(e) => setFormData({ ...formData, totalHoursInput: e.target.value })}
              placeholder="Enter total hours"
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label>Note (Optional)</label>
            <Textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="Enter note"
              rows={3}
            />
          </div>
          <Button type="submit" className="w-full btn-primary" disabled={loading}>
            {loading ? "Processing..." : "Check Out Equipment"}
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default CheckOutEquipmentPage;