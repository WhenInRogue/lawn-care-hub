import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ApiService from "@/services/ApiService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const AddEditSupplyPage = () => {
  const { supplyId } = useParams();
  const isEdit = Boolean(supplyId);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    quantity: "",
    price: "",
    description: "",
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
          sku: supply.sku || "",
          quantity: String(supply.quantity) || "",
          price: String(supply.price) || "",
          description: supply.description || "",
        });
      }
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to load supply", variant: "destructive" });
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
        ...formData,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
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
            <label>SKU</label>
            <Input
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="SKU code"
              required
            />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <Input
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Quantity"
              required
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <Input
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              required
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
            {loading ? "Saving..." : isEdit ? "Update Supply" : "Add Supply"}
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default AddEditSupplyPage;
