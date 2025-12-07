import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import ApiService from "@/services/ApiService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import PaginationComponent from "@/components/common/PaginationComponent";
import { Play, CheckCircle } from "lucide-react";

interface MaintenanceRecord {
  maintenanceRecordId: number;
  maintenancePerformed: string;
  note: string;
  totalHoursAtMaintenance: number;
  performedAt: string;
  equipment?: {
    equipmentId: number;
    name: string;
  };
}

interface Equipment {
  equipmentId: number;
  name: string;
}

const MaintenanceRecordPage = () => {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [equipmentOptions, setEquipmentOptions] = useState<Equipment[]>([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showStartForm, setShowStartForm] = useState(false);
  const [showEndForm, setShowEndForm] = useState(false);
  const itemsPerPage = 10;

  const [startFormData, setStartFormData] = useState({
    equipmentId: "",
    description: "",
  });

  const [endFormData, setEndFormData] = useState({
    equipmentId: "",
    maintenancePerformed: "",
    note: "",
  });

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const equipmentData = await ApiService.getAllEquipment();
        if (equipmentData.status === 200) {
          setEquipmentOptions(equipmentData.equipments || []);
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Error fetching equipment list");
      }
    };
    fetchEquipment();
  }, []);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        let maintenanceRecordData;

        if (selectedEquipmentId) {
          maintenanceRecordData = await ApiService.getMaintenanceRecordsByEquipment(selectedEquipmentId);
        } else {
          maintenanceRecordData = await ApiService.getAllMaintenanceRecords();
        }

        if (maintenanceRecordData.status === 200) {
          setRecords(maintenanceRecordData.maintenanceRecords || []);
        } else {
          setRecords([]);
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Error fetching maintenance records");
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [selectedEquipmentId]);

  const handleStartMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ApiService.startMaintenance(startFormData);
      toast.success("Maintenance started");
      setShowStartForm(false);
      setStartFormData({ equipmentId: "", description: "" });
      // Refresh records
      const data = await ApiService.getAllMaintenanceRecords();
      if (data.status === 200) setRecords(data.maintenanceRecords || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to start maintenance");
    }
  };

  const handleEndMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ApiService.endMaintenance(endFormData);
      toast.success("Maintenance completed");
      setShowEndForm(false);
      setEndFormData({ equipmentId: "", maintenancePerformed: "", note: "" });
      // Refresh records
      const data = await ApiService.getAllMaintenanceRecords();
      if (data.status === 200) setRecords(data.maintenanceRecords || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to end maintenance");
    }
  };

  const totalPages = Math.ceil(records.length / itemsPerPage);
  const paginatedRecords = records.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          <div className="flex gap-3 items-center">
            <Select
              value={selectedEquipmentId}
              onValueChange={(value) => {
                setSelectedEquipmentId(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Equipment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Equipment</SelectItem>
                {equipmentOptions.map((equipment) => (
                  <SelectItem key={equipment.equipmentId} value={String(equipment.equipmentId)}>
                    {equipment.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => setShowStartForm(true)} className="btn-primary">
              <Play className="w-4 h-4 mr-1" />
              Start Maintenance
            </Button>
            <Button onClick={() => setShowEndForm(true)} variant="secondary">
              <CheckCircle className="w-4 h-4 mr-1" />
              End Maintenance
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
                      {equipmentOptions.map((e) => (
                        <SelectItem key={e.equipmentId} value={String(e.equipmentId)}>{e.name}</SelectItem>
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

        {showEndForm && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>End Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEndMaintenance} className="space-y-4">
                <div className="form-group">
                  <label>Select Equipment</label>
                  <Select
                    value={endFormData.equipmentId}
                    onValueChange={(v) => setEndFormData({ ...endFormData, equipmentId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipmentOptions.map((e) => (
                        <SelectItem key={e.equipmentId} value={String(e.equipmentId)}>{e.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="form-group">
                  <label>Maintenance Performed</label>
                  <Textarea
                    value={endFormData.maintenancePerformed}
                    onChange={(e) => setEndFormData({ ...endFormData, maintenancePerformed: e.target.value })}
                    placeholder="Describe what maintenance was performed"
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label>Note</label>
                  <Textarea
                    value={endFormData.note}
                    onChange={(e) => setEndFormData({ ...endFormData, note: e.target.value })}
                    placeholder="Additional notes"
                    rows={2}
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit">Complete Maintenance</Button>
                  <Button type="button" variant="outline" onClick={() => setShowEndForm(false)}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Maintenance Performed</th>
                <th>Note</th>
                <th>Total Hours When Performed</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.map((record) => (
                <tr key={record.maintenanceRecordId}>
                  <td>{record.maintenancePerformed || "-"}</td>
                  <td>{record.note || "-"}</td>
                  <td>{record.totalHoursAtMaintenance}</td>
                  <td>{new Date(record.performedAt).toLocaleString()}</td>
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
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </Layout>
  );
};

export default MaintenanceRecordPage;