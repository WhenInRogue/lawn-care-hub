import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import ApiService from "@/services/ApiService";
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, Phone, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await ApiService.getLoggedInUserInfo();
        setUser(userInfo);
      } catch (error: any) {
        toast({ title: "Error", description: "Failed to load profile", variant: "destructive" });
      }
    };
    fetchUser();
  }, []);

  if (!user) return <Layout><div className="flex items-center justify-center h-64">Loading...</div></Layout>;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-elevated overflow-hidden">
          <div className="h-32 gradient-primary" />
          <CardContent className="pt-0 -mt-16">
            <div className="w-24 h-24 rounded-full bg-card border-4 border-card flex items-center justify-center mx-auto shadow-lg">
              <User className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-center mt-4">Hello, {user.name} 🎉</h1>
            <div className="mt-8 space-y-4">
              {[
                { icon: User, label: "Name", value: user.name },
                { icon: Mail, label: "Email", value: user.email },
                { icon: Phone, label: "Phone", value: user.phoneNumber },
                { icon: Shield, label: "Role", value: user.role },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
                  <item.icon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ProfilePage;
