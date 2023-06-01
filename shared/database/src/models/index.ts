
export abstract class Database {
  abstract connect(): Database

  protected client: any;

  // merchants
  abstract insertMerchant(merchant: Input<Merchant>): Promise<Merchant>

  abstract updateMerchantById(id: string, merchant: Partial<Merchant>): Promise<Merchant>

  abstract getMerchantById(id: string): Promise<Merchant>

  abstract deleteMerchantById(id: string): boolean

  // branches
  abstract insertBranch(merchant: Input<Branch>): Promise<Branch>

  abstract getBusinessBranchById(id: string): Promise<Branch>

  abstract updateBusinessBranchById(id: string, merchant: Partial<Branch>): Promise<Branch>

  // user
  abstract insertUser(merchant: Input<UserInput>): Promise<User>

  abstract getUserById(id: string): Promise<User>

  abstract getUserByEmailOrPhone(obj: { email: string, phone: string }): Promise<User>

  abstract updateUserById(id: string, user: Update<User>): Promise<User>
}

export type Input<Type> = Omit<Type, "id" | "merchant">

export type Update<Type> = Partial<Type>;

export type Merchant = {
  id: number
  company_name: string
}

export type Branch = {
  id: number
  merchantId: number
  merchant: Merchant
  location: string
  coordinates: string
  qr_code?: string
  slug: string
}

export type User = {
  id: number
  name: string
  email?: string
  phone?: string
  in_queue: boolean
}

export type UserInput = Omit<User, "in_queue">

