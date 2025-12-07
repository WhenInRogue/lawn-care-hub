import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import ApiService from "@/services/ApiService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";

const DashboardPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedData, setSelectedData] = useState("count");
  const [transactionType, setTransactionType] = useState("all");
  const [selectedSupply, setSelectedSupply] = useState("all");
  const [supplies, setSupplies] = useState<any[]>([]);
  const [supplyTransactionData, setSupplyTransactionData] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSupplies = async () => {
      try {
        const response = await ApiService.getAllSupplies();
        if (response.status === 200) {
          setSupplies(response.supplies || []);
        }
      } catch (error: any) {
        console.error("Failed to fetch supplies");
      }
    };
    fetchSupplies();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiService.getAllSupplyTransactions();
        if (response.status === 200) {
          console.log("Transaction data sample:", response.supplyTransactions?.[0]);
          setSupplyTransactionData(transformData(response.supplyTransactions, selectedMonth, selectedYear, transactionType, selectedSupply));
        }
      } catch (error: any) {
        toast({ title: "Error", description: "Failed to fetch transactions", variant: "destructive" });
      }
    };
    fetchData();
  }, [selectedMonth, selectedYear, transactionType, selectedSupply]);

  const transformData = (transactions: any[], month: number, year: number, type: string, supplyId: string) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const dailyData: Record<number, { day: number; count: number; quantity: number }> = {};
    for (let day = 1; day <= daysInMonth; day++) {
      dailyData[day] = { day, count: 0, quantity: 0 };
    }
    transactions.forEach((t: any) => {
      const date = new Date(t.createdAt);
      const matchesType = type === "all" || t.supplyTransactionType === type;
      const matchesSupply = supplyId === "all" || String(t.supplyId) === supplyId;
      if (date.getMonth() + 1 === month && date.getFullYear() === year && matchesType && matchesSupply) {
        const day = date.getDate();
        dailyData[day].count += 1;
        dailyData[day].quantity += t.quantity;
      }
    });
    return Object.values(dailyData);
  };

  const months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: new Date(0, i).toLocaleString("default", { month: "long" }) }));
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <div className="flex gap-4">
            <Button variant={selectedData === "count" ? "default" : "outline"} onClick={() => setSelectedData("count")}>Transactions</Button>
            <Button variant={selectedData === "quantity" ? "default" : "outline"} onClick={() => setSelectedData("quantity")}>Quantity</Button>
          </div>
        </div>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
            <CardTitle>Daily Supply Transactions</CardTitle>
            <div className="flex gap-4 flex-wrap">
              <Select value={selectedSupply} onValueChange={setSelectedSupply}>
                <SelectTrigger className="w-44"><SelectValue placeholder="All Supplies" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Supplies</SelectItem>
                  {supplies.map((s) => (
                    <SelectItem key={s.supplyId} value={String(s.supplyId)}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="CHECK_IN">Check In</SelectItem>
                  <SelectItem value="CHECK_OUT">Check Out</SelectItem>
                </SelectContent>
              </Select>
              <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(Number(v))}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>{months.map((m) => <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
                <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                <SelectContent>{years.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={supplyTransactionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                  <Legend />
                  <Line type="monotone" dataKey={selectedData} stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DashboardPage;
