import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ApiService from "@/services/ApiService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const CheckInEquipmentPage = () => {
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await ApiService.getAllEquipment();
        if (response.status === 200) {
          setEquipmentList(response.equipmentList || []);
        }
      } catch (error) {
        toast({ title: "Error", description: "Failed to load equipment", variant: "destructive" });
      }
    };
    fetchEquipment();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipment) {
      toast({ title: "Error", description: "Please select equipment", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const response = await ApiService.checkInEquipment({ 
        equipmentId: selectedEquipment, 
        description 
      });
      if (response.status === 200) {
        toast({ title: "Success", description: "Equipment checked in successfully" });
        navigate("/equipmentTransactions");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to check in equipment", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>Check In Equipment</h1>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Equipment</label>
            <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
              <SelectTrigger>
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent>
                {equipmentList.map((eq) => (
                  <SelectItem key={eq.id} value={eq.id.toString()}>
                    {eq.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="form-group">
            <label>Description (Optional)</label>
            <Textarea
              placeholder="Enter description or notes"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="button-group">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Check In"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CheckInEquipmentPage;