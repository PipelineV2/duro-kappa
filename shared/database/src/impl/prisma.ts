import { Branch, Database, User, Input, Merchant, Update } from "../models";
import { PrismaClient } from "@prisma/client"
import log from "logger";

export class Prisma extends Database {
  connect(): Database {
    try {
      this.client = new PrismaClient()
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
  async insertUser(value: Input<User>): Promise<User> {
    try {
      return this.client.merchant.create({ data: value })
    } catch (error: any) {
      console.log(error.message)
      throw Error(`Record cannot be inserted : ${error.message}`)
    }
  }

  // users
  async getUserById(id: string): Promise<User> {
    console.log(id)
    return {} as User;
  }

  async getUserByEmailOrPhone(obj: { email: string, phone: string }): Promise<User> {
    try {
      const user = await this.client.user.findUnique({
        where: { ...obj }
      })
      return user
    } catch (error) {
      log.error('Could not get user by email or phone')
      throw error;
    }
  }

  async updateUserById(id: string, user: Update<User>): Promise<User> {
    console.log(id, user)
    return {} as User;
  }
}

