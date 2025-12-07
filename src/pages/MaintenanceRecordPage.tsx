import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ApiService from "@/services/ApiService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import PaginationComponent from "@/components/common/PaginationComponent";
import { Play, CheckCircle } from "lucide-react";

const MaintenanceRecordPage = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showStartForm, setShowStartForm] = useState(false);
  const [showEndForm, setShowEndForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const itemsPerPage = 10;
  const { toast } = useToast();

  const [startFormData, setStartFormData] = useState({
    equipmentId: "",
    description: "",
  });

  const [endFormData, setEndFormData] = useState({
    notes: "",
    cost: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [recordsRes, equipmentRes] = await Promise.all([
        ApiService.getAllMaintenanceRecords(),
        ApiService.getAllEquipment(),
      ]);
      if (recordsRes.status === 200) {
        setRecords(recordsRes.maintenanceRecords);
      }
      if (equipmentRes.status === 200) {
        setEquipment(equipmentRes.equipment);
      }
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleStartMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ApiService.startMaintenance(startFormData);
      toast({ title: "Success", description: "Maintenance started" });
      setShowStartForm(false);
      setStartFormData({ equipmentId: "", description: "" });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to start maintenance", variant: "destructive" });
    }
  };

  const handleEndMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    try {
      await ApiService.endMaintenance({
        maintenanceRecordId: selectedRecord.id,
        notes: endFormData.notes,
        cost: Number(endFormData.cost) || 0,
      });
      toast({ title: "Success", description: "Maintenance completed" });
      setShowEndForm(false);
      setEndFormData({ notes: "", cost: "" });
      setSelectedRecord(null);
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to end maintenance", variant: "destructive" });
    }
  };

  const paginatedRecords = records.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading maintenance records...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="page-header">
          <h1>Maintenance Records</h1>
          <div className="flex gap-3">
            <Button onClick={() => setShowStartForm(true)} className="btn-primary">
              <Play className="w-4 h-4 mr-1" />
              Start Maintenance
            </Button>
          </div>
        </div>

        {showStartForm && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Start New Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStartMaintenance} className="space-y-4">
                <div className="form-group">
                  <label>Select Equipment</label>
                  <Select
                    value={startFormData.equipmentId}
                    onValueChange={(v) => setStartFormData({ ...startFormData, equipmentId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipment.map((e) => (
                        <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <Textarea
                    value={startFormData.description}
                    onChange={(e) => setStartFormData({ ...startFormData, description: e.target.value })}
                    placeholder="Describe the maintenance work"
                    rows={3}
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit">Start Maintenance</Button>
                  <Button type="button" variant="outline" onClick={() => setShowStartForm(false)}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {showEndForm && selectedRecord && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Complete Maintenance - {selectedRecord.equipment?.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEndMaintenance} className="space-y-4">
                <div className="form-group">
                  <label>Completion Notes</label>
                  <Textarea
                    value={endFormData.notes}
                    onChange={(e) => setEndFormData({ ...endFormData, notes: e.target.value })}
                    placeholder="Notes about the completed work"
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label>Cost</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={endFormData.cost}
                    onChange={(e) => setEndFormData({ ...endFormData, cost: e.target.value })}
                    placeholder="Maintenance cost"
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit">Complete Maintenance</Button>
                  <Button type="button" variant="outline" onClick={() => { setShowEndForm(false); setSelectedRecord(null); }}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Equipment</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.equipment?.name || "N/A"}</td>
                  <td>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      record.status === "IN_PROGRESS" 
                        ? "bg-yellow-100 text-yellow-700" 
                        : "bg-green-100 text-green-700"
                    }`}>
                      {record.status === "IN_PROGRESS" ? "In Progress" : "Completed"}
                    </span>
                  </td>
                  <td>{formatDate(record.startDate)}</td>
                  <td>{formatDate(record.endDate)}</td>
                  <td>{record.description || "-"}</td>
                  <td>
                    {record.status === "IN_PROGRESS" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setSelectedRecord(record); setShowEndForm(true); }}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Complete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {records.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No maintenance records found</p>
          </div>
        )}

        {records.length > itemsPerPage && (
          <PaginationComponent
            currentPage={currentPage}
            totalPages={Math.ceil(records.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </Layout>
  );
};

export default MaintenanceRecordPage;
