import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ApiService from "@/services/ApiService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const AddEditSupplyPage = () => {
  const { supplyId } = useParams();
  const isEdit = Boolean(supplyId);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    unitOfMeasurement: "",
    reorderLevel: "",
    maximumQuantity: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && supplyId) {
      fetchSupply();
    }
  }, [supplyId]);

  const fetchSupply = async () => {
    try {
      const response = await ApiService.getSupplyById(supplyId!);
      if (response.status === 200) {
        const supply = response.supply;
        setFormData({
          name: supply.name || "",
          unitOfMeasurement: supply.unitOfMeasurement || "",
          reorderLevel: String(supply.reorderLevel) || "",
          maximumQuantity: String(supply.maximumQuantity) || "",
        });
      }
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to load supply", variant: "destructive" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        name: formData.name,
        unitOfMeasurement: formData.unitOfMeasurement,
        reorderLevel: Number(formData.reorderLevel),
        maximumQuantity: Number(formData.maximumQuantity),
      };
      if (isEdit) {
        await ApiService.updateSupply(supplyId!, data);
        toast({ title: "Success", description: "Supply updated successfully" });
      } else {
        await ApiService.createSupply(data);
        toast({ title: "Success", description: "Supply created successfully" });
      }
      navigate("/supply");
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Operation failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="form-container animate-fade-in">
        <h1>{isEdit ? "Edit Supply" : "Add New Supply"}</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Supply name"
              required
            />
          </div>
          <div className="form-group">
            <label>Unit of Measurement</label>
            <Input
              name="unitOfMeasurement"
              value={formData.unitOfMeasurement}
              onChange={handleChange}
              placeholder="e.g. gallons, bags, units"
              required
            />
          </div>
          <div className="form-group">
            <label>Reorder Level</label>
            <Input
              name="reorderLevel"
              type="number"
              value={formData.reorderLevel}
              onChange={handleChange}
              placeholder="Minimum stock level"
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label>Maximum Quantity</label>
            <Input
              name="maximumQuantity"
              type="number"
              value={formData.maximumQuantity}
              onChange={handleChange}
              placeholder="Maximum stock capacity"
              min="1"
              required
            />
          </div>
          <div className="button-group">
            <Button type="button" variant="outline" onClick={() => navigate("/supply")}>
              Cancel
            </Button>
            <Button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Update Supply" : "Add Supply"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddEditSupplyPage;