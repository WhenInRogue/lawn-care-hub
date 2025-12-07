import axios from "axios";
import CryptoJS from "crypto-js";

export default class ApiService {
  static BASE_URL = "http://localhost:5050/api";
  static ENCRYPTION_KEY = "phegon-dev-inventory";

  // Encrypt data using CryptoJS
  static encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.ENCRYPTION_KEY).toString();
  }

  // Decrypt data using CryptoJS
  static decrypt(data: string): string {
    const bytes = CryptoJS.AES.decrypt(data, this.ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Save token with encryption
  static saveToken(token: string): void {
    const encryptedToken = this.encrypt(token);
    localStorage.setItem("token", encryptedToken);
  }

  // Retrieve the token
  static getToken(): string | null {
    const encryptedToken = localStorage.getItem("token");
    if (!encryptedToken) return null;
    return this.decrypt(encryptedToken);
  }

  // Save role with encryption
  static saveRole(role: string): void {
    const encryptedRole = this.encrypt(role);
    localStorage.setItem("role", encryptedRole);
  }

  // Retrieve the role
  static getRole(): string | null {
    const encryptedRole = localStorage.getItem("role");
    if (!encryptedRole) return null;
    return this.decrypt(encryptedRole);
  }

  static clearAuth(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }

  static getHeader() {
    const token = this.getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  /** AUTH && USERS API */
  static async registerUser(registerData: any) {
    const response = await axios.post(
      `${this.BASE_URL}/auth/register`,
      registerData
    );
    return response.data;
  }

  static async loginUser(loginData: any) {
    const response = await axios.post(
      `${this.BASE_URL}/auth/login`,
      loginData
    );
    return response.data;
  }

  static async getAllUsers() {
    const response = await axios.get(`${this.BASE_URL}/users/all`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getLoggedInUserInfo() {
    const response = await axios.get(`${this.BASE_URL}/users/current`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getUserById(userId: string) {
    const response = await axios.get(`${this.BASE_URL}/users/${userId}`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async updateUser(userId: string, userData: any) {
    const response = await axios.put(
      `${this.BASE_URL}/users/update/${userId}`,
      userData,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async deleteUser(userId: string) {
    const response = await axios.delete(
      `${this.BASE_URL}/users/update/${userId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  // Supply Endpoints
  static async createSupply(supplyData: any) {
    const response = await axios.post(
      `${this.BASE_URL}/supplies/add`,
      supplyData,
      {
        headers: {
          ...this.getHeader(),
          Accept: "application/json",
        },
      }
    );
    return response.data;
  }

  static async updateSupply(supplyId: string, supplyData: any) {
    const response = await axios.put(
      `${this.BASE_URL}/supplies/update/${supplyId}`,
      supplyData,
      {
        headers: {
          ...this.getHeader(),
          Accept: "application/json",
        },
      }
    );
    return response.data;
  }

  static async getAllSupplies() {
    const response = await axios.get(`${this.BASE_URL}/supplies/all`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getSupplyById(supplyId: string) {
    const response = await axios.get(`${this.BASE_URL}/supplies/${supplyId}`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async searchSupply(searchValue: string) {
    const response = await axios.get(`${this.BASE_URL}/supplies/search`, {
      params: { searchValue },
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async deleteSupply(supplyId: string) {
    const response = await axios.delete(
      `${this.BASE_URL}/supplies/delete/${supplyId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  // Equipment Endpoints
  static async createEquipment(equipmentData: any) {
    const response = await axios.post(
      `${this.BASE_URL}/equipment/add`,
      equipmentData,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getAllEquipment(equipmentStatus?: string) {
    const config: any = { headers: this.getHeader() };
    if (equipmentStatus) {
      config.params = { equipmentStatus };
    }
    const response = await axios.get(`${this.BASE_URL}/equipment/all`, config);
    return response.data;
  }

  static async getEquipmentById(equipmentId: string) {
    const response = await axios.get(
      `${this.BASE_URL}/equipment/${equipmentId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async updateEquipment(equipmentId: string, equipmentData: any) {
    const response = await axios.put(
      `${this.BASE_URL}/equipment/update/${equipmentId}`,
      equipmentData,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async deleteEquipment(equipmentId: string) {
    const response = await axios.delete(
      `${this.BASE_URL}/equipment/delete/${equipmentId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  // Equipment Transactions Endpoints
  static async checkInEquipment(body: any) {
    const response = await axios.post(
      `${this.BASE_URL}/equipmentTransactions/checkInEquipment`,
      body,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async checkOutEquipment(body: any) {
    const response = await axios.post(
      `${this.BASE_URL}/equipmentTransactions/checkOutEquipment`,
      body,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getAllEquipmentTransactions(equipmentTransactionFilter?: string) {
    const response = await axios.get(
      `${this.BASE_URL}/equipmentTransactions/all`,
      {
        headers: this.getHeader(),
        params: { equipmentTransactionFilter },
      }
    );
    return response.data;
  }

  static async getEquipmentTransactionsByMonthAndYear(
    month: number,
    year: number
  ) {
    const response = await axios.get(
      `${this.BASE_URL}/equipmentTransactions/by-month-year`,
      {
        headers: this.getHeader(),
        params: {
          month: month,
          year: year,
        },
      }
    );
    return response.data;
  }

  static async getEquipmentTransactionById(equipmentTransactionId: string) {
    const response = await axios.get(
      `${this.BASE_URL}/equipmentTransactions/${equipmentTransactionId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  // Supply Transactions Endpoints
  static async checkInSupply(body: any) {
    const response = await axios.post(
      `${this.BASE_URL}/supplyTransactions/checkInSupply`,
      body,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async checkOutSupply(body: any) {
    const response = await axios.post(
      `${this.BASE_URL}/supplyTransactions/checkOutSupply`,
      body,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getAllSupplyTransactions(filter?: string) {
    const response = await axios.get(
      `${this.BASE_URL}/supplyTransactions/all`,
      {
        headers: this.getHeader(),
        params: { filter },
      }
    );
    return response.data;
  }

  static async getSupplyTransactionsByMonthAndYear(month: number, year: number) {
    const response = await axios.get(
      `${this.BASE_URL}/supplyTransactions/by-month-year`,
      {
        headers: this.getHeader(),
        params: {
          month: month,
          year: year,
        },
      }
    );
    return response.data;
  }

  static async getSupplyTransactionById(supplyTransactionId: string) {
    const response = await axios.get(
      `${this.BASE_URL}/supplyTransactions/${supplyTransactionId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  // Maintenance Records Endpoints
  static async startMaintenance(body: any) {
    const response = await axios.post(
      `${this.BASE_URL}/maintenance/start`,
      body,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async endMaintenance(body: any) {
    const response = await axios.post(
      `${this.BASE_URL}/maintenance/end`,
      body,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getAllMaintenanceRecords() {
    const response = await axios.get(`${this.BASE_URL}/maintenance/all`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getMaintenanceRecordsByEquipment(equipmentId: string) {
    const response = await axios.get(
      `${this.BASE_URL}/maintenance/equipment/${equipmentId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  /** AUTHENTICATION CHECKER */
  static logout(): void {
    this.clearAuth();
  }

  static isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  static isAdmin(): boolean {
    const role = this.getRole();
    return role === "ADMIN";
  }
}
