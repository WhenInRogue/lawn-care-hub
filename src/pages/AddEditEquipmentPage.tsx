import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ApiService from "@/services/ApiService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const AddEditEquipmentPage = () => {
  const { equipmentId } = useParams();
  const isEdit = Boolean(equipmentId);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    totalHours: "",
    maintenanceIntervalHours: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && equipmentId) {
      fetchEquipment();
    }
  }, [equipmentId]);

  const fetchEquipment = async () => {
    try {
      const response = await ApiService.getEquipmentById(equipmentId!);
      if (response.status === 200) {
        const equipment = response.equipment;
        setFormData({
          name: equipment.name || "",
          totalHours: equipment.totalHours?.toString() || "",
          maintenanceIntervalHours: equipment.maintenanceIntervalHours?.toString() || "",
          description: equipment.description || "",
        });
      }
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to load equipment", variant: "destructive" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        name: formData.name,
        totalHours: Number(formData.totalHours),
        maintenanceIntervalHours: Number(formData.maintenanceIntervalHours),
        description: formData.description,
      };
      if (isEdit) {
        await ApiService.updateEquipment(equipmentId!, data);
        toast({ title: "Success", description: "Equipment updated successfully" });
      } else {
        await ApiService.createEquipment(data);
        toast({ title: "Success", description: "Equipment created successfully" });
      }
      navigate("/equipment");
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Operation failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="form-container animate-fade-in">
        <h1>{isEdit ? "Edit Equipment" : "Add New Equipment"}</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Equipment Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Equipment name"
              required
            />
          </div>
          <div className="form-group">
            <label>Total Hours</label>
            <Input
              name="totalHours"
              type="number"
              value={formData.totalHours}
              onChange={handleChange}
              placeholder="e.g. 0"
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label>Maintenance Interval (Hours)</label>
            <Input
              name="maintenanceIntervalHours"
              type="number"
              value={formData.maintenanceIntervalHours}
              onChange={handleChange}
              placeholder="e.g. 100"
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Equipment description (optional)"
            />
          </div>
          <div className="button-group">
            <Button type="button" variant="outline" onClick={() => navigate("/equipment")}>
              Cancel
            </Button>
            <Button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Update Equipment" : "Add Equipment"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddEditEquipmentPage;