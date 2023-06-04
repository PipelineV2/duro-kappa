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

  async transaction(...args: Promise<Function>[]): Promise<void> {
    try {
      await this.client?.$transaction(args);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // merchants
  async insertMerchant(merchant: Input<Merchant>): Promise<Merchant> {
    try {
      const _merchant = await this.client.merchant.findMany({ where: { company_name: merchant.company_name } })
      if (_merchant.length > 0)
        throw new Error('this merchant already exists.')

      return this.client.merchant.create({ data: merchant })
    } catch (error: any) {
      console.log(error.message)
      throw new Error(`Merchant cannot be inserted : ${error.message}`)
    }
  }

  async getMerchantById(id: string): Promise<Merchant> {
    try {
      return this.client?.merchant.findUnique({
        where: { id },
        include: { branch: true }
      })
    } catch (error: any) {
      log.error("an error occured while getting merchant by id.")
      throw new Error(error.message)
    }
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
      const _branch = await this.client.branch.findMany({ where: { branch: branch.location } })
      if (_branch)
        throw new Error("this branch location already exisits. please contact your admin.");

      return this.client.branch.create({ data: branch })
    } catch (error: any) {
      console.log(error.message)
      throw new Error(`Merchant cannot be inserted : ${error.message}`)
    }
  }

  async getBusinessBranchByBranchName(merchant: number, location: string): Promise<Branch | null> {
    try {
      const branches = await this.client.branch.findMany({
        where: { location, merchantId: merchant },
        include: { merchant: true }
      });

      if (branches.length > 0)
        return branches[0];

      return null;
    } catch (error: any) {
      log.error(error.message);
      throw new Error(error.message);
    }
  }

  async getBusinessBranchById(id: string): Promise<Branch> {
    try {
      const me = await this.client.branch.findUnique({
        where: { id: Number.parseInt(id) },
        include: { merchant: true }
      });

      if (me == null) throw new Error(`could not find the branch with id: ${id}`)

      return me;
    } catch (error: any) {
      log.error(error.message);
      throw new Error(error.message);
    }
  }

  async updateBusinessBranchById(id: string, branch: Partial<Branch>): Promise<Branch> {
    return { id, ...branch } as Branch;
  }

  // users
  async insertUser(value: Input<User>): Promise<User> {
    try {
      return this.client.user.create({ data: value })
    } catch (error: any) {
      console.log(error.message)
      throw new Error(`Record cannot be inserted : ${error.message}`)
    }
  }

  async getUsers(options: Input<User>): Promise<User[]> {
    try {
      return this.client.user.findMany({ where: { ...options } })
    } catch (error: any) {
      log.info("error occured while getting users");
      throw new Error(error.message);
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      return this.client.user.findUnique({
        where: { id: Number.parseInt(id) }
      })
    } catch (error: any) {
      log.error("error occured while getting record")
      throw new Error(error.message);
    }
  }

  async getUserByEmailOrPhone(obj: { email?: string, phone?: string }): Promise<User> {
    try {
      const [result] = await this.client.user.findMany({
        where: { ...obj }
      })
      return result;
    } catch (error: any) {
      log.error('Could not get user by email or phone')
      throw new Error(error.message);
    }
  }

  async updateUserById(id: number, user: Update<User>, where?: Partial<User>): Promise<User> {
    try {
      return this.client.user.updateMany({
        where: { id, ...where },
        data: user
      })
    } catch (error: any) {
      log.error("error occured while updating user record");
      throw new Error(error.message);
    }
  }

  // admin
  async insertAdmin(value: Input<Admin>): Promise<Admin> {
    try {
      return this.client.admin.create({ data: value })
    } catch (error: any) {
      console.log(error.message)
      throw new Error(`admin record could not be inserted : ${error.message}`)
    }
  }
  async getAdminById(id: string): Promise<Admin> {
    try {
      return this.client.admin.findUnique({
        where: { id }
      })
    } catch (error: any) {
      log.error('Could not get user by email or phone')
      throw new Error(error.message);
    }
  }

  async getAdminByEmail(email: string): Promise<Admin> {
    try {
      return this.client.admin.findUnique({
        where: { email }
      })
    } catch (error: any) {
      log.error('Could not get user by email or phone')
      throw new Error(error.message);
    }
  }

  async updateAdminById(id: string, user: Update<Admin>): Promise<Admin> {
    console.log(id, user)
    return {} as Admin;
  }
}

