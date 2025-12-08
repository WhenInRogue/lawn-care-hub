import { useState } from "react";
import ApiService from "@/services/ApiService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserPlus, Mail, Lock, User, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await ApiService.registerUser({ name, email, password, phoneNumber });
      toast({ title: "Registration Successful!", description: `User ${name} has been created` });
      // Clear form after successful registration
      setName("");
      setEmail("");
      setPassword("");
      setPhoneNumber("");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "Error registering user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-elevated animate-slide-up">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
              <UserPlus className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Register New User</CardTitle>
              <CardDescription>Create a new account for LawnCare99</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" required />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="email" 
                  placeholder="Email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  pattern=".+@.+\..+"
                  className="pl-10" 
                  required 
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="tel" 
                  inputMode="numeric"
                  pattern="\d{9,12}"
                  placeholder="Phone Number" 
                  value={phoneNumber} 
                  minLength={9}
                  maxLength={12}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,12}$/.test(value)) {
                      setPhoneNumber(value);
                    }
                  }}
                  className="pl-10" 
                  required 
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Register User"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RegisterPage;
