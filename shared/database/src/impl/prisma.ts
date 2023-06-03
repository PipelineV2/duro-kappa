import { Branch, Database, User, Admin, Input, Merchant, Update } from "../models";
import { PrismaClient } from "@prisma/client"
import log from "logger";

export class Prisma extends Database {
  connect(): Database {
    try {
      this.client = new PrismaClient()
      log.info('connected');
      return this;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // merchants
  async insertMerchant(merchant: Input<Merchant>): Promise<Merchant> {
    try {
      return this.client.merchant.create({ data: merchant })
    } catch (error: any) {
      console.log(error.message)
      throw Error(`Merchant cannot be inserted : ${error.message}`)
    }
  }

  async getMerchantById(id: string): Promise<Merchant> {
    console.log(id)
    return {} as Merchant;
  }

  async updateMerchantById(id: string, merchant: Partial<Merchant>): Promise<Merchant> {
    return { id, ...merchant } as Merchant;
  }

  deleteMerchantById(id: string): boolean {
    return !!id;
  }

  // branches
  async insertBranch(branch: Input<Branch>): Promise<Branch> {
    try {
      return this.client.branch.create({ data: branch })
    } catch (error: any) {
      console.log(error.message)
      throw Error(`Merchant cannot be inserted : ${error.message}`)
    }
  }

  async getBusinessBranchById(id: string): Promise<Branch> {
    console.log('this is id', id)
    try {
      const me = await this.client.branch.findUnique({
        where: { id: Number.parseInt(id) },
        include: { merchant: true }
      });

      if (me == null) throw new Error("could not find")

      return me;
    } catch (error: any) {
      log.error(error.message);
      throw error;
    }
  }

  async updateBusinessBranchById(id: string, branch: Partial<Branch>): Promise<Branch> {
    console.log(id, branch);
    return {} as Branch;
  }

  // users
  async insertUser(value: Input<User>): Promise<User> {
    try {
      return this.client.user.create({ data: value })
    } catch (error: any) {
      console.log(error.message)
      throw Error(`Record cannot be inserted : ${error.message}`)
    }
  }

  async getUserById(id: string): Promise<User> {
    console.log(id)
    try {
      return this.client.user.findUnique({
        where: { id: Number.parseInt(id) }
      })
    } catch (error: any) {
      log.error("error occured while getting record")
      throw error;
    }
  }

  async getUserByEmailOrPhone(obj: { email?: string, phone?: string }): Promise<User> {
    try {
      return this.client.user.findUnique({
        where: { ...obj }
      })
    } catch (error) {
      log.error('Could not get user by email or phone')
      throw error;
    }
  }

  async updateUserById(id: string, user: Update<User>): Promise<User> {
    try {
      return this.client.user.update({
        where: { id: Number.parseInt(id) },
        data: user
      })
    } catch (error: any) {
      log.error("error occured while updating record");
      throw error;
    }
  }

  // admin
  async insertAdmin(value: Input<Admin>): Promise<Admin> {
    try {
      return this.client.admin.create({ data: value })
    } catch (error: any) {
      console.log(error.message)
      throw Error(`Record cannot be inserted : ${error.message}`)
    }
  }
  async getAdminById(id: string): Promise<Admin> {
    console.log(id)
    return {} as Admin;
  }

  async getAdminByEmail(email: string): Promise<Admin> {
    try {
      const user = await this.client.admin.findUnique({
        where: { email }
      })
      return user
    } catch (error) {
      log.error('Could not get user by email or phone')
      throw error;
    }
  }

  async updateAdminById(id: string, user: Update<Admin>): Promise<Admin> {
    console.log(id, user)
    return {} as Admin;
  }
}

