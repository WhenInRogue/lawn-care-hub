import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ApiService from "@/services/ApiService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const AddEditEquipmentPage = () => {
  const { equipmentId } = useParams();
  const isEdit = Boolean(equipmentId);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    serialNumber: "",
    status: "AVAILABLE",
    location: "",
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
          serialNumber: equipment.serialNumber || "",
          status: equipment.status || "AVAILABLE",
          location: equipment.location || "",
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
      if (isEdit) {
        await ApiService.updateEquipment(equipmentId!, formData);
        toast({ title: "Success", description: "Equipment updated successfully" });
      } else {
        await ApiService.createEquipment(formData);
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
            <label>Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Equipment name"
              required
            />
          </div>
          <div className="form-group">
            <label>Serial Number</label>
            <Input
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              placeholder="Serial number"
              required
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AVAILABLE">Available</SelectItem>
                <SelectItem value="IN_USE">In Use</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="form-group">
            <label>Location</label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              rows={4}
            />
          </div>
          <Button type="submit" className="w-full btn-primary" disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update Equipment" : "Add Equipment"}
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default AddEditEquipmentPage;
