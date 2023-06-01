import { createClient } from '@supabase/supabase-js'
import log from "logger";

// Create a single supabase client for interacting with your database
export interface Storage {
  client: any;

  connect(): this;

  get(file: string): string

  upload<T>(file: string, object: T): Promise<string>
}

const MERCHANTS_QR_BUCKET = 'merchant-qr-codes';


class Supabase implements Storage {
  client: any;

  connect(): this {
    try {
      this.client = createClient('https://oelljigkkingcydffvan.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lbGxqaWdra2luZ2N5ZGZmdmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU0NDk2MDEsImV4cCI6MjAwMTAyNTYwMX0.L3AQ0A9dYjXwe2_rkubMZR1NseGmybksT4f0e_XjdkA')
      return this;
    } catch (error: any) {
      log.error('could not connect to client')
      throw new Error(error.message);
    }
  }

  get(file: string): string {
    return file;
  }

  // this function will replace the old file with the latest one provided the file 
  // has been uploaded already
  async upload<T>(file: string, object: T): Promise<string> {
    log.info(file, object);
    try {
      const { error } = await this.client
        .storage
        .from(MERCHANTS_QR_BUCKET)
        .upload(`public/${file}`, object, {
          contentType: 'image/png',
          upsert: true,
          cacheControl: 3600
        });
      if (error) throw new Error(error.message)
      log.info("successfully uploaded file ", file);

      const { data: url } = this.client
        .storage
        .from(MERCHANTS_QR_BUCKET)
        .getPublicUrl(`public/${file}`)
      return url;
    } catch (error: any) {
      log.error("could not upload file.")
      throw error;
    }
  }
}

export default (function() {
  let instance: Storage;

  return (): Storage => {
    if (!instance)
      instance = new Supabase();
    return instance;
  }
})();


