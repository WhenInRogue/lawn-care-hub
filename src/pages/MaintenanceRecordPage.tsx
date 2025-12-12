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
    totalHoursInput: "",
  });

  const [endFormData, setEndFormData] = useState({
    equipmentId: "",
    totalHoursInput: "",
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
    if (!startFormData.equipmentId || !startFormData.totalHoursInput) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      const body = {
        equipmentId: startFormData.equipmentId,
        totalHoursInput: parseFloat(startFormData.totalHoursInput),
      };
      const response = await ApiService.startMaintenance(body);
      
      if (response.status !== 200) {
        toast.error(response.message || "Failed to start maintenance");
        return;
      }
      
      toast.success(response.message || "Maintenance started");
      setShowStartForm(false);
      setStartFormData({ equipmentId: "", totalHoursInput: "" });
      // Refresh records and equipment list
      const [recordsData, equipmentData] = await Promise.all([
        ApiService.getAllMaintenanceRecords(),
        ApiService.getAllEquipment()
      ]);
      if (recordsData.status === 200) setRecords(recordsData.maintenanceRecords || []);
      if (equipmentData.status === 200) setEquipmentOptions(equipmentData.equipments || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to start maintenance");
    }
  };

  const handleEndMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!endFormData.equipmentId || !endFormData.totalHoursInput || !endFormData.maintenancePerformed) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      const body = {
        equipmentId: endFormData.equipmentId,
        totalHoursInput: parseFloat(endFormData.totalHoursInput),
        maintenancePerformed: endFormData.maintenancePerformed,
        note: endFormData.note,
      };
      const response = await ApiService.endMaintenance(body);
      
      if (response.status !== 200) {
        toast.error(response.message || "Failed to end maintenance");
        return;
      }
      
      toast.success(response.message || "Maintenance completed");
      setShowEndForm(false);
      setEndFormData({ equipmentId: "", totalHoursInput: "", maintenancePerformed: "", note: "" });
      // Refresh records and equipment list
      const [recordsData, equipmentData] = await Promise.all([
        ApiService.getAllMaintenanceRecords(),
        ApiService.getAllEquipment()
      ]);
      if (recordsData.status === 200) setRecords(recordsData.maintenanceRecords || []);
      if (equipmentData.status === 200) setEquipmentOptions(equipmentData.equipments || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to end maintenance");
    }
  };

  const totalPages = Math.ceil(records.length / itemsPerPage);
  const paginatedRecords = records.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter equipment by status for forms
  const availableEquipment = equipmentOptions.filter(
    (eq: any) => eq.equipmentStatus === "AVAILABLE"
  );
  const maintenanceEquipment = equipmentOptions.filter(
    (eq: any) => eq.equipmentStatus === "MAINTENANCE"
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
              value={selectedEquipmentId || "all"}
              onValueChange={(value) => {
                setSelectedEquipmentId(value === "all" ? "" : value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Equipment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Equipment</SelectItem>
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
                      {availableEquipment.length === 0 ? (
                        <SelectItem value="none" disabled>No available equipment</SelectItem>
                      ) : (
                        availableEquipment.map((e: any) => (
                          <SelectItem key={e.equipmentId} value={String(e.equipmentId)}>{e.name}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="form-group">
                  <label>Total Hours</label>
                  <Input
                    type="number"
                    value={startFormData.totalHoursInput}
                    onChange={(e) => setStartFormData({ ...startFormData, totalHoursInput: e.target.value })}
                    placeholder="Enter total hours"
                    required
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
                      <SelectValue placeholder="Choose equipment under maintenance" />
                    </SelectTrigger>
                    <SelectContent>
                      {maintenanceEquipment.length === 0 ? (
                        <SelectItem value="none" disabled>No equipment under maintenance</SelectItem>
                      ) : (
                        maintenanceEquipment.map((e: any) => (
                          <SelectItem key={e.equipmentId} value={String(e.equipmentId)}>{e.name}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="form-group">
                  <label>Total Hours</label>
                  <Input
                    type="number"
                    value={endFormData.totalHoursInput}
                    onChange={(e) => setEndFormData({ ...endFormData, totalHoursInput: e.target.value })}
                    placeholder="Enter total hours"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Maintenance Performed</label>
                  <Input
                    type="text"
                    value={endFormData.maintenancePerformed}
                    onChange={(e) => setEndFormData({ ...endFormData, maintenancePerformed: e.target.value })}
                    placeholder="Describe what maintenance was performed"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Note</label>
                  <Input
                    type="text"
                    value={endFormData.note}
                    onChange={(e) => setEndFormData({ ...endFormData, note: e.target.value })}
                    placeholder="Additional notes"
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